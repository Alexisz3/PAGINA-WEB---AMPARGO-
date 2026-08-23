/**
 * Configuración de sitio dependiente del entorno.
 *
 * Nada de URLs de producción escritas a fuego: el dominio todavía no existe.
 * Hasta que exista, el sitio se sirve con `noindex` para que un despliegue
 * provisional no se indexe y compita después con el dominio real.
 */

/**
 * Convierte un valor de entorno en un origen HTTP(S) normalizado, o `null`.
 *
 * `allowProtocolLess` distingue dos tipos de fuente:
 *  - Las variables de Vercel (`VERCEL_URL`) llegan como host desnudo
 *    (`foo.vercel.app`) y es correcto asumir https.
 *  - Un valor escrito a mano SIN protocolo es casi siempre un error de
 *    configuración; asumir https lo convertiría en un dominio aparente y
 *    ocultaría el fallo. Por eso ahí se rechaza.
 */
export function parseHttpOrigin(
  value: string | undefined,
  { allowProtocolLess = false }: { allowProtocolLess?: boolean } = {}
): string | null {
  // `?? fallback` NO basta: una variable definida como cadena vacía en el
  // panel de Vercel pasa el `??` y revienta `new URL("")` durante el
  // prerender. Hay que tratar "" y "   " como ausencia.
  const candidate = value?.trim();
  if (!candidate) return null;

  const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(candidate);
  if (hasProtocol && !/^https?:\/\//i.test(candidate)) return null; // javascript:, file:, data:…
  if (!hasProtocol && !allowProtocolLess) return null; // ruta relativa o dominio suelto

  try {
    const url = new URL(hasProtocol ? candidate : `https://${candidate}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname) return null;
    return url.origin; // normaliza y elimina la barra final
  } catch {
    return null;
  }
}

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const fromExplicit = parseHttpOrigin(explicit);
  if (fromExplicit) return fromExplicit;

  // Un valor presente pero inválido es un error de configuración, no una
  // ausencia: se avisa en build en lugar de degradar en silencio a localhost
  // y publicar metadata apuntando a una máquina local.
  if (explicit?.trim() && process.env.NODE_ENV === "production") {
    console.warn(
      `[ampargo] NEXT_PUBLIC_SITE_URL no es una URL http(s) absoluta válida. ` +
        `Se ignora y se usa el fallback. Valor recibido: ${JSON.stringify(explicit)}`
    );
  }

  // Vercel expone estas sin protocolo; ahí sí es correcto asumir https.
  const production = parseHttpOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL, {
    allowProtocolLess: true,
  });
  if (production) return production;

  const preview = parseHttpOrigin(process.env.VERCEL_URL, { allowProtocolLess: true });
  if (preview) return preview;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/**
 * Solo se permite indexar cuando se activa explícitamente.
 * Poner `NEXT_PUBLIC_INDEXABLE=true` únicamente cuando el dominio definitivo
 * esté apuntando al sitio. Ver el checklist de lanzamiento en README.md.
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
