import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

/**
 * Comodín que atrapa cualquier URL no reconocida dentro de un idioma.
 *
 * Por qué hace falta. `app/[locale]/not-found.tsx` solo se pinta cuando una
 * ruta EXISTENTE llama a `notFound()` — como hacen `/es/privacidad` y
 * `/es/terminos` mientras su texto legal siga sin revisar. Una dirección que
 * no coincide con ninguna ruta no llega a ningún segmento, así que Next
 * devolvía su pantalla por defecto: fondo negro, en inglés, sin cabecera, sin
 * pie y sin marca. Medido en el despliegue: 7.200 bytes contra los 22.500 del
 * 404 propio.
 *
 * Este segmento convierte esa dirección en una ruta que sí existe y que lo
 * primero que hace es llamar a `notFound()`, de modo que se pinta el mismo
 * 404 con marca, en el idioma del prefijo de la URL. Las direcciones sin
 * prefijo las resuelve antes `proxy.ts`, que les antepone el idioma detectado
 * y las trae aquí: `/ruta-sin-prefijo` → `/en/ruta-sin-prefijo` → este archivo.
 * No hay bucle porque el redirect ocurre una sola vez, antes de entrar.
 *
 * `setRequestLocale` va ANTES del `notFound()`: sin él, `not-found.tsx`
 * traduce con el idioma por defecto y una URL inventada en español devolvía
 * un 404 en inglés.
 */
export default async function CatchAllNotFound({
  params,
}: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) setRequestLocale(locale);
  notFound();
}
