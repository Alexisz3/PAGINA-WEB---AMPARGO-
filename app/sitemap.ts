import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE } from "@/lib/site";
import { LOCALES, LOCALE_PREFIXES, pathnames, type AppLocale } from "@/i18n/routing";
import { PROJECTS } from "@/content/projects";

/**
 * Sitemap generado desde el MISMO registro de rutas que la navegación y los
 * canonical. Si divergieran, el chequeo `npm run check:i18n` lo detecta.
 *
 * Excluye deliberadamente:
 *  - rutas legales (/privacy, /terms): su contenido es borrador sin revisar.
 *  - rutas dinámicas sin datos suficientes.
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

  // Detalles de proyecto publicados.
  for (const project of PROJECTS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}${LOCALE_PREFIXES[locale]}${
          locale === "es-US" ? "/proyectos/" : "/projects/"
        }${project.slugs[locale]}`,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
