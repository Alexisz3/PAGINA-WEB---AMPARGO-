"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { routing, LOCALE_CODES, type AppLocale } from "@/i18n/routing";
import { resolveLocalizedDestination } from "@/i18n/localized-destination";

/**
 * Cambia de idioma traduciendo el LUGAR actual, no volviendo al inicio.
 *
 * Preserva: la página equivalente, la misma entidad dinámica (con su slug
 * traducido), los filtros de la query string y el hash. La lógica vive en
 * `i18n/localized-destination.ts`; aquí solo se navega.
 */
export default function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // `usePathname()` devuelve el PATRÓN (`/projects/[slug]`), no la ruta
  // resuelta: el slug real hay que sacarlo de los params de la ruta.
  const routeParams = useParams();

  const switchTo = (target: AppLocale) => {
    if (target === locale) return;

    const rawSlug = routeParams?.slug;
    const currentSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const dest = resolveLocalizedDestination(
      pathname,
      locale,
      target,
      new URLSearchParams(searchParams.toString()),
      hash,
      currentSlug
    );

    // Sin equivalente en el idioma destino: se deja al visitante donde está
    // en vez de mandarlo al inicio sin avisar o construir un slug que da 404.
    if (dest.kind === "unavailable") return;

    const options = { locale: target, scroll: false } as const;

    if (dest.kind === "dynamic") {
      router.replace(
        { pathname: dest.pathname, params: { slug: dest.slug }, query: dest.query },
        options
      );
    } else {
      router.replace(
        // El pathname viene de `usePathname()`, así que ya es una ruta válida
        // del registro; el tipo genérico de `replace` no puede inferirlo.
        { pathname: dest.pathname as "/", query: dest.query },
        options
      );
    }

    // El hash no viaja en el router tipado; se reaplica tras navegar.
    if (dest.hash && typeof window !== "undefined") {
      window.setTimeout(() => {
        window.location.hash = dest.hash;
      }, 0);
    }
  };

  return (
    <div
      role="group"
      aria-label={t("languageSwitcherLabel")}
      className="flex items-center overflow-hidden rounded-full border border-bone/30 font-mono text-xs uppercase tracking-wider text-bone"
    >
      {routing.locales.map((l) => {
        const isCurrent = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-current={isCurrent ? "true" : undefined}
            /*
             * El nombre accesible dice qué hace el botón, no solo el código:
             * "EN" a secas no comunica si es el idioma actual o el destino.
             *
             * El nombre del idioma se resuelve como clave anidada, NO con un
             * `select` de ICU: los selectores ICU no admiten guiones, así que
             * `{lang, select, es-US {...}}` lanzaba INVALID_MESSAGE en todas
             * las páginas. Como clave de objeto, `es-US` sí es válido.
             */
            aria-label={
              isCurrent
                ? t("languageCurrent", { name: t(`languageName.${l}`) })
                : t("languageSwitchTo", { name: t(`languageName.${l}`) })
            }
            className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-3 transition-colors ${
              isCurrent ? "bg-bone text-carbon" : "hover:bg-bone/10"
            }`}
          >
            {LOCALE_CODES[l].toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
