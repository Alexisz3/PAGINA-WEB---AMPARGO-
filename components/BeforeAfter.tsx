"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { BeforeAfterPair } from "@/content/before-after";

interface BeforeAfterProps {
  pair: BeforeAfterPair;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
}

/**
 * Comparador antes/después.
 *
 * El control es un `input[type=range]` real, no un div con eventos de puntero:
 * así funciona de fábrica con ratón, gesto táctil, teclado (flechas, Home, End)
 * y lectores de pantalla, y no interfiere con el scroll vertical de la página.
 * Sin JavaScript se ve la foto «después» completa, que es el estado útil.
 */
export default function BeforeAfter({
  pair,
  beforeLabel,
  afterLabel,
  sliderLabel,
}: BeforeAfterProps) {
  const [position, setPosition] = useState(pair.initialPosition);
  const sliderId = useId();

  return (
    <figure className="w-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-steel/50">
        <Image
          src={`/images/proyectos/${pair.afterFile}`}
          alt={pair.afterAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 560px, 100vw"
        />

        {/* La foto «antes» se recorta según la posición del divisor. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={`/images/proyectos/${pair.beforeFile}`}
            alt={pair.beforeAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 560px, 100vw"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-redline"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        />

        <span className="pointer-events-none absolute left-3 top-3 bg-ink/85 px-2 py-1 font-mono text-xs uppercase tracking-wider text-bone">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 bg-ink/85 px-2 py-1 font-mono text-xs uppercase tracking-wider text-bone">
          {afterLabel}
        </span>
      </div>

      <label htmlFor={sliderId} className="sr-only">
        {sliderLabel}
      </label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        // Área táctil de 44px y acento visible en ambos temas.
        className="mt-3 h-11 w-full cursor-ew-resize accent-redline"
        aria-valuetext={`${position}%`}
      />

      <figcaption className="mt-1 font-mono text-xs text-graphite">{pair.project}</figcaption>
    </figure>
  );
}
