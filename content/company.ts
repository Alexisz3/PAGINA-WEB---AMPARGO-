import type { AppLocale } from "@/i18n/routing";

/**
 * Datos institucionales de Andrade Parra Corporation.
 *
 * Separado de los diccionarios de i18n a propósito: esto no es copy de
 * interfaz, son HECHOS sobre la empresa. Si un hecho no está confirmado por
 * el cliente, su campo vale `null` y la sección que lo consume no se renderiza.
 *
 * El patrón es siempre el mismo: dato ausente → sección ausente. Nunca
 * "Añada aquí la historia de la empresa" en producción.
 */

/* ─── Historia ───────────────────────────────────────────────────────────
 * El formulario de requerimientos (Q37/Q41) solo aportó una frase de
 * intención — "se dedica a cumplir los sueños del cliente" — que no alcanza
 * para una sección "Our Story" creíble. Falta: año de fundación, origen,
 * trayectoria, tipo de obra dominante.
 *
 * NO se redacta una historia plausible: sería ficción sobre una empresa real.
 * Cuando el cliente responda el cuestionario de CONTENT REQUIRED, se rellena
 * aquí y la sección aparece sola.
 */
export interface CompanyStory {
  paragraphs: Record<AppLocale, string[]>;
}

export const COMPANY_STORY: CompanyStory | null = null;

/* ─── Personas ───────────────────────────────────────────────────────────
 * Se conocen tres nombres por el formulario (Jose Andrade, Ramon Andrade,
 * Mario Parra), pero NO se conocen sus cargos, ni su trayectoria, ni existe
 * autorización para publicar fotos suyas.
 *
 * Publicar un nombre con un cargo inventado es exactamente el tipo de dato
 * falso que el proyecto prohíbe, así que la sección queda vacía hasta que
 * cada persona confirme cómo quiere aparecer.
 */
export interface TeamMember {
  id: string;
  name: string;
  /** Cargo tal como la persona lo confirmó. Nunca deducido. */
  role: Record<AppLocale, string>;
  /** Biografía breve, opcional. */
  bio?: Record<AppLocale, string>;
  /** Archivo en /public/images/equipo/. Requiere consentimiento por escrito. */
  photo?: string;
}

export const TEAM: TeamMember[] = [];

/* ─── Zona de servicio y sede ────────────────────────────────────────────
 * `hasPublicOffice` gobierna si se publica la dirección, si aparece el enlace
 * "cómo llegar" y si el JSON-LD incluye `address`. Confirmado por el cliente
 * (2026-08-23): 8027 Burning Hills Dr es una oficina comercial donde reciben
 * clientes, no un domicilio particular.
 *
 * Esto importa más de lo que parece: una dirección verificable es uno de los
 * factores más fuertes del SEO local, y es requisito para reclamar la ficha de
 * Google Business Profile.
 */
export const SERVICE_AREA = {
  city: "Houston",
  region: "TX",
  country: "US",
  /**
   * Municipios que la empresa cubre de verdad, para la sección de cobertura.
   *
   * VACÍO A PROPÓSITO. Es tentador rellenarlo con los suburbios obvios del
   * área metropolitana (Katy, Sugar Land, Pearland…), pero eso sería inventar:
   * afirmar cobertura en un municipio al que quizá no se desplazan genera
   * solicitudes que hay que rechazar, y es justo la clase de promesa que
   * destruye la confianza que la sección busca construir.
   *
   * Mientras esté vacío, la sección afirma solo "Houston y alrededores" e
   * invita a preguntar. Al añadir municipios, la lista aparece sola.
   */
  nearbyAreas: [] as string[],
  /** Confirmado por el cliente: hay local comercial que recibe clientes. */
  hasPublicOffice: true,
} as const;

/* ─── Señales de confianza ───────────────────────────────────────────────
 * Solo afirmaciones verificables hoy. Cada una está respaldada por un hecho
 * comprobable del negocio o del propio sitio:
 *
 *   serviceArea       → confirmado en el formulario, Q4.
 *   residentialCommercial → confirmado en Q15 (incluye obra comercial).
 *   freeEstimates     → cierto: el formulario de cotización no tiene costo.
 *   bilingual         → cierto y comprobable: el sitio existe en ES y EN.
 *
 * NO se incluyen: años de experiencia, número de obras, licencias, seguros,
 * premios ni garantías. Ninguno está confirmado por escrito.
 */
export const TRUST_SIGNALS = [
  "serviceArea",
  "residentialCommercial",
  "freeEstimates",
  "bilingual",
] as const;

export type TrustSignal = (typeof TRUST_SIGNALS)[number];
