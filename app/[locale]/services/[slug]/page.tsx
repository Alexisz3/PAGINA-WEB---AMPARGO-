import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { SERVICES, getServiceBySlug } from "@/content/services";
import { PROJECTS } from "@/content/projects";
import { SITE_URL, BRAND } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProjectCard from "@/components/ProjectCard";
import CtaBand from "@/components/CtaBand";
import { Link } from "@/i18n/navigation";
import ArrowRight from "@/components/icons/ArrowRight";
import LineIcon, { type LineIconName } from "@/components/icons/LineIcon";

const SERVICE_ICON: Record<string, LineIconName> = {
  "custom-construction": "build",
  remodeling: "remodel",
  "kitchens-bathrooms": "kitchen",
  "outdoor-spaces": "outdoor",
  "repairs-improvements": "repair",
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SERVICES.filter((service) => service.published).map((service) => ({
      locale,
      slug: service.slugs[locale as AppLocale],
    }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const service = getServiceBySlug(locale as AppLocale, slug);
  if (!service) return {};

  const path = (targetLocale: AppLocale) =>
    `${LOCALE_PREFIXES[targetLocale]}${
      targetLocale === "es-US" ? "/servicios/" : "/services/"
    }${service.slugs[targetLocale]}`;
  const loc = locale as AppLocale;

  return {
    title: `${service.seoTitle[loc]} | ${BRAND.name}`,
    description: service.seoDescription[loc],
    alternates: {
      canonical: path(loc),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: {
      type: "article",
      title: service.seoTitle[loc],
      description: service.seoDescription[loc],
      url: path(loc),
      images: [{ url: `/images/proyectos/${service.heroImage}` }],
    },
  };
}

export default async function ServiceDetail({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const service = getServiceBySlug(loc, slug);
  if (!service) notFound();

  const tn = await getTranslations("Nav");
  const tp = await getTranslations("Projects");
  const th = await getTranslations("Home");
  const ts = await getTranslations("Services");
  const iconName = SERVICE_ICON[service.id] ?? "build";
  const related = PROJECTS.filter((project) =>
    service.relatedProjectCategories.includes(project.category)
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title[loc],
    description: service.shortDescription[loc],
    serviceType: service.title[loc],
    areaServed: { "@type": "City", name: "Houston" },
    provider: {
      "@type": "GeneralContractor",
      name: BRAND.name,
      url: SITE_URL,
    },
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
                { label: tn("services"), href: "/services" },
                { label: service.title[loc] },
              ]}
            />

            <div className="grid items-stretch lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12">
              <div className="flex flex-col justify-center pb-12 pt-8 lg:min-h-[570px] lg:pb-16 lg:pt-12">
                <div className="flex h-14 w-14 items-center justify-center border border-bone/20 text-accent-ink">
                  <LineIcon name={iconName} className="h-7 w-7" />
                </div>
                <p className="eyebrow mt-8 text-accent-ink">{ts("detailEyebrow")}</p>
                <h1 className="mt-5 max-w-2xl text-balance font-display font-semibold leading-[0.98] tracking-[-0.025em] [font-size:clamp(2.6rem,5.4vw,5.4rem)]">
                  {service.title[loc]}
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-bone/72">
                  {service.shortDescription[loc]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={{ pathname: "/quote", query: { servicio: service.id } }}
                    className="inline-flex min-h-[50px] w-fit items-center gap-3 bg-accent px-6 text-sm font-semibold text-bone transition-colors hover:bg-accent-hover"
                  >
                    {tn("quote")}
                    <ArrowRight />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex min-h-[48px] w-fit items-center border-b border-bone/35 text-sm text-bone/80 transition-colors hover:border-bone hover:text-bone"
                  >
                    {tn("backToServices")}
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[380px] overflow-hidden lg:min-h-[570px]">
                <Image
                  src={`/images/proyectos/${service.heroImage}`}
                  alt={service.title[loc]}
                  fill
                  preload
                  loading="eager"
                  sizes="(min-width: 1024px) 57vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-carbon/30 lg:to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-[0.34fr_0.66fr] lg:gap-16 lg:px-10">
            <div>
              <span className="eyebrow text-accent">{ts("detailIntroEyebrow")}</span>
            </div>
            <p className="max-w-3xl text-pretty font-display text-2xl font-medium leading-snug text-ink sm:text-3xl lg:text-4xl">
              {service.introduction[loc]}
            </p>
          </div>
        </section>

        <section className="bg-surface py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-7 border-b border-line pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] md:items-end">
              <div>
                <span className="eyebrow text-accent">{ts("scopeEyebrow")}</span>
                <h2 className="mt-5 text-balance font-display text-3xl font-semibold text-ink sm:text-4xl">
                  {ts("scopeHeading")}
                </h2>
              </div>
              <p className="max-w-xl leading-relaxed text-muted md:justify-self-end">
                {ts("scopeHelp")}
              </p>
            </div>

            <ol className="mt-10 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
              {service.scopeItems[loc].map((item, index) => (
                <li key={item} className="border-t border-line py-6">
                  <div className="flex items-start gap-5">
                    <span className="font-mono text-xs text-accent" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="max-w-sm leading-relaxed text-ink">{item}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-carbon py-16 text-bone lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
              <div>
                <span className="eyebrow text-accent-ink">{th("processEyebrow")}</span>
                <h2 className="mt-5 max-w-3xl text-balance font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
                  {ts("processHeading")}
                </h2>
              </div>
              <p className="max-w-md leading-relaxed text-bone/65 lg:justify-self-end">
                {ts("processBody")}
              </p>
            </div>

            <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {service.processSummary[loc].map((step, index) => (
                <li
                  key={step}
                  className="relative border-t border-bone/20 pt-6 lg:border-l lg:border-t-0 lg:px-7 lg:pt-0 first:lg:border-l-0 first:lg:pl-0"
                >
                  <span className="font-display text-5xl font-semibold text-accent-ink" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-7 max-w-xs leading-relaxed text-bone/78">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-col gap-5 border-t border-bone/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold">{th("serviceCtaHeading")}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone/65">
                  {th("serviceCtaBody")}
                </p>
              </div>
              <Link
                href={{ pathname: "/quote", query: { servicio: service.id } }}
                className="inline-flex min-h-[50px] w-fit flex-none items-center gap-3 bg-accent px-6 text-sm font-semibold text-bone transition-colors hover:bg-accent-hover"
              >
                {tn("quote")}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="bg-paper py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="eyebrow text-accent">{tp("eyebrow")}</span>
                  <h2 className="mt-5 text-balance font-display text-3xl font-semibold text-ink sm:text-4xl">
                    {ts("relatedHeading")}
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex min-h-[44px] w-fit items-center gap-3 border-b border-ink/30 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {tp("backToProjects")}
                  <ArrowRight />
                </Link>
              </div>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((project) => (
                  <ProjectCard key={project.id} project={project} compact />
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
