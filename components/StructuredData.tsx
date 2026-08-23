import { getTranslations } from "next-intl/server";
import { SITE_URL, BUSINESS } from "@/lib/site";
import { SERVICE_AREA } from "@/content/company";

/**
 * Datos estructurados de negocio local (Server Component: coste cero en bundle).
 *
 * Solo datos verificados por el formulario de levantamiento del cliente.
 * NO se incluyen `aggregateRating`, reseñas, horario ni `foundingDate`: el
 * cliente no los ha confirmado, y Google penaliza el marcado inventado.
 *
 * Sobre la DIRECCIÓN: se publicaba la del formulario, que es un domicilio
 * particular, no un local comercial. Google trata `address` como sede
 * visitable y puede mostrarla en el mapa del panel de conocimiento, así que
 * publicarla dirigía clientes a la casa de alguien.
 *
 * Ampargo es un negocio de ÁREA DE SERVICIO: se desplaza a la obra. Para ese
 * caso, la propia guía de Google es declarar `areaServed` y omitir la
 * dirección. `SERVICE_AREA.hasPublicOffice` gobierna la decisión: si algún día
 * abren oficina al público, se pone en `true` y la dirección vuelve sola.
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
    // Solo con local visitable; hoy `hasPublicOffice` es false.
    ...(SERVICE_AREA.hasPublicOffice
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: BUSINESS.streetAddress,
            addressLocality: BUSINESS.city,
            addressRegion: BUSINESS.region,
            postalCode: BUSINESS.postalCode,
            addressCountry: BUSINESS.country,
          },
        }
      : {
          // Sin sede pública, se declara la ciudad de operación sin calle.
          areaServed: {
            "@type": "City",
            name: SERVICE_AREA.city,
            containedInPlace: {
              "@type": "State",
              name: SERVICE_AREA.region,
            },
          },
        }),
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
