import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuoteShell from "@/components/quote/QuoteShell";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function QuotePage({ params }: PageProps<"/[locale]/quote">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tn = await getTranslations("Nav");
  const tq = await getTranslations("Quote");

  // Proveedor anidado: `Quote` y `Services` solo se envían al navegador en
  // esta página, no en todo el sitio.
  const messages = await getMessages();
  const quoteMessages = { Quote: messages.Quote, Services: messages.Services };

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        {/* Cabecera oscura compacta: la cotización no necesita hero fotográfico
            a pantalla completa, necesita que el formulario empiece pronto. */}
        <section className="bg-carbon pb-12 pt-32 lg:pb-16 lg:pt-40">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <h1 className="font-display font-bold uppercase leading-[0.9] tracking-[-0.02em] text-bone [font-size:clamp(2rem,6vw,4.5rem)]">
              {tn("quote")}
            </h1>
            <p className="mt-3 text-bone/75 [font-size:clamp(1rem,1.6vw,1.25rem)]">
              {tq("subtitle")}
            </p>
          </div>
        </section>

        <NextIntlClientProvider messages={quoteMessages}>
          <QuoteShell />
        </NextIntlClientProvider>
      </main>
      <Footer />
    </>
  );
}
