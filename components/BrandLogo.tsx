import { BRAND } from "@/lib/site";

/**
 * Logotipo de Andrade Parra Corporation.
 *
 * El SÍMBOLO va como SVG en línea y el NOMBRE como texto HTML, no como un
 * `<img>` del SVG completo. Tres razones concretas:
 *
 *  · El texto real se lee, se selecciona, se traduce y lo anuncia un lector de
 *    pantalla; un nombre convertido en trazado es una imagen muda.
 *  · La tipografía usa la misma Space Grotesk ya cargada por la página, así
 *    que no hay una segunda descarga ni un salto de fuente.
 *  · Los colores salen de `currentColor`, de modo que una misma pieza sirve
 *    sobre fondo claro y sobre fondo oscuro sin duplicar archivos.
 *
 * Los SVG de `public/brand/` siguen existiendo para uso externo — papelería,
 * firma de correo, imprenta, Google Business Profile — donde sí hace falta el
 * archivo completo y autónomo.
 */

type Variant = "horizontal" | "compact" | "stacked";

interface BrandLogoProps {
  /** `horizontal`: símbolo + nombre. `compact`: solo símbolo. `stacked`: apilado. */
  variant?: Variant;
  /**
   * `true` cuando el logotipo es el único enlace al inicio y necesita nombre
   * accesible. `false` cuando ya hay texto contiguo que lo nombra, para no
   * duplicar el anuncio en el lector de pantalla.
   */
  decorative?: boolean;
  /** Alto del símbolo en px. El texto escala con él. */
  size?: number;
  className?: string;
}

/**
 * Isotipo. Sin `width`/`height` fijos: la altura la fija el contenedor y el
 * `viewBox` mantiene la proporción, así el símbolo nunca se deforma.
 *
 * El montante y el cuenco heredan `currentColor`; solo el travesaño conserva
 * el rojo de marca, que es la única nota de color que sobrevive a la
 * inversión sobre fondo oscuro.
 */
function Mark({ size, accent = true }: { size: number; accent?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 64"
      height={size}
      width={(size * 80) / 64}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="flex-none"
    >
      {/* Geometría espejo de qa/build-brand.mjs. Si se toca allí, se toca aquí. */}
      <path d="M38 6 L38 21 L17 58 L2 58 Z" fill="currentColor" />
      <path d="M38 6 H50 V58 H38 Z" fill="currentColor" />
      <path d="M27 40 H38 V52 H20 Z" fill={accent ? "#B8452F" : "currentColor"} />
      <path d="M50 6 H76 V40 H50 V28 H64 V18 H50 Z" fill="currentColor" />
    </svg>
  );
}

export default function BrandLogo({
  variant = "horizontal",
  decorative = false,
  size = 28,
  className = "",
}: BrandLogoProps) {
  const accessibleName = `${BRAND.name} — ${BRAND.descriptor}`;

  if (variant === "compact") {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Mark size={size} />
        {decorative ? null : <span className="sr-only">{accessibleName}</span>}
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={`inline-flex flex-col items-center gap-2 ${className}`}>
        <Mark size={size} />
        <span className="flex flex-col items-center leading-none">
          <span className="font-display font-bold tracking-tight" style={{ fontSize: size * 0.52 }}>
            ANDRADE PARRA
          </span>
          <span
            className="mt-1 font-display font-medium tracking-[0.16em]"
            style={{ fontSize: size * 0.3 }}
          >
            CORPORATION
          </span>
          <span
            className="mt-1.5 font-display font-medium tracking-[0.24em] opacity-70"
            style={{ fontSize: size * 0.22 }}
          >
            GENERAL REMODELING
          </span>
        </span>
        {decorative ? null : <span className="sr-only">{accessibleName}</span>}
      </span>
    );
  }

  /*
   * Horizontal. `min-w-0` en el bloque de texto es lo que impide que un nombre
   * de 25 caracteres empuje la navegación fuera de la pantalla: sin él, el
   * flex item usa su ancho de contenido como mínimo y desborda en móvil.
   */
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} />
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className="truncate font-display font-bold tracking-tight"
          style={{ fontSize: size * 0.46 }}
        >
          ANDRADE PARRA{" "}
          <span className="font-medium">CORPORATION</span>
        </span>
        <span
          className="mt-1 truncate font-display font-medium tracking-[0.2em] opacity-70"
          style={{ fontSize: size * 0.24 }}
        >
          GENERAL REMODELING
        </span>
      </span>
      {decorative ? null : <span className="sr-only">{accessibleName}</span>}
    </span>
  );
}
