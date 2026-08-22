"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { routing, LOCALE_CODES, type AppLocale } from "@/i18n/routing";

/**
 * Cambia de idioma preservando la página equivalente y, en rutas dinámicas
 * (/proyectos/[slug]), la misma entidad — next-intl reescribe el slug al
 * equivalente del otro idioma automáticamente vía el registro de pathnames.
 */
export default function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const switchTo = (target: AppLocale) => {
    router.replace(
      // @ts-expect-error -- los params del pathname actual siempre son válidos
      // para la misma ruta en el otro idioma.
      { pathname, params },
      { locale: target }
    );
  };

  return (
    <div
      role="group"
      aria-label={t("languageSwitcherLabel")}
      className="flex items-center overflow-hidden rounded-full border border-bone/30 font-mono text-xs uppercase tracking-wider text-bone"
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center px-3 transition-colors ${
            l === locale ? "bg-bone text-carbon" : "hover:bg-bone/10"
          }`}
        >
          {LOCALE_CODES[l].toUpperCase()}
        </button>
      ))}
    </div>
  );
}
