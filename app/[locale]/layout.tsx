import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale, getMessages } from "next-intl/server";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { SITE_URL, INDEXABLE } from "@/lib/site";
import SkipLink from "@/components/SkipLink";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Metadata" });
  const prefix = LOCALE_PREFIXES[locale as AppLocale];

  // hreflang recíproco: cada idioma apunta a la home de ambos idiomas.
  const languages: Record<string, string> = {};
  for (const [loc, pfx] of Object.entries(LOCALE_PREFIXES)) {
    languages[loc] = pfx;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: prefix,
      languages: { ...languages, "x-default": "/" },
    },
    robots: INDEXABLE
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "website",
      siteName: "Ampargo",
      locale: locale.replace("-", "_"),
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => l.replace("-", "_")),
      url: prefix,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Habilita el renderizado estático: sin esto, next-intl fuerza dinámico.
  setRequestLocale(locale);

  /*
   * Solo viajan al navegador los espacios de nombres que usan Client
   * Components (Header, MobileMenu, LocaleSwitcher, ProjectCarousel,
   * ProjectFilters). `Home`, `Footer`, `Process`, `ServiceCards`, `Metadata`
   * y `NotFound` se renderizan en servidor y no tienen por qué pesar en el
   * bundle. La página de cotización añade `Quote` y `Services` con su propio
   * proveedor anidado, para no cargarlos en el resto del sitio.
   */
  const messages = await getMessages();
  const clientMessages = {
    Nav: messages.Nav,
    Contact: messages.Contact,
    Projects: messages.Projects,
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <SkipLink />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
