import { getTranslations, getLocale } from "next-intl/server";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import type { AppLocale } from "@/i18n/routing";

/**
 * Sección de testimonios.
 *
 * Con `content/testimonials.ts` vacío, muestra un marcador de posición
 * honesto en vez de reseñas — decisión explícita del responsable del
 * proyecto: prefiere que el visitante vea que el espacio existe a que
 * desaparezca en silencio. Antes esta sección devolvía `null`; el marcador
 * dice exactamente por qué está vacío, sin inventar una reseña para
 * llenarlo.
 *
 * Por qué nunca una reseña inventada: inventar reseñas de una empresa real
 * es fraude comercial (perseguido por la FTC en EE. UU.), y un propietario
 * que está por gastar decenas de miles de dólares suele verificar. Una
 * reseña falsa descubierta destruye exactamente la confianza que la sección
 * busca construir.
 *
 * Cuando el cliente entregue reseñas con autorización, basta añadirlas al
 * archivo de contenido: la sección real aparece sola, sin tocar este
 * componente.
 */

/** Una reseña puede existir solo en el idioma en que la escribió su autor. */
function quoteFor(testimonial: Testimonial, locale: AppLocale): string {
  const q = testimonial.quote;
  if ("original" in q) return q.original;
  return q[locale];
}

export default async function Testimonials() {
  const t = await getTranslations("Testimonials");

  if (TESTIMONIALS.length === 0) {
    return (
      <section className="bg-paper pb-16 lg:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <span className="eyebrow text-accent">{t("eyebrow")}</span>
          <div className="mt-8 border border-dashed border-line px-6 py-12 text-center lg:mt-12 lg:py-16">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t("placeholderHeading")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              {t("placeholderBody")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const locale = (await getLocale()) as AppLocale;

  return (
    <section className="bg-paper pb-16 lg:pb-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <span className="eyebrow text-accent">{t("eyebrow")}</span>
        <h2 className="mt-4 max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.625rem,3.4vw,2.75rem)]">
          {t("heading")}
        </h2>

        <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 lg:mt-12">
          {TESTIMONIALS.map((item) => (
            <li key={item.id} className="bg-surface p-6 lg:p-8">
              <figure className="flex h-full flex-col">
                <blockquote className="flex-1 text-pretty leading-relaxed text-ink">
                  {quoteFor(item, locale)}
                </blockquote>
                <figcaption className="mt-5 border-t border-line pt-4 font-mono text-xs uppercase tracking-wider text-muted">
                  {item.authorName}
                  {item.authorLocation ? ` · ${item.authorLocation}` : ""}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
