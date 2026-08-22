"use client";

import { useTranslations } from "next-intl";
import type { QuoteDraft } from "./QuoteShell";

/**
 * Resumen de la solicitud.
 *
 * Móvil: `<details>` colapsado por defecto. Antes era un panel oscuro enorme
 * debajo de cada etapa que competía con el formulario en vez de asistirlo.
 * Se usa `<details>`/`<summary>` nativo a propósito: el plegado funciona sin
 * JavaScript y el estado lo anuncian los lectores de pantalla sin ARIA extra.
 *
 * Escritorio: panel lateral siempre visible y sticky, donde sí hay espacio.
 */
export default function QuoteSummary({ draft }: { draft: QuoteDraft }) {
  const t = useTranslations("Quote");

  const rows = [
    { label: t("summaryService"), value: draft.service },
    { label: t("summaryLocation"), value: draft.location },
    {
      label: t("summaryPhotos"),
      value: draft.photoCount > 0 ? t("photosCount", { n: draft.photoCount }) : "",
    },
    {
      label: t("summaryChannel"),
      value: draft.channel
        ? draft.channel === "email"
          ? t("channelEmail")
          : t("channelWhatsapp")
        : "",
    },
  ];

  const filled = rows.filter((r) => r.value).length;

  const body = (
    <>
      <dl className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="font-mono text-xs uppercase tracking-wider text-bone/55">{row.label}</dt>
            <dd className={`mt-1 text-sm ${row.value ? "text-bone" : "text-bone/55"}`}>
              {row.value || t("summaryEmpty")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 border-t border-bone/15 pt-4">
        <p className="font-mono text-xs uppercase tracking-wider text-bone/55">
          {t("draftHeading")}
        </p>
        <p className="mt-1 text-sm text-bone/75">{t("draftSaved")}</p>
      </div>

      <div className="mt-5 bg-carbon-raised p-4">
        <p className="text-sm font-medium">{t("secureHeading")}</p>
        <p className="mt-1 text-sm leading-relaxed text-bone/75">{t("secureBody")}</p>
      </div>
    </>
  );

  return (
    <>
      {/* Móvil: plegable, cerrado por defecto. */}
      <details className="bg-carbon text-bone lg:hidden">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5">
          <span className="font-display text-base font-semibold">{t("summaryHeading")}</span>
          <span className="font-mono text-xs text-bone/55">{filled} / {rows.length}</span>
        </summary>
        <div className="px-5 pb-6">{body}</div>
      </details>

      {/* Escritorio: panel lateral persistente. */}
      <aside className="hidden h-fit bg-carbon p-8 text-bone lg:sticky lg:top-24 lg:block">
        <h2 className="mb-6 font-display text-xl font-semibold">{t("summaryHeading")}</h2>
        {body}
      </aside>
    </>
  );
}
