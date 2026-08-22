/**
 * Reparto interno entre los contactos de WhatsApp.
 *
 * Los dos números son igualmente principales y el visitante no elige persona:
 * la asignación se calcula aquí. Es determinista (una misma solicitud siempre
 * va al mismo contacto, también al reintentar) y reparte ~50/50 en el agregado.
 *
 * Nota de alcance: hoy la semilla se deriva de los datos de la solicitud porque
 * no existe todavía persistencia con identificador propio. Cuando exista el
 * backend, la semilla debe pasar a ser el identificador de la cotización y el
 * contacto asignado debe guardarse junto a ella.
 */

/** FNV-1a de 32 bits sobre los bytes UTF-8 (seguro con acentos y eñes). */
export function fnv1a32(input: string): number {
  const bytes = new TextEncoder().encode(input);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    // hash *= 16777619 con desplazamientos, para no perder precisión en float64.
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Índice del contacto asignado.
 * Devuelve 0 si no hay contactos, para que quien llame nunca reciba `undefined`.
 */
export function pickContactIndex(seed: string, contactCount: number): number {
  if (contactCount <= 0) return 0;
  return fnv1a32(seed) % contactCount;
}
