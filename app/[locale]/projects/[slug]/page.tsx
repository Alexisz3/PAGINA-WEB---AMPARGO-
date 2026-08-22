import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { PROJECTS, getProjectBySlug } from "@/content/projects";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((p) => ({ locale, slug: p.slugs[locale as AppLocale] }))
  );
}

export default async function ProjectDetail({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = getProjectBySlug(locale as AppLocale, slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <section className="bg-carbon pb-12 pt-32 lg:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <span className="eyebrow text-accent-ink">
              {project.status === "completed" ? t("statusCompleted") : t("statusInProgress")}
            </span>
            <h1 className="mt-5 max-w-3xl text-balance font-display font-bold leading-[0.95] text-bone [font-size:clamp(2rem,5vw,3.5rem)]">
              {project.title[locale as AppLocale]}
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-bone/75">
              {project.excerpt[locale as AppLocale]}
            </p>
            <p className="mt-4 font-mono text-sm text-bone/55">{project.location}</p>
          </div>
        </section>

        <section className="bg-paper py-16 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-6 sm:grid-cols-2">
              {project.gallery.map((photo, i) => (
                <figure
                  key={photo.file}
                  className={`relative overflow-hidden bg-carbon ${
                    photo.orientation === "vertical" ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={`/images/proyectos/${photo.file}`}
                    alt={`${project.title[locale as AppLocale]} — ${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
