import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1} className="bg-carbon">
        <div className="mx-auto flex min-h-[60svh] max-w-[1400px] flex-col justify-center px-6 py-32 lg:px-10">
          <p className="font-mono text-sm text-accent-ink">404</p>
          <h1 className="mt-4 font-display font-bold leading-[0.95] text-bone [font-size:clamp(2rem,6vw,4rem)]">
            {t("heading")}
          </h1>
          <p className="mt-4 max-w-md text-bone/75">{t("body")}</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-[52px] w-fit items-center bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
          >
            {t("cta")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
