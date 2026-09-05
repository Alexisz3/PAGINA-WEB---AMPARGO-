import { setRequestLocale } from "next-intl/server";
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
import CtaBand from "@/components/CtaBand";
import StructuredData from "@/components/StructuredData";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

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

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
