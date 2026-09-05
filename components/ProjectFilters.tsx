"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { ProjectCategory, ProjectStatus } from "@/content/projects";

export type FilterValue = ProjectCategory | ProjectStatus | "all";

const FILTERS: { value: FilterValue; key: string }[] = [
  { value: "all", key: "filterAll" },
  { value: "in_progress", key: "filterInProgress" },
  { value: "completed", key: "filterCompleted" },
  { value: "exteriors", key: "filterExteriors" },
  { value: "structures", key: "filterStructures" },
  { value: "kitchens", key: "filterKitchens" },
  { value: "bathrooms", key: "filterBathrooms" },
  { value: "interiors", key: "filterInteriors" },
];

/**
 * Filtros de proyecto.
 *
 * El estado vive en la query string (`?cat=kitchens`) para que la vista
 * filtrada sea compartible y el botón atrás del navegador funcione. `all`
 * limpia el parámetro en vez de escribir `?cat=all`, para que la URL canónica
 * de la página sin filtrar siga siendo limpia.
 *
 * El estado activo NO depende sólo del color: el chip seleccionado cambia
 * de fondo Y expone `aria-pressed`, así que se percibe tanto visualmente
 * como por lector de pantalla.
 */
export default function ProjectFilters({ active }: { active: FilterValue }) {
  const t = useTranslations("Projects");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const select = (value: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("categoria");
    else params.set("categoria", value);

    // Forma de objeto: el router tipado de next-intl no acepta una cadena
    // con query string, y así el pathname se sigue validando contra el
    // registro de rutas.
    router.replace(
      { pathname: pathname as "/projects", query: Object.fromEntries(params) },
      { scroll: false }
    );
  };

  return (
    <div
      role="group"
      aria-label={t("eyebrow")}
      className="
        -mx-6 flex gap-2 overflow-x-auto px-6 pb-2
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        lg:mx-0 lg:flex-wrap lg:px-0
      "
    >
      {FILTERS.map((f) => {
        const isActive = f.value === active;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => select(f.value)}
            aria-pressed={isActive}
            className={`
              flex min-h-[44px] flex-none items-center rounded-full border px-4 text-sm transition-colors
              ${isActive
                ? "border-accent bg-accent text-bone"
                : "border-line text-ink hover:border-ink"}
            `}
          >
            {t(f.key)}
          </button>
        );
      })}
    </div>
  );
}
