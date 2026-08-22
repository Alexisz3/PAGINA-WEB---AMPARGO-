import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProjects } from "@/content/projects";
import ProjectCard from "../ProjectCard";

export default async function FeaturedProjects() {
  const t = await getTranslations("Home");
  const projects = getFeaturedProjects();

  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <span className="eyebrow text-accent">{t("featuredEyebrow")}</span>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.75rem,3.4vw,2.75rem)]">
            {t("featuredHeading")}
          </h2>
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {t("featuredCta")}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
