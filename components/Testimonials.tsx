import { getTranslations, getLocale } from "next-intl/server";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import type { AppLocale } from "@/i18n/routing";

/**
 * Sección de testimonios.
 *
 * Se renderiza SOLO si `content/testimonials.ts` contiene reseñas reales.
 * Con el arreglo vacío devuelve `null`: no hay sección, no hay encabezado
 * huérfano y no hay marcador de posición visible para el público.
 *
 * Por qué así y no con textos de relleno: inventar reseñas de una empresa real
 * es fraude comercial (perseguido por la FTC en EE. UU.), y un propietario que
 * está por gastar decenas de miles de dólares suele verificar. Una reseña
 * falsa descubierta destruye exactamente la confianza que la sección busca.
 *
 * Cuando el cliente entregue reseñas con autorización, basta añadirlas al
 * archivo de contenido: la sección aparece sin tocar este componente.
 */

/** Una reseña puede existir solo en el idioma en que la escribió su autor. */
function quoteFor(testimonial: Testimonial, locale: AppLocale): string {
  const q = testimonial.quote;
  if ("original" in q) return q.original;
  return q[locale];
}

export default async function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  const t = await getTranslations("Testimonials");
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
