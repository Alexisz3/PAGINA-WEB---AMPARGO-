import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { PROJECTS, getProjectBySlug, CATEGORY_TO_SERVICE } from "@/content/projects";
import { SERVICES } from "@/content/services";
import { publishablePairs } from "@/content/before-after";
import { SITE_URL, BRAND } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import BeforeAfter from "@/components/BeforeAfter";
import ZoomableImage from "@/components/ZoomableImage";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";
import { Link } from "@/i18n/navigation";
import ArrowRight from "@/components/icons/ArrowRight";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROJECTS.map((project) => ({ locale, slug: project.slugs[locale as AppLocale] }))
  );
}

const CATEGORY_KEY = {
  kitchens: "filterKitchens",
  bathrooms: "filterBathrooms",
  exteriors: "filterExteriors",
  structures: "filterStructures",
  interiors: "filterInteriors",
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const loc = locale as AppLocale;
  const project = getProjectBySlug(loc, slug);
  if (!project) return {};

  const t = await getTranslations({ locale: locale as Locale, namespace: "Projects" });
  const path = (targetLocale: AppLocale) =>
    `${LOCALE_PREFIXES[targetLocale]}${
      targetLocale === "es-US" ? "/proyectos/" : "/projects/"
    }${project.slugs[targetLocale]}`;

  return {
    title: `${project.title[loc]} | ${t("eyebrow")} | ${BRAND.name}`,
    description: project.excerpt[loc],
    alternates: {
      canonical: path(loc),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: {
      type: "article",
      title: project.title[loc],
      description: project.excerpt[loc],
      url: path(loc),
      images: [{ url: `/images/proyectos/${project.coverPhoto.file}` }],
    },
  };
}

export default async function ProjectDetail({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const project = getProjectBySlug(loc, slug);
  if (!project) notFound();

  const t = await getTranslations("Projects");
  const tn = await getTranslations("Nav");
  const categoryLabel = t(CATEGORY_KEY[project.category]);
  const statusLabel = project.status === "completed" ? t("statusCompleted") : t("statusInProgress");
  const service = SERVICES.find((item) => item.id === CATEGORY_TO_SERVICE[project.category]);
  const pair = project.beforeAfterId
    ? publishablePairs().find((item) => item.id === project.beforeAfterId)
    : undefined;
  const galleryPhotos = project.gallery.filter((photo) => photo.file !== project.coverPhoto.file);
  const related = [
    ...PROJECTS.filter(
      (candidate) => candidate.id !== project.id && candidate.category === project.category
    ),
    ...PROJECTS.filter(
      (candidate) => candidate.id !== project.id && candidate.category !== project.category
    ),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title[loc],
    description: project.excerpt[loc],
    image: `${SITE_URL}/images/proyectos/${project.coverPhoto.file}`,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "GeneralContractor", name: BRAND.name, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      <main id="contenido" tabIndex={-1}>
        <section className="overflow-hidden bg-carbon text-bone">
          <div className="mx-auto max-w-[1400px] px-6 pt-24 lg:px-10 lg:pt-28">
            <Breadcrumb
              theme="dark"
              items={[
                { label: tn("projects"), href: "/projects" },
                { label: project.title[loc] },
              ]}
            />

            <div className="grid gap-10 pb-12 pt-7 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-stretch lg:gap-14 lg:pb-16 lg:pt-8">
              <div className="flex flex-col justify-center">
                <span className="eyebrow text-accent-ink">{statusLabel}</span>
                <h1 className="mt-6 max-w-xl text-balance font-display font-semibold leading-[0.98] tracking-[-0.025em] [font-size:clamp(2.7rem,5.5vw,5.6rem)]">
                  {project.title[loc]}
                </h1>

                <dl className="mt-10 grid grid-cols-2 border-y border-bone/15 text-sm">
                  <div className="border-b border-r border-bone/15 py-5 pr-4">
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-bone/65">
                      {t("detailCategory")}
                    </dt>
                    <dd className="mt-2 font-medium text-bone">{categoryLabel}</dd>
                  </div>
                  <div className="border-b border-bone/15 py-5 pl-4">
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-bone/65">
                      {t("detailStatus")}
                    </dt>
                    <dd className="mt-2 font-medium text-bone">{statusLabel}</dd>
                  </div>
                  <div className="border-r border-bone/15 py-5 pr-4">
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-bone/65">
                      {t("detailLocation")}
                    </dt>
                    <dd className="mt-2 font-medium text-bone">{project.location}</dd>
                  </div>
                  {service ? (
                    <div className="py-5 pl-4">
                      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-bone/65">
                        {t("detailService")}
                      </dt>
                      <dd>
                        <Link
                          href={{ pathname: "/services/[slug]", params: { slug: service.slugs[loc] } }}
                          className="inline-flex min-h-[44px] items-center font-medium text-accent-ink underline-offset-4 hover:underline"
                        >
                          {service.title[loc]}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={{ pathname: "/quote", query: service ? { servicio: service.id } : {} }}
                    className="inline-flex min-h-[50px] w-fit items-center gap-3 bg-accent px-6 text-sm font-semibold text-bone transition-colors hover:bg-accent-hover"
                  >
                    {tn("quote")}
                    <ArrowRight />
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex min-h-[48px] w-fit items-center border-b border-bone/35 text-sm text-bone/80 transition-colors hover:border-bone hover:text-bone"
                  >
                    {t("backToProjects")}
                  </Link>
                </div>
              </div>

              <ZoomableImage
                src={`/images/proyectos/${project.coverPhoto.file}`}
                alt={project.title[loc]}
                orientation={project.coverPhoto.orientation}
                eager
                preload
                sizes="(min-width: 1400px) 760px, (min-width: 1024px) 56vw, 100vw"
                className={
                  project.coverPhoto.orientation === "vertical"
                    ? "aspect-[4/5] bg-carbon-raised lg:h-[660px] lg:aspect-auto"
                    : "aspect-[4/3] bg-carbon-raised lg:h-[590px] lg:aspect-auto"
                }
              />
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16">
              <div>
                <span className="eyebrow text-accent">{t("theProject")}</span>
              </div>
              <p className="max-w-3xl text-pretty font-display text-2xl font-medium leading-snug text-ink sm:text-3xl lg:text-4xl">
                {project.excerpt[loc]}
              </p>
            </div>

            {project.scope || project.workCompleted ? (
              <div className="mt-14 grid gap-12 border-t border-line pt-10 lg:grid-cols-2">
                {project.scope ? (
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">{t("scopeHeading")}</h2>
                    <ul className="mt-6 space-y-0">
                      {project.scope[loc].map((item, index) => (
                        <li key={item} className="flex gap-5 border-t border-line py-4">
                          <span className="font-mono text-xs text-accent" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="leading-relaxed text-ink">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {project.workCompleted ? (
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">
                      {t("workCompletedHeading")}
                    </h2>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.workCompleted[loc].map((item) => (
                        <li
                          key={item}
                          className="border border-line bg-surface px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {pair ? (
          <section className="bg-surface py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <h2 className="mb-8 font-display text-3xl font-semibold text-ink">
                {t("compareHeading")}
              </h2>
              <BeforeAfter
                pair={pair}
                beforeLabel={t("beforeLabel")}
                afterLabel={t("afterLabel")}
                sliderLabel={t("compareLabel")}
              />
            </div>
          </section>
        ) : null}

        {galleryPhotos.length > 0 ? (
          <section className="bg-carbon py-16 text-bone lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="eyebrow text-accent-ink">{t("eyebrow")}</span>
                  <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                    {t("galleryHeading")}
                  </h2>
                </div>
                <span className="hidden font-mono text-xs text-bone/65 sm:block">
                  {String(galleryPhotos.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {galleryPhotos.map((photo, index) => (
                  <ZoomableImage
                    key={photo.file}
                    src={`/images/proyectos/${photo.file}`}
                    alt={`${project.title[loc]} — ${index + 2}`}
                    orientation={photo.orientation}
                    sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                    className={`bg-carbon-raised ${
                      photo.orientation === "vertical"
                        ? "aspect-[3/4]"
                        : "aspect-[4/3] lg:col-span-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {project.result ? (
          <section className="bg-paper py-16 lg:py-24">
            <div className="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16 lg:px-10">
              <h2 className="eyebrow h-fit text-accent">{t("resultHeading")}</h2>
              <p className="max-w-3xl text-pretty font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                {project.result[loc]}
              </p>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="bg-surface py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="eyebrow text-accent">{t("eyebrow")}</span>
                  <h2 className="mt-5 text-balance font-display text-3xl font-semibold text-ink sm:text-4xl">
                    {t("moreProjectsHeading")}
                  </h2>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted">{t("moreProjectsBody")}</p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex min-h-[44px] w-fit items-center gap-3 border-b border-ink/30 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {t("backToProjects")}
                  <ArrowRight />
                </Link>
              </div>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((candidate) => (
                  <ProjectCard key={candidate.id} project={candidate} compact />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
