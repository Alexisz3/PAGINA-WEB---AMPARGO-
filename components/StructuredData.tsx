import { getTranslations } from "next-intl/server";
import { SITE_URL, BUSINESS } from "@/lib/site";

/**
 * Datos estructurados de negocio local (Server Component: coste cero en bundle).
 *
 * Solo datos verificados por el formulario de levantamiento del cliente.
 * NO se incluyen `aggregateRating`, reseñas, horario ni `foundingDate`: el
 * cliente no los ha confirmado, y Google penaliza el marcado inventado.
 */
export default async function StructuredData() {
  const t = await getTranslations("Metadata");
  const ts = await getTranslations("Services");

  const serviceKeys = [
    "housing", "remodeling", "finishes", "design", "planning",
    "commercial", "maintenance", "electrical", "plumbing",
  ] as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: BUSINESS.name,
    description: t("description"),
    url: SITE_URL,
    telephone: BUSINESS.phones,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    areaServed: { "@type": "City", name: "Houston" },
    knowsLanguage: ["es-US", "en-US"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: serviceKeys.map((k) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: ts(`${k}.title`),
          description: ts(`${k}.description`),
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Se escapa `<` según indica la guía de Next para JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
