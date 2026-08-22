/**
 * Configuración de sitio dependiente del entorno.
 *
 * Nada de URLs de producción escritas a fuego: el dominio todavía no existe.
 * Hasta que exista, el sitio se sirve con `noindex` para que un despliegue
 * provisional no se indexe y compita después con el dominio real.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Solo se permite indexar cuando se activa explícitamente.
 * Poner `NEXT_PUBLIC_INDEXABLE=true` únicamente cuando el dominio definitivo
 * esté apuntando al sitio. Ver el checklist de lanzamiento en GUIA_PROYECTO.md.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export const BUSINESS = {
  name: "Ampargo",
  streetAddress: "8027 Burning Hills Dr",
  city: "Houston",
  region: "TX",
  postalCode: "77075",
  country: "US",
  /**
   * Teléfonos en E.164. Ambos contactos son igualmente principales;
   * el primero se usa como teléfono de ficha para los datos estructurados.
   */
  phones: ["+18327940720", "+18326524660"],
} as const;

/**
 * Fuente única de los dos contactos de WhatsApp — igualmente principales.
 * Vive fuera de los diccionarios de idioma a propósito: un nombre o un
 * teléfono no se traducen, y tenerlos por duplicado en es-US.json y en-US.json
 * es exactamente el defecto que se encontró en la versión anterior del sitio
 * (ver AUDITORIA_Y_PLAN_AMPARGO.md, hallazgo P2-3): si alguien actualiza un
 * número en un idioma y olvida el otro, el CTA principal queda roto a medias.
 */
export const WHATSAPP_CONTACTS = [
  { id: "jose-andrade", name: "Jose Andrade", phone: "18327940720", phoneDisplay: "(832) 794-0720" },
  { id: "mario-parra", name: "Mario Parra", phone: "18326524660", phoneDisplay: "(832) 652-4660" },
] as const;

/** Correo empresarial: todavía no definido por el cliente. No inventar uno. */
export const BUSINESS_EMAIL: string | null = null;
