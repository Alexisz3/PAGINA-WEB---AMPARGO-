import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProcessTimeline from "@/components/ProcessTimeline";
import ArrowRight from "@/components/icons/ArrowRight";
import LineIcon from "@/components/icons/LineIcon";
import { BRAND, BUSINESS_EMAIL, WHATSAPP_CONTACTS } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/process">, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Process" });
  const path = (l: AppLocale) => `${LOCALE_PREFIXES[l]}${l === "es-US" ? "/proceso" : "/process"}`;

  return {
    title:
      locale === "es-US"
        ? `Cómo trabajamos | ${BRAND.name}`
        : `How We Work in Houston | ${BRAND.name}`,
    description: t("intro"),
    alternates: {
      canonical: path(locale as AppLocale),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: { ...(await parent).openGraph, type: "website", title: t("heading"), description: t("intro"), url: path(locale as AppLocale) },
  };
}

export default async function ProcessPage({ params }: PageProps<"/[locale]/process">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tp = await getTranslations("Process");
  const th = await getTranslations("Home");
  const tc = await getTranslations("Contact");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* Apertura fotográfica: muestra trabajo real en ejecución. */}
        <section className="relative isolate min-h-[500px] overflow-hidden bg-carbon text-bone lg:min-h-[550px]">
          <Image
            src="/images/proyectos/estructura-08.jpeg"
            alt={tp("heroImageAlt")}
            fill
            preload
            loading="eager"
            sizes="100vw"
            className="object-cover object-[58%_center] brightness-[0.58] contrast-[1.08] saturate-[0.75] lg:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/92 via-carbon/54 to-carbon/36" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-carbon/42" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[38%] opacity-[0.08] lg:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(248,246,240,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,.7) 1px, transparent 1px), linear-gradient(35deg, transparent 49%, rgba(248,246,240,.65) 50%, transparent 51%)",
              backgroundSize: "58px 58px, 58px 58px, 170px 170px",
              maskImage: "linear-gradient(to left, black, transparent)",
            }}
          />

          <div className="relative mx-auto flex min-h-[500px] max-w-[1400px] items-end px-6 pb-16 pt-32 lg:min-h-[550px] lg:px-10 lg:pb-20">
            <div className="max-w-3xl">
              <p className="eyebrow text-accent-ink">{tp("heroEyebrow")}</p>
              <h1 className="mt-5 font-display text-[clamp(3.4rem,8vw,7rem)] font-semibold leading-[0.82] tracking-[-0.055em]">
                {tp("heroTitle")}
                <span className="text-accent-ink">.</span>
              </h1>
              <p className="mt-6 text-balance font-display text-xl font-medium text-bone/88 sm:text-2xl">
                {tp("heroTagline")}
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-paper py-16 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(24,26,24,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(24,26,24,.65) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-6 border-b border-line pb-9 lg:grid-cols-[0.66fr_0.34fr] lg:items-end">
              <div>
                <p className="eyebrow text-accent">{tp("sectionEyebrow")}</p>
                <h2 className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.15rem,4.3vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink">
                  {tp("sectionHeading")}
                </h2>
              </div>
              <p className="max-w-lg text-pretty leading-relaxed text-muted lg:justify-self-end">
                {tp("sectionBody")}
              </p>
            </div>

            <div className="mt-9 lg:mt-12">
              <ProcessTimeline variant="detailed" />
            </div>

            {/* Evidencia visual del avance: preparación, ejecución y resultado. */}
            <section className="mt-16 overflow-hidden bg-carbon text-bone lg:mt-24">
              <div className="grid lg:grid-cols-[0.36fr_0.64fr]">
                <div className="flex flex-col justify-center px-7 py-10 lg:px-10 lg:py-14">
                  <p className="eyebrow text-accent-ink">{tp("evidenceEyebrow")}</p>
                  <h2 className="mt-5 text-balance font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.04]">
                    {tp("evidenceHeading")}
                  </h2>
                  <p className="mt-4 max-w-md text-pretty leading-relaxed text-bone/68">
                    {tp("evidenceBody")}
                  </p>
                </div>

                <div className="grid min-h-[430px] grid-cols-2 grid-rows-2 gap-px bg-bone/15 sm:grid-cols-3 sm:grid-rows-1">
                  {[
                    { image: "demolicion-01.jpeg", label: tp("evidenceStage1") },
                    { image: "estructura-02.jpeg", label: tp("evidenceStage2") },
                    { image: "exterior-lujo-01.jpeg", label: tp("evidenceStage3") },
                  ].map((item, index) => (
                    <figure key={item.image} className={`group relative min-h-[215px] overflow-hidden bg-carbon ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
                      <Image
                        src={`/images/proyectos/${item.image}`}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 22vw, 50vw"
                        className="object-cover opacity-72 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-transparent to-transparent" />
                      <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-5 py-5 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-bone">
                        <span className="text-accent-ink">0{index + 1}</span>
                        {item.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA compacto con los canales verificados de la empresa. */}
            <section className="mt-8 bg-carbon-raised px-7 py-9 text-bone shadow-[0_18px_50px_rgba(18,20,18,0.14)] lg:mt-10 lg:px-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10">
                <div className="flex items-start gap-5">
                  <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-accent-ink/60 text-accent-ink">
                    <LineIcon name="communication" className="h-7 w-7" />
                  </span>
                  <div>
                    <h2 className="text-balance font-display text-2xl font-semibold sm:text-3xl">
                      {tp("ctaHeading")}
                    </h2>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-bone/68">{tp("ctaBody")}</p>
                  </div>
                </div>

                <Link
                  href="/quote"
                  className="inline-flex min-h-[52px] w-fit items-center gap-5 bg-accent px-7 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
                >
                  {th("heroCtaPrimary")}
                  <ArrowRight />
                </Link>

                <div className="border-t border-bone/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent-ink">
                    {tp("contactEyebrow")}
                  </p>
                  <ul className="mt-3 grid gap-x-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {WHATSAPP_CONTACTS.map((contact) => (
                      <li key={contact.phone}>
                        <a href={`tel:+${contact.phone}`} className="inline-flex min-h-[44px] items-center gap-3 font-mono transition-colors hover:text-accent-ink">
                          <LineIcon name="phone" className="h-4 w-4 text-accent-ink" />
                          {contact.phoneDisplay}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 flex gap-3 text-sm text-bone/72">
                    <LineIcon name="location" className="h-4 w-4 flex-none text-accent-ink" />
                    {tc("address")}
                  </p>
                  {BUSINESS_EMAIL ? (
                    <a href={`mailto:${BUSINESS_EMAIL}`} className="mt-2 flex min-h-[44px] items-center gap-3 text-sm text-bone/72 transition-colors hover:text-accent-ink">
                      <LineIcon name="communication" className="h-4 w-4 flex-none text-accent-ink" />
                      {BUSINESS_EMAIL}
                    </a>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
