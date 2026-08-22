import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Ruta legal en BORRADOR. Deliberadamente:
 *  - `noindex` mientras el contenido no sea revisado por el cliente,
 *  - excluida del sitemap (ver app/sitemap.ts),
 *  - sin enlace desde la navegación pública.
 * No se publica texto legal generado por IA como si fuera política vigente.
 */
export const metadata = { robots: { index: false, follow: false } };

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Footer");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-36 lg:pt-44">
          <h1 className="font-display text-3xl font-semibold text-ink">{t("privacy")}</h1>
          <p className="mt-6 border-l-2 border-accent bg-surface p-4 text-sm text-muted">
            Borrador pendiente de revisión legal. Este texto no constituye la
            política vigente de AMPARGO y no debe publicarse sin aprobación.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
