import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SERVICES = [
  "housing", "remodeling", "finishes", "design", "planning",
  "commercial", "maintenance", "electrical", "plumbing",
] as const;

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Services");
  const tn = await getTranslations("Nav");
  const th = await getTranslations("Home");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={tn("services")}
          tagline={th("servicesEyebrow")}
          imageSrc="/images/proyectos/cocina-granito-01.jpeg"
          imageAlt={tn("services")}
        />

        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((key, i) => (
                <li key={key} className="bg-surface p-8">
                  <span className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-ink">
                    {t(`${key}.title`)}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {t(`${key}.description`)}
                  </p>
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
