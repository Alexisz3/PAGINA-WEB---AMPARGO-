import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ArrowRight from "../icons/ArrowRight";

function AssuranceMark() {
  return (
    <svg viewBox="0 0 48 52" aria-hidden="true" className="h-9 w-9 flex-none text-bone/65 sm:h-10 sm:w-10">
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
 * Hero editorial de la portada. La fotografía sigue siendo el proyecto real;
 * el tratamiento de color y los velos construyen la atmósfera sin sustituirla.
 */
export default async function HomeHero() {
  const t = await getTranslations("Home");

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-carbon text-bone lg:block">
      <div className="relative order-2 aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
      <Image
        src="/images/proyectos/exterior-lujo-01.jpeg"
        alt={t("heroImageAlt")}
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="motion-hero-image object-cover object-center lg:brightness-[0.84] lg:contrast-[1.04] lg:saturate-[0.9]"
      />
      </div>

      {/* Tinte cálido y velos direccionales para conservar legibilidad sin
          esconder la arquitectura en la mitad derecha. */}
      <div className="absolute inset-0 hidden bg-[#5a2a16]/15 mix-blend-color lg:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-carbon from-0% via-carbon/72 via-46% to-carbon/5 lg:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-b from-carbon/35 via-transparent via-45% to-carbon/60 lg:block" />

      {/* Retícula técnica muy tenue, inspirada en planos arquitectónicos. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 hidden w-[34%] opacity-[0.055] lg:block"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,246,240,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(248,246,240,.55) 1px, transparent 1px), linear-gradient(35deg, transparent 48%, rgba(248,246,240,.45) 49%, rgba(248,246,240,.45) 50%, transparent 51%)",
          backgroundSize: "72px 72px, 72px 72px, 180px 180px",
          maskImage: "linear-gradient(to right, black, transparent)",
        }}
      />

      <div className="relative order-1 mx-auto flex w-full max-w-[1400px] items-center px-6 pb-9 pt-28 sm:pt-32 lg:min-h-[min(820px,90svh)] lg:px-10 lg:pb-20 lg:pt-36">
        <div className="w-full max-w-[720px] lg:w-[58%]">
          <p className="motion-reveal-1 font-mono text-xs font-medium uppercase tracking-[0.12em] text-accent-ink">
            {t("heroEyebrow")}
          </p>
          <div className="mt-4 h-px w-10 bg-accent-ink sm:mt-5" />

          <h1 className="motion-reveal-2 font-editorial mt-5 max-w-[46rem] whitespace-pre-line text-balance text-[clamp(2.125rem,3.2vw,3.2rem)] font-normal leading-[1.06] tracking-[-0.025em] text-bone sm:mt-6">
            {t("heroHeadline")}
          </h1>

          <p className="motion-reveal-3 mt-5 max-w-[36rem] text-pretty text-base leading-relaxed text-bone/80 lg:text-[1.05rem]">
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
              className="inline-flex min-h-[50px] items-center justify-center gap-2 border border-bone/45 px-3 text-sm font-medium text-bone transition-colors hover:border-bone hover:bg-bone/8 sm:gap-5 sm:px-6"
            >
              {t("heroCtaSecondary")}
              <ArrowRight />
            </Link>
          </div>

          <div className="motion-reveal-5 mt-9 hidden max-w-[31rem] items-center gap-5 border-l-2 border-accent-ink pl-5 lg:flex">
            <AssuranceMark />
            <p className="max-w-sm text-xs leading-relaxed text-bone/60 sm:text-sm">
              {t("heroAssurance")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
