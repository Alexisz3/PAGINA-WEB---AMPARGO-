import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { getPublishedServices } from "@/content/services";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import ArrowRight from "@/components/icons/ArrowRight";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Nav" });
  const th = await getTranslations({ locale: locale as Locale, namespace: "Home" });
  const prefix = LOCALE_PREFIXES[locale as AppLocale];
  const path = locale === "es-US" ? "/servicios" : "/services";

  return {
    title: `${t("services")} | Ampargo`,
    description: th("servicesIntro"),
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
  const tn = await getTranslations("Nav");
  const th = await getTranslations("Home");
  const services = getPublishedServices();

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={tn("services")}
          tagline={th("servicesIntro")}
          imageSrc="/images/proyectos/cocina-granito-01.jpeg"
          imageAlt={tn("services")}
          compact
        />

        <section className="bg-paper py-12 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => (
                <li key={service.id} className="bg-surface">
                  <Link
                    href={{ pathname: "/services/[slug]", params: { slug: service.slugs[loc] } }}
                    className="group flex h-full min-h-[220px] flex-col justify-between p-8 transition-colors hover:bg-paper"
                  >
                    <div>
                      <span className="font-mono text-xs text-accent" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">
                        {service.title[loc]}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {service.shortDescription[loc]}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bone"
                    >
                      <ArrowRight />
                    </span>
                  </Link>
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
