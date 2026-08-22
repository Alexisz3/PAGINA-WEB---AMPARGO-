import Image from "next/image";

interface PageHeroProps {
  /** Palabra monumental (PROYECTOS., SERVICIOS.) — el ADN del home en interiores. */
  title: string;
  tagline?: string;
  intro?: string;
  imageSrc: string;
  imageAlt: string;
  /** Altura reducida: para páginas donde el contenido debe empezar antes. */
  compact?: boolean;
}

/**
 * Hero de página interna: conserva el ADN del home (foto cinematográfica +
 * palabra monumental + punto acento) pero más bajo, para que el contenido
 * de la página empiece antes. Las referencias aprobadas lo muestran así.
 */
export default function PageHero({
  title,
  tagline,
  intro,
  imageSrc,
  imageAlt,
  compact = false,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-carbon">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Sin z-index negativo: enviaría los velos detrás de la foto. */}
      <div className="absolute inset-0 bg-gradient-to-t from-carbon from-20% via-carbon/80 via-55% to-carbon/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/85 via-carbon/40 to-transparent" />

      <div
        className={`relative mx-auto max-w-[1400px] px-6 lg:px-10 ${
          compact ? "pb-10 pt-28 lg:pb-14 lg:pt-36" : "pb-14 pt-32 lg:pb-20 lg:pt-44"
        }`}
      >
        <h1 className="font-display font-bold leading-[0.9] tracking-[-0.02em] text-bone [font-size:clamp(2.5rem,8vw,6rem)]">
          {title}
          <span className="text-accent">.</span>
        </h1>
        {tagline ? (
          <p className="mt-4 font-display text-bone [font-size:clamp(1.05rem,2vw,1.5rem)]">{tagline}</p>
        ) : null}
        {intro ? (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-bone/80">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}
