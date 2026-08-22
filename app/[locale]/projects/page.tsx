import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { PROJECTS } from "@/content/projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
      canonical: `${prefix}${path}`,
      languages: {
        "es-US": "/es/proyectos",
        "en-US": "/en/projects",
      },
    },
  };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

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
        />

        <section className="bg-paper py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project, i) => (
                <ProjectCard key={project.id} project={project} priority={i < 3} />
              ))}
            </div>

            <p className="mt-12 text-center font-mono text-xs text-muted">{t("resultsNote")}</p>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
