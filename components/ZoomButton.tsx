"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Lightbox from "./Lightbox";

/**
 * Botón de ampliar SUELTO, para cuando la fotografía ya está dentro de un
 * enlace y no puede ser ella misma el disparador.
 *
 * Es el caso de las tarjetas de `/proyectos`: toda la tarjeta es un enlace a
 * la ficha, y ese es el gesto que la gente espera al pulsar la foto. Convertir
 * la imagen en disparador del visor robaría la navegación, y anidar un
 * `<button>` dentro de un `<a>` no es HTML válido — el navegador desanida los
 * elementos y el resultado depende del motor.
 *
 * Así que el botón vive FUERA del enlace, superpuesto a la esquina de la foto:
 * pulsar la tarjeta lleva al proyecto, pulsar la lupa amplía la foto. 44 px de
 * lado, el mínimo táctil de WCAG 2.2, y visible siempre — no solo al pasar el
 * ratón, que en móvil no existe.
 */
export default function ZoomButton({
  src,
  alt,
  orientation,
  className = "",
}: {
  src: string;
  alt: string;
  orientation: "vertical" | "horizontal";
  className?: string;
}) {
  const t = useTranslations("Projects");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    // Devuelve el foco a la lupa, no al principio del documento.
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t("openLightbox")}: ${alt}`}
        className={`flex h-11 w-11 items-center justify-center rounded-full bg-carbon/80 text-bone transition-colors hover:bg-accent ${className}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4.2-4.2M11 8v6M8 11h6" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <Lightbox src={src} alt={alt} orientation={orientation} onClose={close} />
      ) : null}
    </>
  );
}
