import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { WHATSAPP_CONTACTS, BUSINESS_EMAIL, BRAND } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackedContactLink from "@/components/TrackedContactLink";
import { Link } from "@/i18n/navigation";
import ArrowRight from "@/components/icons/ArrowRight";
import LineIcon, { type LineIconName } from "@/components/icons/LineIcon";

const BENEFIT_ICONS: LineIconName[] = ["communication", "clarity", "visit", "build"];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Contact" });
  const path = (l: AppLocale) => `${LOCALE_PREFIXES[l]}${l === "es-US" ? "/contacto" : "/contact"}`;

  return {
    title:
      locale === "es-US"
        ? `Contacte a ${BRAND.name} | Houston, TX`
        : `Contact ${BRAND.name} | Houston, TX`,
    description: t("metaDescription"),
    alternates: {
      canonical: path(locale as AppLocale),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: { ...(await parent).openGraph, type: "website", title: t("heading"), description: t("metaDescription"), url: path(locale as AppLocale) },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Contact");

  /*
   * El mensaje prellenado va en el idioma que el visitante está leyendo:
   * quien navega en español no debería abrir WhatsApp con un texto en inglés.
   */
  const waMessage =
    loc === "es-US"
      ? "Hola, me gustaría hablar sobre un proyecto."
      : "Hi, I'd like to talk about a project.";

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="bg-paper">
        <section className="relative isolate min-h-[480px] overflow-hidden text-bone lg:min-h-[530px]">
          <Image
            src="/images/proyectos/exterior-lujo-01.jpeg"
            alt={tc("heroImageAlt")}
            fill
            preload
            sizes="100vw"
            className="motion-hero-image object-cover object-[70%_center] brightness-[0.52] saturate-[0.72]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/90 via-47% to-carbon/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-carbon/30 via-transparent to-carbon/72" />

          <div className="relative mx-auto flex min-h-[480px] max-w-[1400px] items-end px-6 pb-14 pt-32 lg:min-h-[530px] lg:px-10 lg:pb-16">
            <div className="max-w-3xl">
              <p className="motion-reveal-1 eyebrow text-accent-ink">{tc("eyebrow")}</p>
              <h1 className="motion-reveal-2 font-editorial mt-6 text-balance text-[clamp(3.25rem,7vw,6.3rem)] font-normal leading-[0.9] tracking-[-0.045em]">
                <span className="block">{tc("heroHeadingLead")}</span>
                <span className="text-accent-ink">{tc("heroHeadingAccent")}</span>
              </h1>
              <p className="motion-reveal-3 mt-7 max-w-xl text-pretty text-base leading-relaxed text-bone/82 sm:text-lg">{tc("intro")}</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-8 pb-12 lg:-mt-12 lg:pb-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.04fr]">
              {/* ── Llamar ── */}
              <section className="border border-line bg-surface p-7 lg:p-9">
                <div className="flex items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-paper text-accent">
                    <LineIcon name="phone" className="h-8 w-8" />
                  </span>
                  <div>
                    <h2 className="font-editorial text-3xl font-normal leading-none text-ink">{tc("callLabel")}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{tc("callHelp")}</p>
                  </div>
                </div>
                <ul className="mt-8 divide-y divide-dashed divide-line border-t border-line">
                  {WHATSAPP_CONTACTS.map((c) => (
                    <li key={c.phone}>
                      <TrackedContactLink
                        href={`tel:+${c.phone}`}
                        event="phone_clicked"
                        params={{ contact: c.id }}
                        className="flex min-h-[72px] flex-col justify-center transition-colors hover:text-accent"
                      >
                        <span className="font-mono text-lg text-ink">{c.phoneDisplay}</span>
                        <span className="text-xs text-muted">{c.name}</span>
                      </TrackedContactLink>
                    </li>
                  ))}
                </ul>
              </section>

              {/* ── WhatsApp ── */}
              <section className="border border-line bg-surface p-7 lg:p-9">
                <div className="flex items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-paper text-accent">
                    <LineIcon name="whatsapp" className="h-8 w-8" />
                  </span>
                  <div>
                    <h2 className="font-editorial text-3xl font-normal leading-none text-ink">{tc("whatsappLabel")}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{tc("whatsappHelp")}</p>
                  </div>
                </div>
                <ul className="mt-8 divide-y divide-dashed divide-line border-t border-line">
                  {WHATSAPP_CONTACTS.map((c) => {
                    const href = buildWhatsAppLink(c.phone, waMessage);
                    // Sin enlace válido no se pinta un botón muerto.
                    if (!href) return null;
                    return (
                      <li key={c.phone}>
                        <TrackedContactLink
                          href={href}
                          event="whatsapp_clicked"
                          params={{ contact: c.id }}
                          external
                          className="group flex min-h-[72px] items-center justify-between gap-3 transition-colors hover:text-accent"
                        >
                          <span className="flex flex-col">
                            <span className="font-mono text-lg text-ink">{c.phoneDisplay}</span>
                            <span className="text-xs text-muted">{c.name}</span>
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-accent">
                            {tc("whatsappAction")}
                            <ArrowRight />
                          </span>
                        </TrackedContactLink>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="border border-line bg-surface p-7 lg:p-9">
                <div className="flex items-center gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-paper text-accent">
                    <LineIcon name="map" className="h-8 w-8" />
                  </span>
                  <div>
                    <h2 className="font-editorial text-3xl font-normal leading-none text-ink">{tc("addressLabel")}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{tc("serviceAreaHelp")}</p>
                  </div>
                </div>
                <p className="mt-7 border-t border-line pt-6 font-display text-xl font-semibold text-ink">{tc("address")}</p>

                {BUSINESS_EMAIL ? (
                  <div className="mt-6 flex items-center gap-4 border-t border-line pt-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-accent">
                      <LineIcon name="email" className="h-8 w-8" />
                    </span>
                    <div>
                      <h3 className="font-editorial text-2xl font-normal leading-none text-ink">{tc("emailLabel")}</h3>
                    <TrackedContactLink
                      href={`mailto:${BUSINESS_EMAIL}`}
                      event="email_clicked"
                      className="mt-2 inline-flex min-h-[44px] items-center text-sm font-medium text-accent transition-colors hover:text-ink"
                    >
                      {BUSINESS_EMAIL}
                    </TrackedContactLink>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>

            <section className="mt-5 grid border border-line bg-surface lg:grid-cols-[1.25fr_1fr_auto] lg:items-center">
              <div className="p-7 lg:p-8">
                <h2 className="font-editorial text-3xl font-normal leading-none text-ink">{tc("preferLabel")}</h2>
                <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted">{tc("preferBody")}</p>
              </div>
              <div className="flex gap-4 border-t border-line p-7 lg:border-l lg:border-t-0 lg:p-8">
                <LineIcon name="shield" className="h-8 w-8 shrink-0 text-accent" />
                <p className="max-w-sm text-sm leading-relaxed text-muted">{tc("quoteHelp")}</p>
              </div>
              <Link
                href="/quote"
                className="m-7 inline-flex min-h-[54px] items-center justify-center gap-3 bg-accent px-7 text-sm font-medium text-bone transition-colors hover:bg-accent-hover lg:m-8"
              >
                {tn("quote")}
                <ArrowRight />
              </Link>
            </section>
          </div>
        </section>

        <section className="relative overflow-hidden bg-carbon py-14 text-bone lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(248,246,240,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,.65) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "linear-gradient(to right, transparent, black 25%, black 75%, transparent)",
            }}
          />
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="eyebrow text-accent-ink">{tc("benefitsEyebrow")}</p>
            <ul className="mt-8 grid border border-bone/15 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="border-b border-bone/15 p-7 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:p-8 lg:last:border-r-0">
                  <LineIcon name={BENEFIT_ICONS[n - 1]} className="h-9 w-9 text-accent-ink" />
                  <h2 className="mt-5 font-display text-lg font-semibold">{tc(`benefitTitle${n}`)}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-bone/65">{tc(`benefitBody${n}`)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
