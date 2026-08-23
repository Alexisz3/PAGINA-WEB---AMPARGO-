import type { AppLocale } from "./routing";
import { PROJECTS } from "@/content/projects";
import { SERVICES } from "@/content/services";

/**
 * Traduce el LUGAR actual al otro idioma.
 *
 * Por qué existe: next-intl traduce el PATRÓN de ruta (`/projects/[slug]` →
 * `/proyectos/[slug]`), pero no sabe que el slug editorial
 * `renovacion-de-cocina` equivale a `kitchen-renovation`. Sin esta capa, el
 * selector conservaba el slug español dentro de la ruta inglesa y producía
 * un 404. Traducir el patrón es cosa de next-intl; traducir la ENTIDAD es
 * cosa de la aplicación.
 *
 * Todo vive aquí en vez de repartirse en condicionales dentro del botón:
 * así hay un único sitio donde razonar sobre el problema y un único sitio
 * al que añadir una entidad nueva.
 */

/** Parámetros de query que sobreviven al cambio de idioma. Lista blanca a
 *  propósito: un parámetro desconocido puede llevar datos que no queremos
 *  arrastrar entre URLs. */
const PRESERVED_PARAMS = new Set(["categoria", "servicio"]);

export type LocalizedDestination =
  | { kind: "static"; pathname: string; query: Record<string, string>; hash: string }
  | {
      kind: "dynamic";
      pathname: "/projects/[slug]" | "/services/[slug]";
      slug: string;
      query: Record<string, string>;
      hash: string;
    }
  | { kind: "unavailable"; reason: "entity-not-found" | "no-translation" };

function pickParams(searchParams: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (PRESERVED_PARAMS.has(key) && value) out[key] = value;
  }
  return out;
}

/**
 * @param pathname  Ruta INTERNA sin prefijo de idioma. OJO: con `pathnames`
 *                  configurados, `usePathname()` de next-intl devuelve el
 *                  PATRÓN (`/projects/[slug]`), no la ruta resuelta.
 *                  Verificado instrumentando el componente. Por eso el slug
 *                  real llega aparte, desde `useParams()`.
 * @param currentLocale Idioma en el que está el visitante ahora.
 * @param targetLocale  Idioma al que quiere cambiar.
 * @param currentSlug   Slug real de la entidad, si la ruta es dinámica.
 */
export function resolveLocalizedDestination(
  pathname: string,
  currentLocale: AppLocale,
  targetLocale: AppLocale,
  searchParams: URLSearchParams,
  hash = "",
  currentSlug?: string
): LocalizedDestination {
  const query = pickParams(searchParams);

  if (pathname.startsWith("/projects/")) {
    const slug = currentSlug ? decodeURIComponent(currentSlug) : "";
    const project = PROJECTS.find((p) => p.slugs[currentLocale] === slug);
    if (!project) return { kind: "unavailable", reason: "entity-not-found" };

    const targetSlug = project.slugs[targetLocale];
    if (!targetSlug) return { kind: "unavailable", reason: "no-translation" };

    return { kind: "dynamic", pathname: "/projects/[slug]", slug: targetSlug, query, hash };
  }

  if (pathname.startsWith("/services/")) {
    const slug = currentSlug ? decodeURIComponent(currentSlug) : "";
    const service = SERVICES.find((s) => s.published && s.slugs[currentLocale] === slug);
    if (!service) return { kind: "unavailable", reason: "entity-not-found" };

    const targetSlug = service.slugs[targetLocale];
    if (!targetSlug) return { kind: "unavailable", reason: "no-translation" };

    return { kind: "dynamic", pathname: "/services/[slug]", slug: targetSlug, query, hash };
  }

  // Ruta estática: next-intl ya sabe traducir el pathname; aquí solo se
  // conservan query y hash, que antes se perdían.
  return { kind: "static", pathname, query, hash };
}
