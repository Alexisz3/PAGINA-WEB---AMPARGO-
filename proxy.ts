import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 renombró `middleware.ts` a `proxy.ts` (el runtime `edge` ya no
 * se admite aquí; el runtime de `proxy` es `nodejs` y no es configurable).
 * `next-intl` sigue exponiendo `createMiddleware`, pero el archivo debe
 * llamarse `proxy.ts` para que Next 16 lo reconozca.
 */
export default createMiddleware(routing);

export const config = {
  // Excluye API, internals de Next, Vercel y cualquier archivo con extensión
  // (favicon, robots.txt, sitemap.xml, imágenes servidas por next/image…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
