import { getTranslations } from "next-intl/server";

const STEPS = [1, 2, 3, 4, 5] as const;

/**
 * Los números 01–05 aquí sí son legítimos: el contenido ES una secuencia real
 * y ordenada (consulta → planificación → construcción → revisión → entrega),
 * así que la numeración transmite información, no es decoración.
 */
export default async function ProcessTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = await getTranslations("Process");
  const isDark = tone === "dark";

  return (
    <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map((n) => (
        <li key={n} className="relative">
          <span
            className={`font-mono text-sm ${isDark ? "text-accent-ink" : "text-accent"}`}
            aria-hidden="true"
          >
            {String(n).padStart(2, "0")}
          </span>
          <div className={`mt-3 h-px w-full ${isDark ? "bg-bone/20" : "bg-line"}`} />
          <h3
            className={`mt-4 font-display text-base font-semibold ${isDark ? "text-bone" : "text-ink"}`}
          >
            {t(`step${n}Title`)}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-bone/70" : "text-muted"}`}>
            {t(`step${n}Body`)}
          </p>
        </li>
      ))}
    </ol>
  );
}
