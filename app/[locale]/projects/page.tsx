import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { PROJECTS, type ProjectCategory } from "@/content/projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilters, { type FilterValue } from "@/components/ProjectFilters";
import ProjectSpotlight from "@/components/ProjectSpotlight";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const VALID: FilterValue[] = [
  "all",
  "in_progress",
  "completed",
  "exteriors",
  "structures",
  "kitchens",
  "bathrooms",
  "interiors",
];

const SPOTLIGHT_PROJECTS = PROJECTS.slice(0, 5);

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Projects" });
  const prefix = LOCALE_PREFIXES[locale as AppLocale];
  const path = locale === "es-US" ? "/proyectos" : "/projects";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: { ...(await parent).openGraph, type: "website", title: t("metaTitle"), description: t("metaDescription"), url: `${prefix}${path}` },
    alternates: {
      canonical: `${prefix}${path}`,
      languages: { "es-US": "/es/proyectos", "en-US": "/en/projects" },
    },
  };
}

export default async function ProjectsPage({ params, searchParams }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const sp = await searchParams;
  const raw = typeof sp.categoria === "string" ? sp.categoria : "all";
  const active: FilterValue = VALID.includes(raw as FilterValue) ? (raw as FilterValue) : "all";

  const visible = active === "all"
    ? PROJECTS
    : active === "completed" || active === "in_progress"
      ? PROJECTS.filter((p) => p.status === active)
      : PROJECTS.filter((p) => p.category === (active as ProjectCategory));

  const t = await getTranslations("Projects");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* Introducción oscura y fotográfica; el catálogo destacado se solapa
            debajo para formar una pieza editorial continua. */}
        <section className="relative isolate min-h-[500px] overflow-hidden bg-carbon text-bone lg:min-h-[540px]">
          <Image
            src="/images/proyectos/exterior-lujo-01.jpeg"
            alt=""
            fill
            preload
            loading="eager"
            sizes="100vw"
            className="object-cover object-center brightness-[0.42] contrast-[1.08] saturate-[0.68]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/95 via-carbon/78 to-carbon/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/38 via-transparent to-carbon/56" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[34%] opacity-[0.075] lg:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(248,246,240,.75) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,.75) 1px, transparent 1px), linear-gradient(35deg, transparent 48%, rgba(248,246,240,.65) 49%, rgba(248,246,240,.65) 50%, transparent 51%)",
              backgroundSize: "62px 62px, 62px 62px, 180px 180px",
              maskImage: "linear-gradient(to left, black, transparent)",
            }}
          />

          <div className="relative mx-auto flex min-h-[500px] max-w-[1400px] items-center px-6 pb-24 pt-32 lg:min-h-[540px] lg:px-10 lg:pt-36">
            <div className="max-w-3xl">
              <p className="eyebrow text-accent-ink">{t("eyebrow")}</p>
              <h1 className="mt-5 text-balance font-display text-[clamp(3rem,6.5vw,5.7rem)] font-semibold leading-[0.93] tracking-[-0.05em]">
                {t("heading")}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-bone/82 sm:text-lg">
                {t("intro")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-paper pb-14 lg:pb-20">
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="-mt-14 lg:-mt-20">
              <ProjectSpotlight projects={SPOTLIGHT_PROJECTS} />
            </div>

            <div className="mt-16 lg:mt-20">
              <div className="flex flex-col gap-5 border-b border-line pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="eyebrow text-accent">{t("catalogEyebrow")}</p>
                  <h2 className="mt-4 text-balance font-display text-[clamp(2rem,3.8vw,3.3rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
                    {t("catalogHeading")}
                  </h2>
                </div>
                <p className="max-w-md text-pretty leading-relaxed text-muted">{t("catalogBody")}</p>
              </div>

              <div className="mt-8">
                <ProjectFilters active={active} />
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    eager={index < 2}
                    compact
                    catalog
                    headingLevel="h3"
                    sizes="(min-width: 1400px) 424px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                  />
                ))}
              </div>

              <p className="mt-10 text-center font-mono text-xs text-muted" aria-live="polite">
                {t("counter", { n: visible.length, total: PROJECTS.length })}
              </p>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
