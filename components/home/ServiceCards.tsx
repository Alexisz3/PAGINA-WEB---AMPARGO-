import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedServices } from "@/content/services";
import type { AppLocale } from "@/i18n/routing";
import ArrowRight from "../icons/ArrowRight";

/**
 * Servicios.
 *
 * Cada tarjeta enlaza a SU detalle. Antes las cinco usaban `href="/services"`
 * y todas caían en el mismo índice, que es como no tener páginas de servicio.
 *
 * Móvil: carril horizontal con scroll-snap nativo. La tarjeta ocupa el 82%
 * del viewport para que asome la siguiente — eso comunica "hay más" sin
 * flechas ni instrucciones.
 * Escritorio: banda de cinco columnas montada sobre el hero, como en la
 * referencia aprobada.
 *
 * Sin JavaScript el carril sigue siendo desplazable: no depende de hidratación.
 */
export default async function ServiceCards() {
  const locale = (await getLocale()) as AppLocale;
  const th = await getTranslations("Home");
  const services = getPublishedServices();

  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] lg:px-10">
        <h2 className="eyebrow px-6 pt-12 text-accent lg:sr-only lg:px-0 lg:pt-0">
          {th("servicesEyebrow")}
        </h2>

        <ul
          tabIndex={0}
          aria-label={th("servicesEyebrow")}
          className="
            mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            lg:mt-0 lg:-translate-y-24 lg:grid lg:grid-cols-5 lg:gap-px lg:overflow-visible
            lg:bg-bone/10 lg:px-0 lg:pb-0
          "
        >
          {services.map((service, i) => (
            <li
              key={service.id}
              className="w-[82%] flex-none snap-start bg-carbon sm:w-[46%] lg:w-auto"
            >
              {/* La tarjeta entera es el enlace: la flecha es decorativa y no
                  un segundo control vacío que duplique el destino. */}
              <Link
                href={{ pathname: "/services/[slug]", params: { slug: service.slugs[locale] } }}
                className="group flex h-full min-h-[188px] flex-col justify-between p-6 transition-colors hover:bg-carbon-raised"
              >
                <div>
                  <span className="font-mono text-xs text-accent-ink" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-tight text-bone">
                    {service.title[locale]}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-bone/70">
                    {service.shortDescription[locale]}
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
