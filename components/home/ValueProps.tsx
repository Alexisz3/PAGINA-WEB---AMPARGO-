import { getTranslations } from "next-intl/server";

const ITEMS = [1, 2, 3, 4] as const;

/**
 * Cuatro proposiciones de valor cualitativas.
 *
 * Deliberadamente NO son métricas ("450+ obras", "12 años") como en algunos
 * mockups de referencia: el cliente no ha confirmado ninguna cifra y la regla
 * del proyecto prohíbe publicar datos inventados. Cualitativo y verificable
 * es preferible a numérico y falso.
 */
export default async function ValueProps() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-paper pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((n) => (
            <li key={n} className="bg-surface p-8">
              <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                {t(`valuesHeading${n}`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`valuesBody${n}`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
