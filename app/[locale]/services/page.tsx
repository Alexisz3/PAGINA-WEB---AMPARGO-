import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { getPublishedServices } from "@/content/services";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ArrowRight from "@/components/icons/ArrowRight";
import LineIcon, { type LineIconName } from "@/components/icons/LineIcon";

const SERVICE_ICONS: LineIconName[] = ["build", "remodel", "kitchen", "outdoor", "repair"];
const TRUST_ICONS: LineIconName[] = ["quality", "team", "schedule", "clarity"];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services">, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const ts = await getTranslations({ locale: locale as Locale, namespace: "Services" });
  const prefix = LOCALE_PREFIXES[locale as AppLocale];
  const path = locale === "es-US" ? "/servicios" : "/services";

  return {
    title: ts("metaTitle"),
    description: ts("metaDescription"),
    openGraph: { ...(await parent).openGraph, type: "website", title: ts("metaTitle"), description: ts("metaDescription"), url: `${prefix}${path}` },
    alternates: {
      canonical: `${prefix}${path}`,
      languages: { "es-US": "/es/servicios", "en-US": "/en/services" },
    },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const ts = await getTranslations("Services");
  const services = getPublishedServices();
  // El punto final se reserva para el acento naranja del diseño; las
  // traducciones conservan su puntuación natural para otros usos.
  const heroHeading = ts("pageHeading").replace(/[.。]$/, "");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="bg-carbon">
        {/* Hero de servicios: la fotografía real da escala, el texto explica
            que el alcance se define para cada caso. */}
        <section className="relative isolate min-h-[590px] overflow-hidden text-bone lg:min-h-[650px]">
          <Image
            src="/images/proyectos/exterior-lujo-01.jpeg"
            alt={ts("heroImageAlt")}
            fill
            preload
            loading="eager"
            sizes="100vw"
            className="motion-hero-image object-cover object-[62%_center] brightness-[0.55] contrast-[1.08] saturate-[0.76] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon from-0% via-carbon/88 via-45% to-carbon/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/36 via-transparent to-carbon/75" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 hidden w-[31%] opacity-[0.075] lg:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(248,246,240,.75) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,.75) 1px, transparent 1px), linear-gradient(35deg, transparent 48%, rgba(248,246,240,.65) 49%, rgba(248,246,240,.65) 50%, transparent 51%)",
              backgroundSize: "58px 58px, 58px 58px, 170px 170px",
              maskImage: "linear-gradient(to right, black, transparent)",
            }}
          />

          <div className="relative mx-auto flex min-h-[590px] max-w-[1400px] items-center px-6 pb-36 pt-32 lg:min-h-[650px] lg:px-10 lg:pt-36">
            <div className="max-w-3xl">
              <p className="motion-reveal-1 eyebrow text-accent-ink">{ts("pageEyebrow")}</p>
              <h1 className="motion-reveal-2 font-editorial mt-6 max-w-3xl text-balance text-[clamp(3rem,6vw,5.8rem)] font-normal leading-[0.96] tracking-[-0.04em]">
                {heroHeading}
                <span className="text-accent-ink">.</span>
              </h1>
              <div className="mt-6 h-0.5 w-14 bg-accent" />
              <p className="motion-reveal-3 mt-6 max-w-xl text-pretty text-base leading-relaxed text-bone/78 sm:text-lg">
                {ts("pageIntro")}
              </p>
            </div>
          </div>
        </section>

        {/* Catálogo asimétrico: el primer servicio define la jerarquía; los
            cuatro restantes quedan visibles sin obligar a abrir un menú. */}
        <section className="relative z-10 -mt-16 pb-14 lg:-mt-24 lg:pb-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-[1.28fr_0.86fr_0.86fr] xl:grid-rows-2">
              {services.map((service, index) => {
                const lead = index === 0;
                return (
                  <li key={service.id} className={lead ? "md:col-span-2 xl:col-span-1 xl:row-span-2" : ""}>
                    <Link
                      href={{ pathname: "/services/[slug]", params: { slug: service.slugs[loc] } }}
                      className={`group relative flex h-full overflow-hidden border border-bone/30 bg-carbon-raised transition-colors hover:border-accent-ink ${
                        lead ? "flex-col md:flex-row xl:flex-col" : "flex-col"
                      }`}
                    >
                      <div className={`relative shrink-0 overflow-hidden bg-carbon ${lead ? "aspect-[4/3] md:w-1/2 xl:aspect-[0.94/1] xl:w-full" : "aspect-[16/8]"}`}>
                        <Image
                          src={`/images/proyectos/${service.heroImage}`}
                          alt={service.title[loc]}
                          fill
                          sizes={lead ? "(min-width: 1024px) 43vw, 100vw" : "(min-width: 1024px) 29vw, (min-width: 640px) 50vw, 100vw"}
                          className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-carbon/65 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 bg-carbon/90 px-3 py-2 font-mono text-xs font-medium text-accent-ink">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className={`flex min-w-0 flex-1 flex-col ${lead ? "p-6 lg:p-8" : "p-6"}`}>
                        <LineIcon name={SERVICE_ICONS[index]} className="h-7 w-7 text-accent-ink" />
                        <h2 className={`font-editorial mt-5 text-balance font-normal leading-[1.03] text-bone ${lead ? "text-[clamp(2.35rem,3.6vw,3.65rem)]" : "text-[clamp(1.65rem,2.35vw,2.25rem)]"}`}>
                          {service.title[loc]}
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-bone/75">
                          {service.shortDescription[loc]}
                        </p>
                        <span className="mt-auto inline-flex min-h-[44px] items-center gap-3 pt-7 text-sm font-medium text-bone transition-colors group-hover:text-accent-ink">
                          {ts("learnMore")}
                          <ArrowRight />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Razones operativas, no promesas cuantificadas. */}
        <section className="pb-14 lg:pb-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid border border-bone/15 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="border-b border-bone/15 p-6 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <LineIcon name={TRUST_ICONS[n - 1]} className="h-10 w-10 text-accent-ink" />
                  <h2 className="mt-5 font-display text-lg font-semibold text-bone">
                    {ts(`trustTitle${n}`)}
                  </h2>
                  <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-bone/62">{ts(`trustBody${n}`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
