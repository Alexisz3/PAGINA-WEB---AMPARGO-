import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeHero from "@/components/home/HomeHero";
import TrustBar from "@/components/home/TrustBar";
import ServiceCards from "@/components/home/ServiceCards";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ValueProps from "@/components/home/ValueProps";
import Testimonials from "@/components/Testimonials";
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
        {/* La franja de confianza va inmediatamente bajo el hero: responde
            "¿trabajan donde vivo?" antes de que el visitante siga bajando. */}
        <TrustBar />
        <ServiceCards />
        <FeaturedProjects />
        <ValueProps />
        {/* Devuelve null mientras no haya reseñas reales. */}
        <Testimonials />

        <section className="bg-paper pb-16 lg:pb-28">
          {/* El carril de proceso sangra al borde en móvil (sin px-6 en el
              contenedor) para que la última tarjeta asome; el texto sí
              conserva el margen. */}
          <div className="mx-auto max-w-[1400px] lg:px-10">
            <div className="px-6 lg:px-0">
              <span className="eyebrow text-accent">{t("processEyebrow")}</span>
              <h2 className="mt-4 max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.625rem,3.4vw,2.75rem)]">
                {t("processHeading")}
              </h2>
            </div>
            <div className="mt-8 pl-6 lg:mt-12 lg:pl-0">
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
