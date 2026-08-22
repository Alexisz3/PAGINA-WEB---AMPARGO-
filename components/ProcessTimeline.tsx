import { getTranslations } from "next-intl/server";

const STEPS = [1, 2, 3, 4, 5] as const;

/**
 * Proceso en cinco pasos.
 *
 * Los números 01–05 aquí sí son legítimos: el contenido ES una secuencia real
 * y ordenada, así que la numeración transmite información, no decora.
 *
 * Móvil: carril horizontal con snap. Antes eran cinco bloques apilados que
 * costaban ~900px de scroll para cinco frases cortas.
 * Escritorio: la secuencia horizontal completa de la referencia.
 *
 * Sin JavaScript el carril sigue siendo desplazable y los cinco pasos siguen
 * presentes en el HTML: nada queda oculto tras interacción obligatoria.
 */
export default async function ProcessTimeline({ tone = "light" }: { tone?: "light" | "dark" }) {
  const t = await getTranslations("Process");
  const isDark = tone === "dark";

  return (
    <ol
      // Alcanzable por teclado para poder desplazar el carril con las flechas.
      tabIndex={0}
      className="
        flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:pb-0
        lg:grid-cols-5
      "
    >
      {STEPS.map((n) => (
        <li key={n} className="w-[68%] flex-none snap-start sm:w-auto">
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
