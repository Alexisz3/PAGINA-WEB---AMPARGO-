import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import ServiceCards from "@/components/home/ServiceCards";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ValueProps from "@/components/home/ValueProps";
import ProcessTimeline from "@/components/ProcessTimeline";
import CtaBand from "@/components/CtaBand";
import StructuredData from "@/components/StructuredData";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <>
      <StructuredData />
      <Header />
      <main id="contenido" tabIndex={-1}>
        <HomeHero />
        <ServiceCards />
        <FeaturedProjects />
        <ValueProps />

        <section className="bg-paper pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <span className="eyebrow text-accent">{t("processEyebrow")}</span>
            <h2 className="mt-5 max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.75rem,3.4vw,2.75rem)]">
              {t("processHeading")}
            </h2>
            <div className="mt-12">
              <ProcessTimeline />
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
