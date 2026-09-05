import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ArrowRight from "../icons/ArrowRight";

function AssuranceMark() {
  return (
    <svg viewBox="0 0 48 52" aria-hidden="true" className="h-9 w-9 flex-none text-muted sm:h-10 sm:w-10">
      <path
        d="M24 3 42 10v13c0 12.5-7.4 21.3-18 26C13.4 44.3 6 35.5 6 23V10L24 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m16.5 25 5 5 10-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hero editorial de la portada — fondo claro, texto e imagen en columnas.
 *
 * Fase 5: reemplaza la versión anterior (fondo carbón, foto a pantalla
 * completa con velos oscuros) por una composición de dos columnas sobre
 * `paper`, pedida explícitamente sobre una referencia visual concreta. La
 * fotografía sigue siendo el proyecto real (`exterior-lujo-01.jpeg`), ahora
 * contenida en un bloque propio en vez de extenderse de fondo — no hace
 * falta atenuarla con velos para que el texto se lea encima, porque el texto
 * ya no va encima.
 */
export default async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-12 pt-28 sm:pt-32 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-20 lg:pt-40">
        <div className="order-2 lg:order-1">
          <p className="motion-reveal-1 font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent">
            {t("heroEyebrow")}
          </p>
          <div className="mt-4 h-px w-10 bg-accent sm:mt-5" />

          <h1 className="motion-reveal-2 font-editorial mt-5 max-w-[26rem] whitespace-pre-line text-balance text-[clamp(2rem,3.6vw,2.9rem)] font-normal leading-[1.08] tracking-[-0.02em] text-ink">
            {t("heroHeadline")}
          </h1>

          <p className="motion-reveal-3 mt-5 max-w-[30rem] text-pretty text-base leading-relaxed text-muted">
            {t("heroBody")}
          </p>

          <div className="motion-reveal-4 mt-7 grid grid-cols-1 items-center gap-3 min-[360px]:grid-cols-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
            <Link
              href="/quote"
              className="motion-cta inline-flex min-h-[50px] items-center justify-center gap-2 bg-accent px-3 text-sm font-medium text-bone transition-colors hover:bg-accent-hover sm:gap-5 sm:px-6"
            >
              <span className="sm:hidden">{t("heroCtaShort")}</span>
              <span className="hidden sm:inline">{t("heroCtaPrimary")}</span>
              <ArrowRight />
            </Link>

            <Link
              href="/projects"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 border border-line px-3 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5 sm:gap-5 sm:px-6"
            >
              {t("heroCtaSecondary")}
              <ArrowRight />
            </Link>
          </div>

          <div className="motion-reveal-5 mt-9 flex max-w-[31rem] items-center gap-5 border-l-2 border-accent pl-5">
            <AssuranceMark />
            <p className="max-w-sm text-xs leading-relaxed text-muted sm:text-sm">
              {t("heroAssurance")}
            </p>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/3] w-full overflow-hidden lg:order-2 lg:aspect-[5/4]">
          <Image
            src="/images/proyectos/exterior-lujo-01.jpeg"
            alt={t("heroImageAlt")}
            fill
            preload
            loading="eager"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="motion-hero-image object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
