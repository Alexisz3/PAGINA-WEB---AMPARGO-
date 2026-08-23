import { getTranslations } from "next-intl/server";

const ITEMS = [1, 2, 3, 4] as const;

/**
 * Cuatro proposiciones de valor cualitativas.
 *
 * Móvil: cuadrícula 2×2 compacta. Antes era una columna de cuatro tarjetas
 * altas — mucha altura para poca información.
 *
 * Deliberadamente NO son métricas ("450+ obras", "12 años") como en algunos
 * mockups: el cliente no ha confirmado ninguna cifra, y la regla del proyecto
 * prohíbe publicar datos inventados.
 */
export default async function ValueProps() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-paper pb-16 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/*
          La sección tenía las cuatro tarjetas sueltas, sin encabezado: el
          visitante llegaba a cuatro afirmaciones sin saber qué respondían.
          El titular las convierte en una respuesta a la pregunta que un
          propietario sí se hace antes de llamar a un contratista.
        */}
        <span className="eyebrow text-accent">{t("valuesEyebrow")}</span>
        <h2 className="mt-4 max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.625rem,3.4vw,2.75rem)]">
          {t("valuesSectionHeading")}
        </h2>

        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:mt-12 lg:grid-cols-4">
          {ITEMS.map((n) => (
            <li key={n} className="bg-surface p-5 lg:p-8">
              <h3 className="text-balance font-display text-base font-semibold leading-snug text-ink lg:text-lg">
                {t(`valuesHeading${n}`)}
              </h3>
              {/* El cuerpo se oculta en la cuadrícula estrecha: a 2 columnas
                  el titular ya comunica, y el párrafo dispararía la altura. */}
              <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">
                {t(`valuesBody${n}`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
