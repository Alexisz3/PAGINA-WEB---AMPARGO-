import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE } from "@/lib/site";
import { LOCALES, LOCALE_PREFIXES, pathnames, type AppLocale } from "@/i18n/routing";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

/**
 * Sitemap generado desde el MISMO registro de rutas que la navegación y los
 * canonical. Si divergieran, el chequeo `npm run check:i18n` lo detecta.
 *
 * Excluye deliberadamente:
 *  - rutas legales (/privacy, /terms): su contenido es borrador sin revisar.
 *  - rutas dinámicas sin datos suficientes.
 */
/*
 * Los patrones dinámicos se excluyen del recorrido de rutas estáticas porque
 * se expanden más abajo, uno por entidad. Las legales quedan fuera mientras su
 * texto sea borrador sin revisar por el cliente.
 */
const EXCLUDED = new Set(["/privacy", "/terms", "/services/[slug]", "/projects/[slug]"]);

function publicPath(internal: string, locale: AppLocale): string {
  const entry = pathnames[internal as keyof typeof pathnames];
  const localized = typeof entry === "string" ? entry : entry[locale];
  const prefix = LOCALE_PREFIXES[locale];
  return localized === "/" ? prefix : `${prefix}${localized}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Sin dominio definitivo no se publica sitemap: evita que una URL
  // provisional se indexe y compita luego con el dominio real.
  if (!INDEXABLE) return [];

  const entries: MetadataRoute.Sitemap = [];

  for (const internal of Object.keys(pathnames)) {
    if (EXCLUDED.has(internal)) continue;
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${publicPath(internal, locale)}`,
        changeFrequency: "monthly",
        priority: internal === "/" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}${publicPath(internal, l)}`])
          ),
        },
      });
    }
  }

  /*
   * Detalles de SERVICIO. Son las páginas con mayor intención de búsqueda del
   * sitio ("kitchen remodeling houston"), así que llevan prioridad alta y
   * alternates recíprocos: cada idioma apunta al slug equivalente, no a la
   * misma cadena.
   */
  for (const service of SERVICES.filter((s) => s.published)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${LOCALE_PREFIXES[locale]}${
          locale === "es-US" ? "/servicios/" : "/services/"
        }${service.slugs[locale]}`,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}${LOCALE_PREFIXES[l]}${
                l === "es-US" ? "/servicios/" : "/services/"
              }${service.slugs[l]}`,
            ])
          ),
        },
      });
    }
  }

  // Detalles de proyecto publicados.
  for (const project of PROJECTS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${LOCALE_PREFIXES[locale]}${
          locale === "es-US" ? "/proyectos/" : "/projects/"
        }${project.slugs[locale]}`,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${SITE_URL}${LOCALE_PREFIXES[l]}${
                l === "es-US" ? "/proyectos/" : "/projects/"
              }${project.slugs[l]}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
