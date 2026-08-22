import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ArrowRight from "../icons/ArrowRight";

/**
 * Hero monumental del Concepto A.
 *
 * Jerarquía de CTA según la referencia móvil V2 aprobada: un botón compacto
 * ajustado al texto + un enlace textual con flecha. NO dos cajas apiladas de
 * ancho completo — eso hacía que los botones compitieran con la fotografía,
 * que es justo lo que debe dominar.
 *
 * Server Component: sin interactividad, no paga hidratación.
 */
export default async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="relative isolate overflow-hidden bg-carbon">
      <Image
        src="/images/proyectos/exterior-lujo-01.jpeg"
        alt={t("heroImageAlt")}
        fill
        priority
        sizes="100vw"
        // Dirección de arte por breakpoint. En un recorte vertical de móvil la
        // escena se pierde si se centra por defecto: se sesga hacia arriba
        // para conservar la cabaña y el borde de la piscina, que es el sujeto.
        // En escritorio el encuadre completo ya respira.
        className="object-cover object-[42%_38%] sm:object-center"
      />

      {/* Velos direccionales. Sin z-index negativo: eso los enviaría detrás de
          la foto y el titular caería a ~1:1 de contraste (medido). */}
      <div className="absolute inset-0 bg-gradient-to-t from-carbon from-12% via-carbon/60 via-45% to-carbon/5" />
      {/* En móvil el velo lateral es más suave: el texto está abajo, ya
          cubierto por el velo vertical, y aquí sólo apagaba la foto. */}
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/45 via-carbon/10 to-transparent sm:from-carbon/75 sm:via-carbon/15" />

      {/*
        `--pb` alimenta la utilidad .pb-safe: 4rem en móvil, 9rem en escritorio.
        Los 9rem dan holgura a las tarjetas de servicio, que suben 6rem sobre
        el hero; con menos, taparían los botones (detectado por axe).
      */}
      <div className="relative mx-auto flex min-h-[86svh] max-w-[1400px] flex-col justify-end px-6 pt-28 pb-safe [--pb:4rem] sm:pt-32 lg:min-h-[92svh] lg:px-10 lg:[--pb:9rem]">
        <h1 className="font-display font-bold leading-[0.85] tracking-[-0.02em] text-bone [font-size:clamp(3.25rem,13vw,11rem)]">
          {t("heroHeadline")}
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-pretty font-display text-bone [font-size:clamp(1.0625rem,2.6vw,2rem)]">
          {t("heroSubhead")}
        </p>

        {/* Botón compacto + enlace textual. `w-fit` evita que el botón se
            estire a ancho completo cuando el contenedor es flex. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/quote"
            className="inline-flex min-h-[48px] w-fit items-center gap-2 bg-accent px-5 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
          >
            {t("heroCtaPrimary")}
            <ArrowRight />
          </Link>

          <Link
            href="/projects"
            className="inline-flex min-h-[48px] w-fit items-center gap-2 border-b border-bone/50 text-sm text-bone transition-colors hover:border-bone"
          >
            {t("heroCtaSecondary")}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
