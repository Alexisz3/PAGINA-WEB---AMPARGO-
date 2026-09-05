"use client";

import { useTranslations } from "next-intl";
import type { QuoteDraft, ServiceOption } from "./QuoteShell";
import { quoteSourceKey } from "@/lib/quote-source";

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
export default function QuoteSummary({
  draft,
  services,
}: {
  draft: QuoteDraft;
  services: ServiceOption[];
}) {
  const t = useTranslations("Quote");
  // El borrador guarda el ID; el resumen muestra la etiqueta del idioma actual.
  const serviceLabel = services.find((s) => s.id === draft.service)?.label ?? "";
  const projectTypeLabel = draft.projectType
    ? draft.projectType === "residential"
      ? t("projectResidential")
      : t("projectCommercial")
    : "";
  const plansLabel = draft.hasPlans
    ? draft.hasPlans === "yes"
      ? t("plansYes")
      : t("plansNo")
    : "";
  const budgetLabel = draft.budget ? t(`budget${draft.budget}`) : "";
  const sourceKey = quoteSourceKey(draft.source);

  const rows = [
    { label: t("summaryService"), value: serviceLabel },
    { label: t("descriptionLabel"), value: draft.description },
    { label: t("summaryProjectType"), value: projectTypeLabel },
    { label: t("summaryLocation"), value: draft.location },
    { label: t("summaryStartDate"), value: draft.startDate },
    { label: t("summaryPlans"), value: plansLabel },
    { label: t("summarySquareFeet"), value: draft.squareFeet ? `${draft.squareFeet} sq ft` : "" },
    { label: t("summaryBudget"), value: budgetLabel },
    { label: t("summarySource"), value: sourceKey ? t(`source${sourceKey}`) : draft.source },
    { label: t("commentsLabel"), value: draft.comments },
    { label: t("nameLabel"), value: draft.name },
    { label: t("phoneLabel"), value: draft.phone },
    { label: t("emailLabel"), value: draft.email },
    {
      label: t("summaryChannel"),
      value: draft.channel
        ? draft.channel === "call"
          ? t("channelCall")
          : draft.channel === "email"
            ? t("channelEmail")
            : t("channelWhatsapp")
        : "",
    },
    {
      label: t("summaryBestTime"),
      value: draft.bestTime ? t(`time${draft.bestTime}`) : "",
    },
  ];

  const filled = rows.filter((r) => r.value.trim());

  const body = (
    <>
      {filled.length === 0 ? <p className="text-sm leading-relaxed text-bone/75">{t("summaryHint")}</p> : null}
      <dl className="divide-y divide-bone/15">
        {filled.map((row) => (
          <div key={row.label} className="py-3 first:pt-0">
            <dt className="text-xs text-bone/65">{row.label}</dt>
            <dd className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-bone [overflow-wrap:anywhere]">
              {row.value}
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

    </>
  );

  return (
    <>
      {/* Móvil: plegable, cerrado por defecto. */}
      <details className="group bg-carbon text-bone lg:hidden">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5">
          <span className="font-display text-base font-semibold">{t("summaryHeading")}</span>
          <span aria-hidden="true" className="text-xl text-accent-ink transition-transform group-open:rotate-45">+</span>
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
