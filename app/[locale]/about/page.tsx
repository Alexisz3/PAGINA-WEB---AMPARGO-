import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, LOCALE_PREFIXES, type AppLocale } from "@/i18n/routing";
import { COMPANY_STORY, TEAM } from "@/content/company";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { BRAND } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const VALUES = [1, 2, 3, 4] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale: locale as Locale, namespace: "About" });
  const path = (l: AppLocale) => `${LOCALE_PREFIXES[l]}${l === "es-US" ? "/nosotros" : "/about"}`;

  return {
    title:
      locale === "es-US"
        ? `Sobre ${BRAND.name} | Houston, TX`
        : `About ${BRAND.name} | Houston, TX`,
    description: t("metaDescription"),
    alternates: {
      canonical: path(locale as AppLocale),
      languages: { "es-US": path("es-US"), "en-US": path("en-US") },
    },
    openGraph: { type: "website", title: t("heading"), url: path(locale as AppLocale) },
  };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const loc = locale as AppLocale;
  const ta = await getTranslations("About");
  const th = await getTranslations("Home");

  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <PageHero
          title={ta("eyebrow")}
          tagline={ta("heading")}
          intro={th("valuesBody4")}
          imageSrc="/images/proyectos/estructura-04.jpeg"
          imageAlt={ta("heading")}
          compact
        />

        {/*
          ── Our story ──
          Se renderiza SOLO si `COMPANY_STORY` tiene contenido. Hoy vale `null`:
          el formulario del cliente no aportó año de fundación, origen ni
          trayectoria, y redactar una historia "plausible" sobre una empresa
          real sería ficción con su nombre encima.

          Sin datos no hay sección — no un bloque con texto de relleno, que es
          precisamente lo que delata una web sin terminar.
        */}
        {COMPANY_STORY ? (
          <section className="bg-paper py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">
                {ta("storyHeading")}
              </h2>
              <div className="mt-6 max-w-2xl space-y-4">
                {COMPANY_STORY.paragraphs[loc].map((p) => (
                  <p key={p} className="text-pretty text-lg leading-relaxed text-ink">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Valores: cómo trabaja la empresa ── */}
        <section className="bg-paper py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">
              {ta("valuesHeading")}
            </h2>
            <ul className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              {VALUES.map((n) => (
                <li key={n} className="bg-surface p-6 lg:p-8">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {th(`valuesHeading${n}`)}
                  </h3>
                  <p className="mt-3 text-pretty leading-relaxed text-muted">
                    {th(`valuesBody${n}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          ── Las personas detrás de la empresa ──
          Se conocen tres nombres por el formulario, pero no sus cargos, ni sus
          trayectorias, ni hay autorización para publicar sus fotos. Publicar un
          nombre real junto a un cargo supuesto es inventar sobre personas
          identificables, así que `TEAM` está vacío y la sección no existe.
        */}
        {TEAM.length > 0 ? (
          <section className="bg-surface py-16 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <h2 className="font-display text-2xl font-semibold text-ink lg:text-3xl">
                {ta("teamHeading")}
              </h2>
              <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {TEAM.map((member) => (
                  <li key={member.id}>
                    {member.photo ? (
                      <div className="relative aspect-[4/5] overflow-hidden bg-carbon">
                        <Image
                          src={`/images/equipo/${member.photo}`}
                          alt={member.name}
                          fill
                          loading="lazy"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent">
                      {member.role[loc]}
                    </p>
                    {member.bio ? (
                      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
                        {member.bio[loc]}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
