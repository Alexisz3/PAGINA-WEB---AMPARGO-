import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { PROJECTS, type ProjectCategory } from "@/content/projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import ProjectFilters, { type FilterValue } from "@/components/ProjectFilters";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const VALID: FilterValue[] = ["all", "exteriors", "structures", "kitchens", "bathrooms", "interiors"];

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Projects" });
  const prefix = LOCALE_PREFIXES[locale as AppLocale];
  const path = locale === "es-US" ? "/proyectos" : "/projects";

  return {
    title: `${t("eyebrow")} | Ampargo`,
    description: t("intro"),
    alternates: {
      // Las vistas filtradas canonicalizan al índice limpio: no son páginas
      // distintas, son la misma lista con un subconjunto.
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
  const raw = typeof sp.cat === "string" ? sp.cat : "all";
  const active: FilterValue = VALID.includes(raw as FilterValue) ? (raw as FilterValue) : "all";

  const visible =
    active === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === (active as ProjectCategory));

  const t = await getTranslations("Projects");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={t("eyebrow")}
          tagline={t("heading")}
          intro={t("intro")}
          imageSrc="/images/proyectos/exterior-lujo-01.jpeg"
          imageAlt={t("heading")}
          compact
        />

        <section className="bg-paper py-10 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ProjectFilters active={active} />

            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((project, i) => (
                <ProjectCard key={project.id} project={project} priority={i < 2} compact />
              ))}
            </div>

            <p className="mt-10 text-center font-mono text-xs text-muted" aria-live="polite">
              {t("counter", { n: visible.length, total: PROJECTS.length })}
            </p>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
