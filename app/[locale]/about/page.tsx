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

const VALUES = [1, 2, 3, 4] as const;

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tn = await getTranslations("Nav");
  const th = await getTranslations("Home");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={tn("about")}
          tagline={th("valuesHeading4")}
          intro={th("valuesBody4")}
          imageSrc="/images/proyectos/estructura-04.jpeg"
          imageAlt={tn("about")}
        />

        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {VALUES.map((n) => (
                <li key={n} className="bg-surface p-8">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {th(`valuesHeading${n}`)}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted">{th(`valuesBody${n}`)}</p>
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
