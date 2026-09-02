"use client";

import { useTranslations } from "next-intl";

/**
 * Etapas del formulario: Proyecto y Contacto.
 *
 * Eran tres. La intermedia era una subida de fotos que no subía nada —el
 * enlace `wa.me` solo admite texto— así que se retiró en la fase 4. Menos
 * etapas también significa más formularios terminados, que es la métrica que
 * importa aquí.
 *
 * La constante se exporta para que `QuoteShell` no tenga su propio número
 * suelto: dos fuentes de verdad sobre cuántas etapas hay es exactamente cómo
 * se llega a un stepper que señala una etapa que ya no existe.
 */
const STEPS = [1, 2] as const;
export const TOTAL_STEPS = STEPS.length;

export default function QuoteStepper({
  current,
  onStepChange,
}: {
  current: number;
  /** Recibe la etapa pedida. Quien decide si el salto se permite es el
   *  formulario: avanzar exige que lo anterior esté válido, retroceder no. */
  onStepChange: (n: number) => void;
}) {
  const t = useTranslations("Quote");
  const labels = [t("step1"), t("step2")];

  return (
    <>
    {/*
      En móvil los círculos solos no comunican en qué paso estás ni cuántos
      faltan. Esta línea da el nombre del paso y la posición; en pantallas
      anchas se oculta porque las etiquetas ya se ven junto a cada círculo.
    */}
    <p className="mb-4 text-sm text-muted sm:hidden" aria-hidden="true">
      <span className="font-medium text-accent">{labels[current - 1]}</span>
      {" · "}
      {t("stepOf", { n: current })}
    </p>

    <ol className="flex items-center gap-3" aria-label={t("stepOf", { n: current })}>
      {STEPS.map((n, i) => {
        const active = n === current;
        const done = n < current;
        return (
          <li key={n} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => onStepChange(n)}
              aria-current={active ? "step" : undefined}
              className="flex min-h-[44px] items-center gap-3 text-left"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent text-bone"
                    : done
                      ? "border-accent text-accent"
                      : "border-line text-muted"
                }`}
              >
                {n}
              </span>
              <span
                className={`hidden text-sm sm:block ${active ? "font-medium text-accent" : "text-muted"}`}
              >
                {labels[i]}
              </span>
            </button>
            {i < STEPS.length - 1 ? (
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            ) : null}
          </li>
        );
      })}
    </ol>
    </>
  );
}
