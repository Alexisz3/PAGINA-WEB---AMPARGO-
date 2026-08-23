import type { AppLocale } from "@/i18n/routing";

/**
 * Testimonios reales de clientes.
 *
 * REGLA INVIOLABLE: este archivo solo admite reseñas que el cliente haya
 * entregado por escrito, con nombre y autorización de publicación.
 *
 * Está deliberadamente VACÍO. La sección "What our clients say" existe como
 * componente y se renderiza sola en cuanto haya un elemento aquí; mientras el
 * arreglo esté vacío, `<Testimonials />` devuelve `null` y la sección no
 * aparece en la página. No hay marcador, no hay "próximamente", no hay nombres
 * de relleno.
 *
 * Inventar reseñas no es solo deshonesto: en EE. UU. las reseñas falsas están
 * perseguidas por la FTC, y el marcado `aggregateRating` con datos ficticios
 * es motivo de penalización manual de Google.
 *
 * Para publicar uno, añada un objeto con TODOS los campos obligatorios.
 */
export interface Testimonial {
  /** Identificador estable, independiente del idioma. */
  id: string;
  /** Nombre tal como el cliente autorizó publicarlo. Nunca inventado. */
  authorName: string;
  /** Ciudad o zona. Opcional: solo si el cliente autorizó publicarla. */
  authorLocation?: string;
  /**
   * Texto de la reseña en el idioma en que la escribió el cliente.
   * Se guarda por locale para no traducir palabras de otra persona sin avisar:
   * si solo existe en un idioma, se muestra en ese idioma en ambas versiones.
   */
  quote: Record<AppLocale, string> | { original: string; locale: AppLocale };
  /** Proyecto asociado, si corresponde. Debe existir en content/projects.ts. */
  projectId?: string;
  /** De dónde salió: útil para poder rastrear la autorización. */
  source: "written" | "google" | "facebook";
}

export const TESTIMONIALS: Testimonial[] = [];

/** La sección solo tiene sentido si hay algo real que mostrar. */
export const HAS_TESTIMONIALS = TESTIMONIALS.length > 0;
