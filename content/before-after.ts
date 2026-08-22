/**
 * Pares «antes / después».
 *
 * REGLA INNEGOCIABLE: aquí solo entran pares que el cliente haya CONFIRMADO
 * como el mismo espacio, con consentimiento del propietario. Está prohibido
 * emparejar dos fotos porque «parecen» del mismo sitio: el Agente D identificó
 * agrupaciones plausibles en el material actual, pero ninguna está confirmada.
 *
 * Mientras esta lista esté vacía, la sección pública NO se renderiza.
 * No se muestra una sección vacía ni un marcador de posición.
 */

export interface BeforeAfterPair {
  id: string;
  /** Nombre del proyecto tal y como lo confirme el cliente. */
  project: string;
  beforeFile: string;
  afterFile: string;
  beforeAlt: string;
  afterAlt: string;
  /** Posición inicial del divisor, en porcentaje. */
  initialPosition: number;
  /** El cliente confirma que ambas fotos son el mismo espacio. */
  sameSpaceConfirmed: boolean;
  /** Consentimiento del propietario para publicar la obra. */
  consentConfirmed: boolean;
}

/** Vacío a propósito: el cliente todavía no ha entregado el material. */
export const BEFORE_AFTER_PAIRS: BeforeAfterPair[] = [];

/**
 * Solo se publican los pares doblemente confirmados. Un par a medias
 * no se muestra: es preferible no tener sección a publicar algo sin permiso.
 */
export function publishablePairs(): BeforeAfterPair[] {
  return BEFORE_AFTER_PAIRS.filter((p) => p.sameSpaceConfirmed && p.consentConfirmed);
}
