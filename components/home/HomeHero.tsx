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
        /*
         * Next 16 dejó OBSOLETO `priority` en favor de `preload`. Con el prop
         * antiguo el navegador no recibía ni el <link rel="preload"> en la
         * cabecera ni prioridad alta de descarga: la imagen del hero, que es
         * el elemento LCP, competía con el resto de recursos.
         *
         * `loading="eager"` va aparte porque `loading` sigue por defecto en
         * `lazy`, y precargar algo que luego se difiere no tiene sentido.
         */
        preload
        loading="eager"
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
        {/*
          El titular pasa de una palabra de 7 letras ("AMPARGO") a un nombre de
          25, así que se parte en los dos niveles de la marca en vez de crecer
          hasta desbordar: con el clamp anterior, "CORPORATION" sola medía más
          que el ancho útil de una pantalla de 375 px.

          Desaparece también el punto de acento: era el remate del wordmark
          antiguo. El nuevo lleva su acento en el travesaño rojo del isotipo, y
          un punto final tras el nombre de una corporación se lee como errata.
        */}
        <h1 className="font-display font-bold leading-[0.85] tracking-[-0.02em] text-bone">
          <span className="block [font-size:clamp(2.5rem,10vw,8rem)]">{t("heroHeadline")}</span>
          <span className="mt-2 block font-medium tracking-[0.08em] text-bone/85 [font-size:clamp(1.05rem,3.4vw,2.6rem)]">
            {t("heroHeadlineSuffix")}
          </span>
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
