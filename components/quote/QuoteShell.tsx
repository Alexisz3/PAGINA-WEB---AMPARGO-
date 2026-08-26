"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import QuoteStepper from "./QuoteStepper";
import ReferenceUploader from "./ReferenceUploader";
import DeliveryChannelSelector, { type Channel } from "./DeliveryChannelSelector";
import QuoteSummary from "./QuoteSummary";

export interface ServiceOption {
  /** ID estable, no traducido. Es lo que viaja en ?servicio= */
  id: string;
  label: string;
}

/**
 * Clave de persistencia del borrador.
 *
 * Solo texto: nunca archivos ni blobs, que llenarían el almacenamiento.
 * Se usa `sessionStorage` y no `localStorage` porque son datos de una sesión
 * de contacto, no una preferencia duradera: al cerrar la pestaña desaparecen.
 * Tampoco viajan en la query string, para no dejar datos personales en URLs
 * que se comparten o quedan en el historial.
 */
const DRAFT_KEY = "apc-quote-draft";

/**
 * Clave anterior al cambio de marca.
 *
 * Se sigue leyendo para no descartar el borrador de alguien que tenga la
 * pestaña abierta justo cuando se despliega la versión nueva: perdería lo
 * escrito sin motivo visible, que es la peor forma de perder una solicitud.
 * Solo se lee; a partir de ahí todo se guarda ya en `DRAFT_KEY`.
 */
const LEGACY_DRAFT_KEY = "ampargo-quote-draft";

/** Campos que se persisten. `photoCount` queda fuera a propósito: los
 *  archivos no sobreviven a una recarga y anunciar un número que ya no
 *  corresponde a nada sería engañoso. */
type PersistedDraft = Omit<QuoteDraft, "photoCount"> & { step?: number };

export interface QuoteDraft {
  service: string;
  location: string;
  description: string;
  photoCount: number;
  name: string;
  phone: string;
  email: string;
  channel: Channel | null;
  consent: boolean;
}

const FIELD =
  "w-full border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors focus:border-accent";

/** Borde de error, para que el fallo no se comunique solo con texto. */
const fieldClass = (error?: string) =>
  error ? `${FIELD} border-error focus:border-error` : FIELD;

/**
 * Mensaje de error de un campo.
 *
 * `role="alert"` hace que el lector de pantalla lo anuncie al aparecer, sin
 * necesidad de que la persona vuelva a recorrer el formulario buscándolo.
 * El color NO es el único indicador: el texto explica qué corregir, porque
 * un borde rojo no dice nada a quien no distingue el rojo.
 */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-error">
      {message}
    </p>
  );
}

/**
 * Shell del flujo de cotización en 3 etapas.
 *
 * IMPORTANTE — alcance honesto: esta es la capa de interfaz. La persistencia
 * real, la subida a almacenamiento privado y los canales de entrega están
 * DISEÑADOS pero no conectados, porque el cliente aún no ha contratado base
 * de datos, almacenamiento ni proveedor de correo. Por eso el envío final
 * muestra un aviso explícito de modo desarrollo en lugar de afirmar que la
 * solicitud se envió. Ver AUDITORIA_Y_PLAN_AMPARGO.md §11.
 */
export interface WhatsAppTarget {
  /** E.164 sin signos, como lo espera wa.me. */
  phone: string;
  name: string;
}

export default function QuoteShell({
  services,
  initialServiceId,
  whatsappTargets,
  businessEmail,
}: {
  services: ServiceOption[];
  initialServiceId?: string;
  /** Llegan por props y no por import: `lib/site` lee variables de entorno
   *  que no existen en el navegador. */
  whatsappTargets: WhatsAppTarget[];
  businessEmail: string | null;
}) {
  const t = useTranslations("Quote");
  const [step, setStep] = useState(1);
  /** URL de wa.me ya abierta, para poder reabrirla sin recomponer nada. */
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuoteDraft>({
    service: "", location: "", description: "",
    photoCount: 0, name: "", phone: "", email: "",
    channel: null, consent: false,
  });

  /*
   * Validación por etapa.
   *
   * Antes no existía: se podía recorrer las tres etapas y llegar al resumen
   * con absolutamente todo vacío. Para el contratista eso produce una
   * solicitud sin nombre, sin teléfono y sin descripción — un aviso que no se
   * puede responder, que es peor que no recibir nada porque hace perder tiempo.
   *
   * Qué se exige y qué no:
   *  · Descripción — sin ella no hay nada que cotizar.
   *  · Nombre — hace falta para dirigirse a alguien.
   *  · Teléfono O correo, indistintamente. Exigir ambos es la forma más común
   *    de perder solicitudes: mucha gente da uno y no el otro a propósito.
   *  · Canal y consentimiento — sin permiso no se puede contactar.
   *
   * Servicio, ubicación y fotos quedan OPCIONALES: son útiles, no
   * imprescindibles, y cada campo obligatorio de más cuesta conversiones.
   */
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteDraft, string>>>({});

  const validateStep = (n: number): Partial<Record<keyof QuoteDraft, string>> => {
    const e: Partial<Record<keyof QuoteDraft, string>> = {};
    if (n === 1 && draft.description.trim().length < 4) e.description = t("errDescription");
    if (n === 3) {
      if (!draft.name.trim()) e.name = t("errName");

      const phone = draft.phone.replace(/\D/g, "");
      const email = draft.email.trim();
      if (!phone && !email) {
        // El mensaje se ancla al teléfono, que es el primero de los dos.
        e.phone = t("errContact");
      } else {
        // Solo se valida el formato de lo que la persona SÍ escribió.
        if (phone && phone.length < 10) e.phone = t("errPhone");
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) e.email = t("errEmail");
      }

      if (!draft.channel) e.channel = t("errChannel");
      if (!draft.consent) e.consent = t("errConsent");
    }
    return e;
  };

  /**
   * Compone el mensaje que se abre en WhatsApp.
   *
   * Solo se incluyen los campos que la persona rellenó: un mensaje con
   * "Ubicación: —" delata un formulario, y lo que debe llegarle al contratista
   * parece —y es— un mensaje escrito por un cliente.
   *
   * Las fotos NO viajan en el enlace: wa.me solo admite texto. Se anuncia que
   * están listas para que la persona las adjunte en la misma conversación,
   * que es exactamente lo que ya haría de forma natural.
   */
  const buildMessage = (): string => {
    const serviceLabel = services.find((s) => s.id === draft.service)?.label;
    const lines = [t("msgIntro"), ""];
    const add = (label: string, value: string) => value && lines.push(`${label}: ${value}`);

    if (serviceLabel) add(t("msgService"), serviceLabel);
    add(t("msgLocation"), draft.location.trim());
    add(t("msgDescription"), draft.description.trim());
    lines.push("");
    add(t("msgName"), draft.name.trim());
    add(t("msgPhone"), draft.phone.trim());
    add(t("msgEmail"), draft.email.trim());
    if (draft.photoCount > 0) lines.push("", t("msgPhotos"));

    return lines.join("\n");
  };

  /**
   * Entrega por WhatsApp.
   *
   * `wa.me` NO envía nada: abre la conversación con el texto redactado y es la
   * persona quien pulsa enviar. Por eso la pantalla siguiente dice que
   * WhatsApp está abierto, nunca que la solicitud se recibió — afirmarlo sería
   * mentir sobre algo que el sitio no puede comprobar.
   */
  const submitViaWhatsApp = () => {
    const e = validateStep(3);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(Object.keys(e)[0])?.focus();
      return;
    }
    const target = whatsappTargets[0];
    const url = buildWhatsAppLink(target.phone, buildMessage());
    if (!url) return;

    track("quote_submitted", { channel: draft.channel ?? "whatsapp", service: draft.service || "none" });
    setHandoffUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // El foco va al primer campo con problema: sin esto, quien navega con
      // teclado o lector de pantalla no sabe que algo falló.
      const first = Object.keys(e)[0];
      document.getElementById(first)?.focus();
      return;
    }
    track("quote_step_completed", { step });
    setStep((s) => Math.min(3, s + 1));
  };

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    /*
     * El error se retira en cuanto la persona toca el campo, no al reintentar
     * enviar. Dejar un mensaje en rojo bajo un campo que ya se corrigió es
     * desconcertante y hace dudar de si el formulario funciona.
     */
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      // Teléfono y correo se validan como pareja: corregir uno limpia al otro.
      if (key === "phone" || key === "email") {
        delete next.phone;
        delete next.email;
      }
      return next;
    });
  };

  const restored = useRef(false);

  /*
   * Restaura el borrador y aplica la preselección de servicio.
   *
   * Orden importante: lo escrito por el visitante gana sobre `?servicio=`.
   * Si alguien ya eligió un servicio y luego llega un enlace con otro, no se
   * le sobrescribe la elección.
   */
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;

    let saved: Partial<PersistedDraft> = {};
    try {
      // Se prueba la clave actual y, si no hay nada, la anterior al cambio de
      // marca: así un borrador a medias sobrevive al despliegue.
      const raw =
        window.sessionStorage.getItem(DRAFT_KEY) ??
        window.sessionStorage.getItem(LEGACY_DRAFT_KEY);
      if (raw) saved = JSON.parse(raw) as Partial<PersistedDraft>;
      window.sessionStorage.removeItem(LEGACY_DRAFT_KEY);
    } catch {
      /* almacenamiento no disponible o JSON corrupto: se sigue sin borrador */
    }

    // El ID de la URL solo se acepta si corresponde a un servicio real.
    const validInitial =
      initialServiceId && services.some((s) => s.id === initialServiceId)
        ? initialServiceId
        : "";

    const savedStep = Number(saved.step ?? 0);

    /*
     * setState dentro de un efecto, a propósito y una sola vez.
     *
     * `sessionStorage` no existe durante el render del servidor, así que no
     * se puede leer en el inicializador de `useState` sin provocar un
     * desajuste de hidratación. Este es el caso que los efectos existen para
     * cubrir: sincronizar con un sistema externo al montar. El centinela
     * `restored` garantiza que ocurre una única vez y no encadena renders.
     */
    setDraft((d) => ({ ...d, ...saved, service: saved.service || validInitial || d.service }));
    if (savedStep >= 1 && savedStep <= 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ver comentario arriba
      setStep(savedStep);
    }
  }, [initialServiceId, services]);

  /*
   * Inicio del embudo: se registra una sola vez por montaje del formulario.
   * Sin el centinela, cada re-render dispararía el evento y la tasa de
   * conversión saldría dividida por un número arbitrario.
   */
  const startTracked = useRef(false);
  useEffect(() => {
    if (startTracked.current) return;
    startTracked.current = true;
    track("quote_started", { service: initialServiceId || "none" });
  }, [initialServiceId]);

  // Persiste en cada cambio, excepto el conteo de fotos.
  useEffect(() => {
    if (!restored.current) return;
    try {
      const { photoCount: _omit, ...rest } = draft;
      void _omit;
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...rest, step }));
    } catch {
      /* almacenamiento lleno o bloqueado: el formulario sigue funcionando */
    }
  }, [draft, step]);

  return (
    <section className="bg-paper py-12 lg:py-16">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-[1fr_380px] lg:px-10">
        <div>
          <QuoteStepper current={step} onStepChange={setStep} />

          <div className="mt-10">
            {step === 1 ? (
              <fieldset className="space-y-6">
                <legend className="sr-only">{t("step1")}</legend>

                <div>
                  <label htmlFor="service" className="mb-2 block text-sm font-medium text-ink">
                    {t("serviceLabel")}
                  </label>
                  <select
                    id="service"
                    className={FIELD}
                    value={draft.service}
                    onChange={(e) => update("service", e.target.value)}
                  >
                    <option value="">{t("servicePlaceholder")}</option>
                    {/* El VALOR es el ID estable, no la etiqueta traducida:
                        así el borrador sobrevive a un cambio de idioma. */}
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-medium text-ink">
                    {t("locationLabel")}
                  </label>
                  <input
                    id="location"
                    className={FIELD}
                    placeholder={t("locationPlaceholder")}
                    autoComplete="postal-code"
                    value={draft.location}
                    onChange={(e) => update("location", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-ink">
                    {t("descriptionLabel")}
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    maxLength={2000}
                    className={fieldClass(errors.description)}
                    placeholder={t("descriptionPlaceholder")}
                    value={draft.description}
                    aria-invalid={errors.description ? true : undefined}
                    aria-describedby={errors.description ? "description-error" : undefined}
                    onChange={(e) => update("description", e.target.value)}
                  />
                  <FieldError id="description-error" message={errors.description} />
                </div>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <ReferenceUploader onCountChange={(n) => update("photoCount", n)} />
            ) : null}

            {step === 3 ? (
              <fieldset className="space-y-6">
                <legend className="sr-only">{t("step3")}</legend>

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
                    {t("nameLabel")}
                  </label>
                  <input
                    id="name"
                    className={fieldClass(errors.name)}
                    placeholder={t("namePlaceholder")}
                    autoComplete="name"
                    value={draft.name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(e) => update("name", e.target.value)}
                  />
                  <FieldError id="name-error" message={errors.name} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">
                      {t("phoneLabel")}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={fieldClass(errors.phone)}
                      value={draft.phone}
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
                      {t("emailLabel")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className={fieldClass(errors.email)}
                      value={draft.email}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>
                </div>

                <div id="channel">
                  <DeliveryChannelSelector
                    value={draft.channel}
                    onChange={(c) => update("channel", c)}
                  />
                  <FieldError id="channel-error" message={errors.channel} />
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-muted">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={draft.consent}
                      aria-invalid={errors.consent ? true : undefined}
                      aria-describedby={errors.consent ? "consent-error" : undefined}
                      onChange={(e) => update("consent", e.target.checked)}
                      className="mt-1 h-5 w-5 accent-accent"
                    />
                    {t("consent")}
                  </label>
                  <FieldError id="consent-error" message={errors.consent} />
                </div>

                {/* Sin correo empresarial configurado, el canal de correo no
                    puede entregar nada; se dice en vez de ofrecerlo roto. */}
                {!businessEmail ? (
                  <p className="border-l-2 border-line bg-surface p-4 text-sm text-muted">
                    {t("emailUnavailable")}
                  </p>
                ) : null}

                {/*
                  Confirmación deliberadamente literal. `wa.me` abre WhatsApp
                  con el texto redactado; el envío lo hace la persona. Decir
                  "hemos recibido su solicitud" sería afirmar algo que el sitio
                  no puede comprobar, y dejaría a alguien esperando respuesta a
                  un mensaje que nunca llegó a enviar.
                */}
                {handoffUrl ? (
                  <div role="status" className="border-l-2 border-success bg-surface p-4">
                    <p className="font-display text-base font-semibold text-ink">
                      {t("handoffHeading")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t("handoffBody")}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={handoffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center border border-ink px-4 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                      >
                        {t("handoffReopen")}
                      </a>
                      <button
                        type="button"
                        onClick={() => setHandoffUrl(null)}
                        className="inline-flex min-h-[44px] items-center px-2 text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
                      >
                        {t("handoffEdit")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={submitViaWhatsApp}
                    className="inline-flex min-h-[52px] w-full items-center justify-center bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
                  >
                    {t("sendWhatsapp")}
                  </button>
                )}
              </fieldset>
            ) : null}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex min-h-[48px] items-center gap-2 border border-line px-5 text-sm text-ink transition-colors hover:border-ink disabled:opacity-40"
            >
              {t("back")}
            </button>
            <button
              type="button"
              // Valida antes de avanzar y registra la etapa que se deja.
              onClick={goNext}
              disabled={step === 3}
              className="inline-flex min-h-[48px] items-center gap-2 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover disabled:opacity-40"
            >
              {t("next")}
            </button>
          </div>
        </div>

        <QuoteSummary draft={draft} services={services} />
      </div>
    </section>
  );
}
