"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@/lib/analytics";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildMailtoLink } from "@/lib/email";
import { pickContactIndex, quoteSeed } from "@/lib/assignment";
import QuoteStepper, { TOTAL_STEPS } from "./QuoteStepper";
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

/** Lo que se persiste: el borrador entero más la etapa en curso. */
type PersistedDraft = QuoteDraft & { step?: number };

export interface QuoteDraft {
  service: string;
  location: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  channel: Channel | null;
  consent: boolean;
}

/**
 * Etapa a la que pertenece cada campo.
 *
 * Existe para que un error SIEMPRE se pueda mostrar: si la validación de
 * envío encuentra un fallo en una etapa que no está en pantalla, hay que
 * viajar a esa etapa antes de enfocar el campo. Sin este mapa, el formulario
 * podía quedarse bloqueado señalando un error invisible.
 */
const FIELD_STEP: Record<keyof QuoteDraft, number> = {
  service: 1,
  location: 1,
  description: 1,
  name: 2,
  phone: 2,
  email: 2,
  channel: 2,
  consent: 2,
};

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
 * Shell del flujo de cotización en 2 etapas: Proyecto y Contacto.
 *
 * IMPORTANTE — alcance honesto: esta es la capa de interfaz. La persistencia
 * real (base de datos, fotos archivadas) sigue DISEÑADA pero no conectada,
 * porque el cliente aún no la ha contratado. El canal de correo, en cambio,
 * ya está conectado: `contacto@ampargo.com` existe (Zoho Mail) desde el 3 de
 * septiembre de 2026, y quien elige "Correo" recibe de verdad un `mailto:`,
 * no WhatsApp por defecto. La entrega, por cualquiera de los dos canales,
 * sigue sin acuse de recibo — la confirmación lo dice literalmente.
 *
 * Hubo una tercera etapa de subida de fotos y se retiró en la fase 4. Subía
 * archivos que no salían nunca del navegador —`wa.me` solo admite texto— y el
 * mensaje anunciaba al contratista unas fotos que no existían. Ahora la
 * confirmación invita a adjuntarlas en el propio chat, que es donde WhatsApp
 * las maneja mejor que cualquier enlace. Ver AUDITORIA_Y_PLAN_AMPARGO.md §11.
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
  /** URL (wa.me o mailto:) ya abierta, para poder reabrirla sin recomponer nada. */
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null);
  /** Canal que se usó de verdad en el envío. Se fija al enviar, no se lee de
   *  `draft.channel` en el render: así un cambio de canal después de enviar
   *  —antes de pulsar «Corregir algo antes»— no desincroniza el texto de
   *  confirmación del enlace que en realidad quedó abierto. */
  const [handoffChannel, setHandoffChannel] = useState<Channel | null>(null);
  const [draft, setDraft] = useState<QuoteDraft>({
    service: "", location: "", description: "",
    name: "", phone: "", email: "",
    channel: null, consent: false,
  });

  /*
   * Validación por etapa.
   *
   * Antes no existía: se podía recorrer las etapas y llegar al resumen con
   * absolutamente todo vacío. Para el contratista eso produce una solicitud
   * sin nombre, sin teléfono y sin descripción — un aviso que no se puede
   * responder, que es peor que no recibir nada porque hace perder tiempo.
   *
   * Qué se exige y qué no:
   *  · Descripción — sin ella no hay nada que cotizar.
   *  · Nombre — hace falta para dirigirse a alguien.
   *  · Teléfono O correo, indistintamente. Exigir ambos es la forma más común
   *    de perder solicitudes: mucha gente da uno y no el otro a propósito.
   *  · Canal y consentimiento — sin permiso no se puede contactar.
   *
   * Servicio y ubicación quedan OPCIONALES: son útiles, no imprescindibles,
   * y cada campo obligatorio de más cuesta conversiones.
   */
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteDraft, string>>>({});

  const validateStep = (n: number): Partial<Record<keyof QuoteDraft, string>> => {
    const e: Partial<Record<keyof QuoteDraft, string>> = {};
    if (n === 1 && draft.description.trim().length < 4) e.description = t("errDescription");
    if (n === 2) {
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
   * Errores acumulados de las etapas 1..n.
   *
   * Este es el arreglo del defecto que reabría el agujero que la validación
   * por etapa decía haber cerrado: `validateStep(3)` solo miraba los campos de
   * contacto, así que pulsando directamente el círculo de la última etapa se
   * podía enviar una solicitud SIN descripción del proyecto. El envío ahora
   * valida todas las etapas, no solo aquella en la que uno esté parado.
   *
   * El orden de las claves importa: se recorre de la etapa 1 hacia adelante,
   * de modo que el primer error siempre es el más temprano del formulario y
   * es el que recibe el foco.
   */
  const validateThrough = (n: number): Partial<Record<keyof QuoteDraft, string>> => {
    let all: Partial<Record<keyof QuoteDraft, string>> = {};
    for (let i = 1; i <= n; i++) all = { ...all, ...validateStep(i) };
    return all;
  };

  /**
   * Lleva el foco al primer campo que falta, viajando antes a su etapa.
   *
   * El anuncio lo hace el propio `role="alert"` de `FieldError`: el mensaje
   * aparece en el DOM al pintarse los errores y el lector de pantalla lo lee
   * sin que haga falta una región extra. Por eso el foco se aplaza un frame:
   * si se enfocara antes de que React pinte la etapa de destino, el campo
   * todavía no existe y el foco se quedaría en el círculo del stepper.
   */
  const focusFirstError = (e: Partial<Record<keyof QuoteDraft, string>>) => {
    const first = Object.keys(e)[0] as keyof QuoteDraft | undefined;
    if (!first) return;
    setStep(FIELD_STEP[first]);
    requestAnimationFrame(() => {
      document.getElementById(first)?.focus();
    });
  };

  /**
   * Compone el mensaje que se abre en WhatsApp.
   *
   * Solo se incluyen los campos que la persona rellenó: un mensaje con
   * "Ubicación: —" delata un formulario, y lo que debe llegarle al contratista
   * parece —y es— un mensaje escrito por un cliente.
   *
   * No se menciona ninguna foto. Se mencionaba, y era falso: `wa.me` solo
   * admite texto, así que el contratista leía "fotos listas para enviar" y no
   * recibía ninguna. La invitación a adjuntarlas está ahora en la pantalla de
   * confirmación, dirigida a quien sí puede hacerlo: el propio visitante.
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

    return lines.join("\n");
  };

  /**
   * Entrega por WhatsApp o por correo, según el canal elegido.
   *
   * Ninguno de los dos ENVÍA nada: `wa.me` abre la conversación y `mailto:`
   * abre el programa de correo, ambos con el texto ya redactado, y es la
   * persona quien pulsa enviar. Por eso la pantalla siguiente dice que el
   * canal está abierto, nunca que la solicitud se recibió — afirmarlo sería
   * mentir sobre algo que el sitio no puede comprobar.
   *
   * El canal elegido antes SÍ importaba en la validación y en el tracking,
   * pero no en la entrega: se abría WhatsApp sin importar qué había marcado
   * el visitante. Quien elegía «Correo» —antes incluso de que existiera
   * `BUSINESS_EMAIL`— terminaba con WhatsApp igual.
   *
   * Para WhatsApp, el destinatario NO es siempre el primero de la lista. Lo
   * era, y el efecto medido fue que el 100 % de las cotizaciones llegaba a un
   * solo contacto mientras el otro no recibía ninguna, pese a que el reparto
   * determinista ya estaba escrito en `lib/assignment.ts` y no lo llamaba
   * nadie.
   */
  const submitQuote = () => {
    const e = validateThrough(TOTAL_STEPS);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      focusFirstError(e);
      return;
    }

    const channel: Channel = draft.channel === "email" && businessEmail ? "email" : "whatsapp";
    const message = buildMessage();

    let url: string | null;
    if (channel === "email" && businessEmail) {
      url = buildMailtoLink(businessEmail, t("msgIntro"), message);
    } else {
      /*
       * Semilla determinista compuesta por los datos de la propia solicitud:
       * el mismo formulario abre siempre el mismo contacto, de modo que
       * reintentar no manda la solicitud a dos teléfonos distintos.
       */
      const seed = quoteSeed([draft.name, draft.phone.replace(/\D/g, ""), draft.description]);
      const target = whatsappTargets[pickContactIndex(seed, whatsappTargets.length)];
      url = target ? buildWhatsAppLink(target.phone, message) : null;
    }
    if (!url) return;

    track("quote_submitted", { channel, service: draft.service || "none" });
    setHandoffUrl(url);
    setHandoffChannel(channel);

    /*
     * `mailto:` se navega en la misma pestaña: abrirlo con `window.open` deja
     * una pestaña en blanco huérfana una vez que el programa de correo toma
     * el control. `wa.me` sí necesita pestaña nueva porque es una página web
     * real que debe seguir existiendo detrás.
     */
    if (channel === "email") {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // El foco va al primer campo con problema: sin esto, quien navega con
      // teclado o lector de pantalla no sabe que algo falló.
      focusFirstError(e);
      return;
    }
    track("quote_step_completed", { step });
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  /**
   * Salto directo desde el stepper.
   *
   * Retroceder es SIEMPRE libre: nadie debe quedar atrapado en una etapa por
   * un campo que aún no ha rellenado. Avanzar exige que las etapas anteriores
   * estén válidas — antes no lo exigía, y pulsar el último círculo permitía
   * enviar una solicitud sin descripción del proyecto.
   */
  const goToStep = (n: number) => {
    if (n <= step) {
      setStep(n);
      return;
    }
    const e = validateThrough(n - 1);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      focusFirstError(e);
      return;
    }
    setStep(n);
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

    // Residuo de la etapa de fotos: un borrador guardado antes de la fase 4
    // puede traer `photoCount`. Se descarta aquí para que no se cuele en el
    // estado ni vuelva a persistirse.
    delete (saved as Record<string, unknown>).photoCount;

    // El ID de la URL solo se acepta si corresponde a un servicio real.
    const validInitial =
      initialServiceId && services.some((s) => s.id === initialServiceId)
        ? initialServiceId
        : "";

    /*
     * La etapa restaurada se ACOTA al rango válido.
     *
     * Un borrador guardado antes de la fase 4 puede traer `step: 3`, que ya no
     * existe: sin el acotado el formulario se quedaba sin ninguna etapa que
     * pintar —pantalla en blanco entre los botones— y con el stepper señalando
     * un círculo inexistente. Se cae a la última etapa real, que es donde esa
     * persona estaba de verdad: a punto de enviar.
     */
    const savedStep = Number(saved.step ?? 0);
    const restoredStep = Number.isFinite(savedStep)
      ? Math.min(TOTAL_STEPS, Math.max(1, Math.trunc(savedStep)))
      : 1;

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
    if (savedStep >= 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ver comentario arriba
      setStep(restoredStep);
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

  // Persiste en cada cambio. Solo texto: no hay nada más que guardar.
  useEffect(() => {
    if (!restored.current) return;
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, step }));
    } catch {
      /* almacenamiento lleno o bloqueado: el formulario sigue funcionando */
    }
  }, [draft, step]);

  return (
    <section className="bg-paper py-12 lg:py-16">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 lg:grid-cols-[1fr_380px] lg:px-10">
        <div>
          <QuoteStepper current={step} onStepChange={goToStep} />

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
              <fieldset className="space-y-6">
                <legend className="sr-only">{t("step2")}</legend>

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
                    emailAvailable={!!businessEmail}
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
                  Confirmación deliberadamente literal, para los dos canales.
                  `wa.me` abre WhatsApp y `mailto:` abre el correo, ambos con
                  el texto ya redactado; el envío lo hace la persona. Decir
                  "hemos recibido su solicitud" sería afirmar algo que el sitio
                  no puede comprobar, y dejaría a alguien esperando respuesta a
                  un mensaje que nunca llegó a enviar.

                  La invitación a adjuntar fotos vive aquí y no en el mensaje:
                  quien puede adjuntarlas es el visitante, dentro de la
                  conversación o el correo que acaba de abrirse. El mensaje
                  anterior se las prometía al contratista y no llegaba ninguna.
                */}
                {handoffUrl ? (
                  <div role="status" className="border-l-2 border-success bg-surface p-4">
                    <p className="font-display text-base font-semibold text-ink">
                      {handoffChannel === "email" ? t("handoffHeadingEmail") : t("handoffHeadingWhatsapp")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {handoffChannel === "email" ? t("handoffBodyEmail") : t("handoffBodyWhatsapp")}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t("handoffPhotos")}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={handoffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center border border-ink px-4 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                      >
                        {handoffChannel === "email" ? t("handoffReopenEmail") : t("handoffReopenWhatsapp")}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setHandoffUrl(null);
                          setHandoffChannel(null);
                        }}
                        className="inline-flex min-h-[44px] items-center px-2 text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
                      >
                        {t("handoffEdit")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={submitQuote}
                    className="inline-flex min-h-[52px] w-full items-center justify-center bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
                  >
                    {draft.channel === "email" && businessEmail ? t("sendEmail") : t("sendWhatsapp")}
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
              disabled={step === TOTAL_STEPS}
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
