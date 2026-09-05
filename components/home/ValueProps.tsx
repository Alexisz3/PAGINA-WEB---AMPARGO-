import { getTranslations } from "next-intl/server";
import LineIcon, { type LineIconName } from "../icons/LineIcon";

const ITEMS = [1, 2, 3, 4] as const;
const ICONS: LineIconName[] = ["visit", "quality", "communication", "location"];

/**
 * Cuatro proposiciones de valor cualitativas.
 *
 * Móvil: lista con iconos al margen; escritorio: banda de cuatro columnas.
 *
 * Deliberadamente NO son métricas ("450+ obras", "12 años") como en algunos
 * mockups: el cliente no ha confirmado ninguna cifra, y la regla del proyecto
 * prohíbe publicar datos inventados.
 */
export default async function ValueProps() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-carbon py-16 text-bone lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/*
          La sección tenía las cuatro tarjetas sueltas, sin encabezado: el
          visitante llegaba a cuatro afirmaciones sin saber qué respondían.
          El titular las convierte en una respuesta a la pregunta que un
          propietario sí se hace antes de llamar a un contratista.
        */}
        <span className="eyebrow text-accent-ink">{t("valuesEyebrow")}</span>
        <h2 className="mt-4 max-w-2xl text-balance font-display font-semibold leading-tight text-bone [font-size:clamp(1.625rem,3.4vw,2.75rem)]">
          {t("valuesSectionHeading")}
        </h2>

        <ul className="mt-8 grid divide-y divide-bone/15 border-y border-bone/15 sm:grid-cols-2 sm:divide-y-0 lg:mt-12 lg:grid-cols-4 lg:divide-x">
          {ITEMS.map((n) => (
            <li key={n} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 py-6 sm:px-5 lg:block lg:p-8">
              <LineIcon name={ICONS[n - 1]} className="row-span-2 h-7 w-7 text-accent-ink" />
              <h3 className="text-balance font-display text-base font-semibold leading-snug text-bone lg:mt-5 lg:text-lg">
                {t(`valuesHeading${n}`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bone/75 lg:mt-3">
                {t(`valuesBody${n}`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
