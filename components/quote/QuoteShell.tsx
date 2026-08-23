"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
const DRAFT_KEY = "ampargo-quote-draft";

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
export default function QuoteShell({
  services,
  initialServiceId,
}: {
  services: ServiceOption[];
  initialServiceId?: string;
}) {
  const t = useTranslations("Quote");
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<QuoteDraft>({
    service: "", location: "", description: "",
    photoCount: 0, name: "", phone: "", email: "",
    channel: null, consent: false,
  });

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

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
      const raw = window.sessionStorage.getItem(DRAFT_KEY);
      if (raw) saved = JSON.parse(raw) as Partial<PersistedDraft>;
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
                    className={FIELD}
                    placeholder={t("descriptionPlaceholder")}
                    value={draft.description}
                    onChange={(e) => update("description", e.target.value)}
                  />
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
                    className={FIELD}
                    placeholder={t("namePlaceholder")}
                    autoComplete="name"
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
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
                      className={FIELD}
                      value={draft.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
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
                      className={FIELD}
                      value={draft.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>

                <DeliveryChannelSelector
                  value={draft.channel}
                  onChange={(c) => update("channel", c)}
                />

                <label className="flex items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={draft.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                    className="mt-1 h-5 w-5 accent-accent"
                  />
                  {t("consent")}
                </label>

                <p className="border-l-2 border-accent bg-surface p-4 text-sm text-muted">
                  {t("devNotice")}
                </p>
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
              onClick={() => setStep((s) => Math.min(3, s + 1))}
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
