import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { WHATSAPP_CONTACTS, BUSINESS_EMAIL } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SERVICE_AREA } from "@/content/company";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import TrackedContactLink from "@/components/TrackedContactLink";
import { Link } from "@/i18n/navigation";
import ArrowRight from "@/components/icons/ArrowRight";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "Contact" });
  const path = (l: AppLocale) => `${LOCALE_PREFIXES[l]}${l === "es-US" ? "/contacto" : "/contact"}`;

  return {
    title:
      locale === "es-US"
        ? "Contacte a Ampargo | Houston, TX"
        : "Contact Ampargo | Houston, TX",
    description: t("intro"),
    alternates: {
      canonical: path(locale as AppLocale),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: { type: "website", title: t("heading"), url: path(locale as AppLocale) },
  };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Contact");

  /*
   * El mensaje prellenado va en el idioma que el visitante está leyendo:
   * quien navega en español no debería abrir WhatsApp con un texto en inglés.
   */
  const waMessage =
    loc === "es-US"
      ? "Hola, me gustaría hablar sobre un proyecto."
      : "Hi, I'd like to talk about a project.";

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={tn("contact")}
          tagline={tc("heading")}
          intro={tc("intro")}
          imageSrc="/images/proyectos/interior-01.jpeg"
          imageAlt={tc("heading")}
          compact
        />

        <section className="bg-paper py-12 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            {/*
              Canales de contacto reales, en tarjetas de igual peso.
              La página anterior solo tenía hero + banda de cierre: un visitante
              que entraba a "Contacto" no encontraba un teléfono.
            */}
            <div className="grid gap-px overflow-hidden border border-line bg-line lg:grid-cols-3">
              {/* ── Llamar ── */}
              <div className="bg-surface p-6 lg:p-8">
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  {tc("callLabel")}
                </h2>
                <p className="mt-2 text-sm text-muted">{tc("callHelp")}</p>
                <ul className="mt-5 space-y-1">
                  {WHATSAPP_CONTACTS.map((c) => (
                    <li key={c.phone}>
                      <TrackedContactLink
                        href={`tel:+${c.phone}`}
                        event="phone_clicked"
                        params={{ contact: c.id }}
                        className="flex min-h-[48px] flex-col justify-center transition-colors hover:text-accent"
                      >
                        <span className="font-mono text-lg text-ink">{c.phoneDisplay}</span>
                        <span className="text-xs text-muted">{c.name}</span>
                      </TrackedContactLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── WhatsApp ── */}
              <div className="bg-surface p-6 lg:p-8">
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  {tc("whatsappLabel")}
                </h2>
                <p className="mt-2 text-sm text-muted">{tc("whatsappHelp")}</p>
                <ul className="mt-5 space-y-1">
                  {WHATSAPP_CONTACTS.map((c) => {
                    const href = buildWhatsAppLink(c.phone, waMessage);
                    // Sin enlace válido no se pinta un botón muerto.
                    if (!href) return null;
                    return (
                      <li key={c.phone}>
                        <TrackedContactLink
                          href={href}
                          event="whatsapp_clicked"
                          params={{ contact: c.id }}
                          external
                          className="flex min-h-[48px] flex-col justify-center transition-colors hover:text-accent"
                        >
                          <span className="font-mono text-lg text-ink">{c.phoneDisplay}</span>
                          <span className="text-xs text-muted">
                            {c.name} · {tc("whatsappAction")}
                          </span>
                        </TrackedContactLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ── Zona de servicio ──
                  Zona, no dirección: la que consta en el formulario es un
                  domicilio particular y no hay local visitable por clientes.
                  Por el mismo motivo no se incrusta un mapa. */}
              <div className="bg-surface p-6 lg:p-8">
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                  {tc("addressLabel")}
                </h2>
                <p className="mt-2 text-sm text-muted">{tc("serviceAreaHelp")}</p>
                <p className="mt-5 font-display text-lg font-semibold text-ink">
                  {tc("address")}
                </p>
                {SERVICE_AREA.nearbyAreas.length > 0 ? (
                  <p className="mt-2 text-sm text-muted">
                    {SERVICE_AREA.nearbyAreas.join(" · ")}
                  </p>
                ) : null}

                {/* Solo si existe un correo real configurado. */}
                {BUSINESS_EMAIL ? (
                  <div className="mt-6 border-t border-line pt-5">
                    <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                      {tc("emailLabel")}
                    </h3>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="mt-2 flex min-h-[44px] items-center text-ink transition-colors hover:text-accent"
                    >
                      {BUSINESS_EMAIL}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* ── Puente al formulario ── */}
            <div className="mt-8 flex flex-col gap-5 border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between lg:mt-10 lg:p-8">
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  {tc("preferLabel")}
                </h2>
                <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-muted">
                  {tc("preferBody")}
                </p>
              </div>
              <Link
                href="/quote"
                className="inline-flex min-h-[48px] w-fit flex-none items-center gap-2 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
              >
                {tn("quote")}
                <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
