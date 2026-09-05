import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
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
 * Lista fotográfica compacta en móvil y cinco columnas en escritorio.
 * Todos los destinos permanecen visibles sin carruseles ni JavaScript.
 */
export default async function ServiceCards() {
  const locale = (await getLocale()) as AppLocale;
  const th = await getTranslations("Home");
  const services = getPublishedServices();

  return (
    <section className="relative border-b border-line bg-paper py-10 lg:py-14">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <h2 className="eyebrow text-accent">
          {th("servicesEyebrow")}
        </h2>

        <ul
          aria-label={th("servicesEyebrow")}
          className="mt-6 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {services.map((service, i) => (
            <li
              key={service.id}
              className="group min-w-0 border-t border-line py-5 lg:border-t-0 lg:py-0"
            >
              {/* La tarjeta entera es el enlace: la flecha es decorativa y no
                  un segundo control vacío que duplique el destino. */}
              <Link
                href={{ pathname: "/services/[slug]", params: { slug: service.slugs[locale] } }}
                className="grid h-full grid-cols-[88px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-1 lg:flex lg:flex-col lg:gap-0"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-carbon sm:aspect-[4/3]">
                  <Image
                    src={`/images/proyectos/${service.heroImage}`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 88px"
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.035]"
                  />
                </div>
                <div className="flex flex-1 flex-col lg:pt-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 font-mono text-xs text-accent" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                      {service.title[locale]}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.shortDescription[locale]}
                  </p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-3 pt-2 text-sm font-medium text-accent">
                    {th("serviceLearnMore")}
                    <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
