"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";
import ArrowRight from "./icons/ArrowRight";

/**
 * Carrusel de proyectos.
 *
 * Móvil: una tarjeta por vez con un ~12% de la siguiente asomando, para que
 * el gesto de deslizar sea evidente sin instrucciones.
 * Escritorio: retícula editorial de tres columnas — un carrusel ahí sería
 * esconder contenido que cabe perfectamente.
 *
 * Es scroll-snap nativo: funciona con gesto táctil, rueda y teclado sin
 * librería, y degrada a scroll normal si falla el JavaScript. El estado sólo
 * alimenta el contador y los botones.
 */
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Projects");
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const total = projects.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      setCanPrev(track.scrollLeft > 4);
      setCanNext(track.scrollLeft < max - 4);

      // La tarjeta activa es la más cercana al borde de inicio del carril.
      const children = Array.from(track.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      children.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft - track.scrollLeft - track.offsetLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };

    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [total]);

  const go = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }, []);

  return (
    <div>
      {/* Controles: sólo aportan en pantallas donde el gesto táctil no es
          el método principal. En móvil el swipe basta y ocuparían espacio. */}
      <div className="mb-4 hidden items-center justify-end gap-3 sm:flex lg:hidden">
        <span className="font-mono text-xs text-muted">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => go(Math.max(0, active - 1))}
          disabled={!canPrev}
          aria-label={t("previous")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => go(Math.min(total - 1, active + 1))}
          disabled={!canNext}
          aria-label={t("next")}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
        >
          <ArrowRight />
        </button>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={t("heading")}
        className="
          flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0
        "
      >
        {projects.map((project, i) => (
          <li key={project.id} className="w-[88%] flex-none snap-start sm:w-[60%] lg:w-auto">
            <article className="group">
              <Link
                href={{ pathname: "/projects/[slug]", params: { slug: project.slugs[locale] } }}
                className="block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
                  {/* Solo la primera diapositiva se carga de inmediato; sin
                      `preload`, que competiría con el LCP de la página. */}
                  <Image
                    src={`/images/proyectos/${project.coverPhoto.file}`}
                    alt={project.title[locale]}
                    fill
                    loading={i === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 60vw, 88vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    className={`absolute bottom-3 left-3 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider ${
                      project.status === "completed"
                        ? "bg-carbon/90 text-bone"
                        : "bg-accent text-bone"
                    }`}
                  >
                    {project.status === "completed" ? t("statusCompleted") : t("statusInProgress")}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
                  {project.title[locale]}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted">{project.location}</p>
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {/* Contador para lectores de pantalla, sin robar espacio visual. */}
      <p aria-live="polite" className="sr-only">
        {t("counter", { n: active + 1, total })}
      </p>
    </div>
  );
}
