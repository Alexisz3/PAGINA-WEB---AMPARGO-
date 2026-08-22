"use client";

import { useTranslations } from "next-intl";
import type { QuoteDraft } from "./QuoteShell";

/**
 * Resumen persistente en columna lateral (referencia aprobada).
 * Solo refleja lo que el visitante ya introdujo; nunca inventa valores.
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

  return (
    <aside className="h-fit bg-carbon p-8 text-bone lg:sticky lg:top-24">
      <h2 className="font-display text-xl font-semibold">{t("summaryHeading")}</h2>

      <dl className="mt-6 space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="font-mono text-xs uppercase tracking-wider text-bone/55">{row.label}</dt>
            <dd className={`mt-1 text-sm ${row.value ? "text-bone" : "text-bone/45"}`}>
              {row.value || t("summaryEmpty")}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 border-t border-bone/15 pt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-bone/55">
          {t("draftHeading")}
        </p>
        <p className="mt-1 text-sm text-bone/75">{t("draftSaved")}</p>
      </div>

      <div className="mt-6 bg-carbon-raised p-5">
        <p className="text-sm font-medium">{t("secureHeading")}</p>
        <p className="mt-1 text-sm leading-relaxed text-bone/70">{t("secureBody")}</p>
      </div>
    </aside>
  );
}
