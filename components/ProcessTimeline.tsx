import { getTranslations } from "next-intl/server";
import LineIcon, { type LineIconName } from "./icons/LineIcon";
import ArrowRight from "./icons/ArrowRight";

const STEPS = [1, 2, 3, 4, 5] as const;
const ICONS: LineIconName[] = ["communication", "schedule", "build", "quality", "shield"];

/**
 * Secuencia editorial de cinco etapas.
 *
 * La variante detallada muestra todos los pasos en vertical en móvil.
 * La editorial conserva su carril nativo. En escritorio ambas presentan
 * cinco etapas visibles y conectadas.
 */
export default async function ProcessTimeline({
  tone = "light",
  variant = "editorial",
}: {
  tone?: "light" | "dark";
  variant?: "editorial" | "detailed";
}) {
  const t = await getTranslations("Process");
  const isDark = tone === "dark";

  if (variant === "detailed") {
    return (
      <ol
        aria-label={t("heading")}
        className="grid gap-4 lg:grid-cols-5 lg:gap-5 lg:pt-10"
      >
        {STEPS.map((step, index) => (
          <li
            key={step}
            className="group relative flex flex-col border border-line bg-surface py-5 pl-20 pr-5 lg:min-h-[360px] lg:px-6 lg:pb-6 lg:pt-14"
          >
            <span
              aria-hidden="true"
              className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-base font-semibold text-bone lg:-top-9 lg:left-6 lg:h-[72px] lg:w-[72px] lg:border-[6px] lg:border-paper lg:text-2xl"
            >
              {String(step).padStart(2, "0")}
            </span>

            <span aria-hidden="true" className="hidden h-16 w-16 items-center justify-center text-accent lg:flex">
              <LineIcon name={ICONS[index]} className="h-14 w-14" />
            </span>

            <h3 className="text-balance font-display text-xl font-semibold text-ink lg:mt-5">
              {t(`step${step}Title`)}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted lg:mt-3 lg:text-sm">{t(`step${step}Body`)}</p>

            <p className="mt-3 w-fit text-xs font-medium text-accent lg:mt-auto lg:border lg:border-accent/25 lg:bg-paper lg:px-3 lg:py-2">
              {t(`step${step}Tag`)}
            </p>

            {index < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute -right-[18px] top-8 z-10 hidden h-4 w-4 items-center justify-center rounded-full bg-accent text-bone lg:flex"
              >
                <ArrowRight className="h-2.5 w-2.5" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      tabIndex={0}
      aria-label={t("heading")}
      className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        sm:gap-5
        lg:grid lg:grid-cols-5 lg:gap-px lg:overflow-visible lg:border lg:p-0
        ${isDark ? "lg:border-bone/15 lg:bg-bone/15" : "lg:border-line lg:bg-line"}
      `}
    >
      {STEPS.map((step, index) => (
        <li
          key={step}
          className={`group relative w-[84%] flex-none snap-start overflow-visible border sm:w-[47%] lg:w-auto lg:border-0 ${
            isDark ? "border-bone/15 bg-carbon-raised" : "border-line bg-surface"
          }`}
        >
          <div className={`h-1 w-full ${isDark ? "bg-accent-ink" : "bg-accent"}`} aria-hidden="true" />
          <div className="flex min-h-[265px] flex-col p-6 lg:min-h-[310px] lg:p-7">
            <div className="flex items-start justify-between gap-5">
              <span
                className={`font-display text-5xl font-semibold leading-none tracking-[-0.05em] lg:text-6xl ${
                  isDark ? "text-accent-ink" : "text-accent"
                }`}
                aria-hidden="true"
              >
                {String(step).padStart(2, "0")}
              </span>
              <span
                className={`flex h-12 w-12 flex-none items-center justify-center border ${
                  isDark ? "border-bone/20 text-accent-ink" : "border-line text-accent"
                }`}
                aria-hidden="true"
              >
                <LineIcon name={ICONS[index]} className="h-6 w-6" />
              </span>
            </div>

            <div className="mt-auto pt-10">
              <p
                className={`font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                  isDark ? "text-bone/60" : "text-muted"
                }`}
              >
                {String(index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </p>
              <h3
                className={`mt-3 text-balance font-display text-xl font-semibold leading-snug ${
                  isDark ? "text-bone" : "text-ink"
                }`}
              >
                {t(`step${step}Title`)}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? "text-bone/70" : "text-muted"}`}>
                {t(`step${step}Body`)}
              </p>
            </div>
          </div>

          {index < STEPS.length - 1 ? (
            <span
              aria-hidden="true"
              className={`absolute -right-3 top-[5.25rem] z-10 hidden h-6 w-6 items-center justify-center rounded-full lg:flex ${
                isDark ? "bg-accent-ink text-carbon" : "bg-accent text-bone"
              }`}
            >
              <ArrowRight className="h-3 w-3" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
