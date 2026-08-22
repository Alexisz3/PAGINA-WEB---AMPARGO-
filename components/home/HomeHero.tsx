import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Hero monumental del Concepto A.
 *
 * La palabra AMPARGO se usa como recurso tipográfico a escala, no como
 * logotipo. Escala con clamp() para que en móvil siga siendo legible y no
 * se corte — la referencia móvil aprobada la muestra grande pero contenida.
 *
 * Server Component: no hay interactividad, así que no paga hidratación.
 */
export default async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="relative isolate min-h-[88svh] overflow-hidden bg-carbon lg:min-h-[92svh]">
      <Image
        src="/images/proyectos/exterior-lujo-01.jpeg"
        alt={t("heroImageAlt")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/*
        Velo direccional en dos capas. Medido sobre los píxeles reales de la
        foto: sin él, el texto blanco cae por debajo del mínimo de contraste
        sobre las zonas claras (cielo, hormigón). Oscurece abajo-izquierda,
        donde vive el texto, y deja respirar arriba-derecha, donde está la obra.
      */}
      {/* Sin z-index negativo: `-z-10` los enviaba DETRÁS de la foto y el velo
          no se aplicaba en absoluto (el titular quedaba a 1,08:1, ilegible).
          Al ir después de <Image> en el DOM, se pintan encima por orden. */}
      <div className="absolute inset-0 bg-gradient-to-t from-carbon from-15% via-carbon/70 via-50% to-carbon/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/75 via-carbon/15 to-transparent" />

      <div className="relative mx-auto flex min-h-[88svh] max-w-[1400px] flex-col justify-end px-6 pb-28 pt-32 lg:min-h-[92svh] lg:px-10 lg:pb-40">
        <h1 className="font-display font-bold leading-[0.85] tracking-[-0.02em] text-bone [font-size:clamp(3.5rem,13vw,11rem)]">
          {t("heroHeadline")}
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-pretty font-display text-bone [font-size:clamp(1.125rem,2.6vw,2rem)]">
          {t("heroSubhead")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/quote"
            className="inline-flex min-h-[52px] items-center gap-2 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
          >
            {t("heroCtaPrimary")}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-[52px] items-center gap-2 border border-bone/40 px-6 text-sm text-bone transition-colors hover:bg-bone/10"
          >
            {t("heroCtaSecondary")}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
