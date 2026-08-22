import { getTranslations } from "next-intl/server";

/**
 * WCAG 2.4.1 — permite saltar la navegación repetida.
 * Invisible hasta que recibe el foco por teclado. Server Component: no
 * necesita "use client", el texto ya llega localizado desde el servidor.
 */
export default async function SkipLink() {
  const t = await getTranslations("Nav");

  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:font-mono focus:text-sm focus:text-bone"
    >
      {t("skipToContent")}
    </a>
  );
}
