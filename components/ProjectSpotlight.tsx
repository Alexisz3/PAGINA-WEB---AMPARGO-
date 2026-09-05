"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";
import ArrowRight from "./icons/ArrowRight";
import LineIcon from "./icons/LineIcon";

const categoryKey: Record<Project["category"], string> = {
  kitchens: "filterKitchens",
  bathrooms: "filterBathrooms",
  exteriors: "filterExteriors",
  structures: "filterStructures",
  interiors: "filterInteriors",
};

/**
 * Proyecto destacado del catálogo.
 *
 * Las miniaturas cambian entre proyectos reales completos, no simulan una
 * galería de una obra que sólo cuenta con una fotografía aprobada.
 */
export default function ProjectSpotlight({ projects }: { projects: Project[] }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Projects");
  const [index, setIndex] = useState(0);

  const active = projects[index];
  if (!active) return null;

  const move = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <section className="overflow-hidden border border-line bg-surface shadow-[0_12px_32px_rgba(18,20,18,0.06)]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)]">
        <div className="min-w-0 p-4 sm:p-5">
          <div className="relative aspect-[16/10] overflow-hidden bg-carbon">
            <Image
              src={`/images/proyectos/${active.coverPhoto.file}`}
              alt={active.title[locale]}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label={t("previous")}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink shadow-md transition-transform hover:scale-105"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label={t("next")}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-ink shadow-md transition-transform hover:scale-105"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-2 mt-4 text-xs text-muted">{t("spotlightSelect")}</p>
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:var(--color-line)_transparent]">
            {projects.map((project, thumbnailIndex) => {
              const selected = thumbnailIndex === index;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setIndex(thumbnailIndex)}
                  aria-label={project.title[locale]}
                  aria-pressed={selected}
                  className={`relative h-16 w-24 flex-none overflow-hidden border-2 transition-colors sm:h-20 sm:w-28 ${
                    selected ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={`/images/proyectos/${project.coverPhoto.file}`}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center border-t border-line p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.1em] text-accent">
            <LineIcon name="quality" className="h-4 w-4 flex-none" />
            {t("spotlightEyebrow")}
          </p>
          <h2 className="mt-5 text-balance font-display text-[clamp(1.75rem,3vw,2.6rem)] font-semibold leading-tight text-ink">
            {active.title[locale]}
          </h2>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span className={`border px-2 py-1 text-xs font-medium ${active.status === "completed" ? "border-success/55 text-success" : "border-accent/55 text-accent"}`}>
              {active.status === "completed" ? t("statusCompleted") : t("statusInProgress")}
            </span>
            <span>{t(categoryKey[active.category])}</span>
            <span aria-hidden="true" className="text-line">|</span>
            <span>{active.location}</span>
          </div>

          <p className="mt-6 max-w-xl leading-relaxed text-muted">{active.excerpt[locale]}</p>

          <Link
            href={{ pathname: "/projects/[slug]", params: { slug: active.slugs[locale] } }}
            className="mt-8 inline-flex min-h-[48px] w-fit items-center gap-5 border border-accent px-5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-bone"
          >
            {t("spotlightCta")}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
