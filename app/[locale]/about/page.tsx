import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArrowRight from "@/components/icons/ArrowRight";
import LineIcon, { type LineIconName } from "@/components/icons/LineIcon";
import { BRAND, BUSINESS_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ITEMS = [1, 2, 3, 4] as const;
const HIGHLIGHT_ICONS: LineIconName[] = ["quality", "shield", "team", "location"];
const VALUE_ICONS: LineIconName[] = ["quality", "clarity", "schedule", "shield"];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "About" });
  const path = (l: AppLocale) => `${LOCALE_PREFIXES[l]}${l === "es-US" ? "/nosotros" : "/about"}`;

  return {
    title:
      locale === "es-US"
        ? `Sobre ${BRAND.name} | Houston, TX`
        : `About ${BRAND.name} | Houston, TX`,
    description: t("metaDescription"),
    alternates: {
      canonical: path(locale as AppLocale),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: { ...(await parent).openGraph, type: "website", title: t("heading"), description: t("metaDescription"), url: path(locale as AppLocale) },
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const ta = await getTranslations("About");
  const th = await getTranslations("Home");
  const tc = await getTranslations("Contact");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* Hero: una fotografía real de obra, con lectura clara a la izquierda. */}
        <section className="relative isolate min-h-[500px] overflow-hidden bg-carbon text-bone lg:min-h-[560px]">
          <Image
            src="/images/proyectos/estructura-04.jpeg"
            alt={ta("heroImageAlt")}
            fill
            preload
            loading="eager"
            sizes="100vw"
            className="object-cover object-[58%_center] brightness-[0.7] contrast-[1.05] saturate-[0.8] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon from-0% via-carbon/88 via-48% to-carbon/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/35 via-transparent to-carbon/45" />

          <div className="relative mx-auto flex min-h-[500px] max-w-[1400px] items-center px-6 pb-14 pt-32 lg:min-h-[560px] lg:px-10 lg:pt-36">
            <div className="max-w-[640px]">
              <p className="eyebrow text-accent-ink">{ta("eyebrow")}</p>
              <h1 className="mt-5 max-w-xl text-balance font-display text-[clamp(2.55rem,5vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                {ta("heading")}
                <span className="text-accent-ink">.</span>
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-bone/78 sm:text-lg">
                {ta("heroIntro")}
              </p>
            </div>
          </div>
        </section>

        {/* Quiénes somos: texto editorial y collage de obra real. */}
        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:px-10">
            <div>
              <p className="eyebrow text-accent">{ta("whoEyebrow")}</p>
              <h2 className="mt-5 max-w-xl text-balance font-display text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
                {ta("whoHeading")}
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-pretty leading-relaxed text-muted">
                <p>{ta("whoBody1")}</p>
                <p>{ta("whoBody2")}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/quote"
                  className="inline-flex min-h-[50px] items-center gap-5 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
                >
                  {th("heroCtaPrimary")}
                  <ArrowRight />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex min-h-[50px] items-center gap-3 border-b border-ink/45 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {ta("projectsLink")}
                  <ArrowRight />
                </Link>
              </div>
            </div>

            <div className="relative pb-20 sm:pb-24 lg:pb-16">
              <div className="relative ml-auto aspect-[1.2/1] w-[92%] overflow-hidden bg-carbon sm:w-[86%]">
                <Image
                  src="/images/proyectos/exterior-lujo-01.jpeg"
                  alt={ta("whoImageAlt")}
                  fill
                  sizes="(min-width: 1024px) 50vw, 92vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 aspect-[1.25/1] w-[52%] overflow-hidden border-[6px] border-paper bg-carbon sm:w-[46%]">
                <Image
                  src="/images/proyectos/estructura-04.jpeg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 24vw, 48vw"
                  className="object-cover"
                />
              </div>
              <blockquote className="font-editorial absolute bottom-2 right-0 hidden max-w-[12rem] border-t-2 border-accent pt-4 text-xl italic leading-snug text-ink lg:block">
                {ta("qualityQuote")}
              </blockquote>
            </div>
          </div>
        </section>

        {/* Atributos principales en una sola franja oscura. */}
        <section className="border-y border-bone/10 bg-carbon text-bone">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map((n, index) => (
                <li
                  key={n}
                  className="border-b border-bone/12 py-8 sm:px-6 sm:odd:border-r lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <LineIcon name={HIGHLIGHT_ICONS[index]} className="h-10 w-10 text-accent-ink" />
                  <h2 className="mt-5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-bone">
                    {ta(`highlight${n}`)}
                  </h2>
                  <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-bone/64">
                    {ta(`highlightBody${n}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Forma de trabajar: segunda composición, orientada al proceso. */}
        <section className="bg-surface py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-20 lg:px-10">
            <div>
              <p className="eyebrow text-accent">{ta("approachEyebrow")}</p>
              <h2 className="mt-5 max-w-lg text-balance font-display text-[clamp(2rem,3.8vw,3.35rem)] font-semibold leading-[1.03] tracking-[-0.025em] text-ink">
                {ta("approachHeading")}
              </h2>
              <div className="mt-6 max-w-lg space-y-4 text-pretty leading-relaxed text-muted">
                <p>{ta("approachBody1")}</p>
                <p>{ta("approachBody2")}</p>
              </div>
              <Link
                href="/process"
                className="mt-8 inline-flex min-h-[48px] items-center gap-3 border-b border-ink/45 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {ta("approachLink")}
                <ArrowRight />
              </Link>
            </div>

            <div className="relative pb-14 sm:pb-20 lg:pb-16 lg:pr-16">
              <div className="relative aspect-[1.3/1] overflow-hidden bg-carbon">
                <Image
                  src="/images/proyectos/estructura-08.jpeg"
                  alt={ta("approachImageAlt")}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute bottom-0 right-0 aspect-[1.45/1] w-[48%] overflow-hidden border-[6px] border-surface bg-carbon sm:w-[43%]">
                <Image
                  src="/images/proyectos/estructura-02.jpeg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 24vw, 44vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute right-0 top-8 hidden w-44 bg-carbon px-7 py-9 text-bone lg:block">
                <div className="h-0.5 w-6 bg-accent-ink" />
                <p className="mt-5 font-mono text-xs uppercase leading-relaxed tracking-[0.08em]">
                  {ta("approachCallout")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores: compactos y comparables, como en la referencia. */}
        <section className="bg-carbon py-14 text-bone lg:py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="eyebrow text-accent-ink">{ta("valuesEyebrow")}</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              {ta("valuesHeading")}
            </h2>
            <ul className="mt-9 grid gap-px border-y border-bone/12 sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map((n, index) => (
                <li key={n} className="flex gap-4 border-b border-bone/12 py-7 sm:px-5 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                  <LineIcon name={VALUE_ICONS[index]} className="h-10 w-10 flex-none text-accent-ink" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">{ta(`valueTitle${n}`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-bone/64">{ta(`valueBody${n}`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cierre específico de Nosotros: proyecto real + vías de contacto. */}
        <section className="relative isolate overflow-hidden bg-carbon text-bone">
          <Image
            src="/images/proyectos/estructura-10-gable.jpeg"
            alt={ta("ctaImageAlt")}
            fill
            sizes="100vw"
            className="object-cover object-[35%_center] opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/28 via-carbon/92 via-52% to-carbon" />
          <div className="relative mx-auto grid max-w-[1400px] gap-10 px-6 py-16 lg:grid-cols-[0.42fr_0.58fr] lg:items-center lg:px-10 lg:py-20">
            <div aria-hidden="true" className="hidden min-h-52 lg:block" />
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
              <div>
                <p className="eyebrow text-accent-ink">{ta("ctaEyebrow")}</p>
                <h2 className="mt-5 max-w-md text-balance font-display text-[clamp(2rem,3.4vw,3.35rem)] font-semibold leading-[1.02]">
                  {ta("ctaHeading")}
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-bone/72">{ta("ctaBody")}</p>
                <Link
                  href="/quote"
                  className="mt-7 inline-flex min-h-[50px] items-center gap-5 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
                >
                  {th("heroCtaPrimary")}
                  <ArrowRight />
                </Link>
              </div>

              <div className="border-l border-bone/22 pl-6 lg:pl-10">
                <ul className="space-y-2">
                  {WHATSAPP_CONTACTS.map((contact) => (
                    <li key={contact.phone}>
                      <a href={`tel:+${contact.phone}`} className="inline-flex min-h-[44px] items-center gap-4 text-lg transition-colors hover:text-accent-ink">
                        <LineIcon name="phone" className="h-5 w-5 text-accent-ink" />
                        <span className="font-mono">{contact.phoneDisplay}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex gap-4 text-sm leading-relaxed text-bone/82">
                  <LineIcon name="location" className="h-5 w-5 flex-none text-accent-ink" />
                  {tc("address")}
                </p>
                {BUSINESS_EMAIL ? (
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="mt-4 flex min-h-[44px] items-center gap-4 text-sm text-bone/82 transition-colors hover:text-accent-ink">
                    <LineIcon name="communication" className="h-5 w-5 flex-none text-accent-ink" />
                    {BUSINESS_EMAIL}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
