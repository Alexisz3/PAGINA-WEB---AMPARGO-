import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ArrowRight from "../icons/ArrowRight";

const CARDS = ["custom", "remodeling", "kitchensBaths", "outdoor", "repairs"] as const;

/**
 * Servicios.
 *
 * Móvil: carril horizontal con scroll-snap nativo. Antes eran cinco bloques
 * verticales altos apilados — monótonos y responsables de ~1.400px de scroll.
 * La tarjeta ocupa el 82% del viewport para que asome la siguiente: eso es lo
 * que comunica "hay más" sin necesidad de flechas ni instrucciones.
 *
 * Escritorio: se conserva la banda de cinco columnas montada sobre el hero,
 * que es la solución de la referencia aprobada.
 *
 * Sin JavaScript: el carril sigue siendo desplazable (scroll nativo del
 * navegador), así que no hay dependencia de hidratación.
 */
export default async function ServiceCards() {
  const t = await getTranslations("ServiceCards");
  const th = await getTranslations("Home");

  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] lg:px-10">
        <h2 className="eyebrow px-6 pt-12 text-accent lg:sr-only lg:px-0 lg:pt-0">
          {th("servicesEyebrow")}
        </h2>

        <ul
          // `tabIndex` hace el carril alcanzable por teclado: sin él, quien
          // navega con teclado no puede desplazarlo con las flechas (axe:
          // scrollable-region-focusable).
          tabIndex={0}
          aria-label={th("servicesEyebrow")}
          className="
            mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:mt-0 lg:-translate-y-24 lg:grid lg:grid-cols-5 lg:gap-px lg:overflow-visible
            lg:bg-bone/10 lg:px-0 lg:pb-0
          "
        >
          {CARDS.map((key, i) => (
            <li
              key={key}
              className="w-[82%] flex-none snap-start bg-carbon sm:w-[46%] lg:w-auto"
            >
              <Link
                href="/services"
                className="group flex h-full min-h-[188px] flex-col justify-between p-6 transition-colors hover:bg-carbon-raised"
              >
                <div>
                  <span className="font-mono text-xs text-accent-ink" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-bone">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/70">
                    {t(`${key}.description`)}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors group-hover:border-accent group-hover:bg-accent"
                >
                  <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
