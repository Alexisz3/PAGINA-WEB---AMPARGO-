import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Toda navegación interna debe pasar por aquí, nunca por <a>/next/link directo
 * ni por router.push de next/navigation. Así se garantiza que:
 *  - el idioma actual se conserva al navegar entre páginas,
 *  - el selector de idioma cambia de slug preservando la página equivalente
 *    (o la misma entidad dinámica, con el slug traducido),
 *  - un enlace nunca queda roto por escribir la ruta a mano.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
