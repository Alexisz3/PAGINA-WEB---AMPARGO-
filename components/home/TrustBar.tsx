import { getTranslations } from "next-intl/server";
import { TRUST_SIGNALS } from "@/content/company";

/**
 * Franja de confianza bajo el hero.
 *
 * Cada afirmación es verificable HOY, sin depender de datos que el cliente no
 * ha confirmado:
 *
 *   · zona de servicio  — declarada por el cliente en el formulario (Q4)
 *   · residencial y comercial — marcado por el cliente en Q15
 *   · presupuesto sin costo   — cierto: el formulario de cotización es gratuito
 *   · inglés y español        — comprobable en este mismo sitio
 *
 * Lo que NO aparece, y no debe aparecer sin documento firmado: años de
 * experiencia, número de obras, licencia, seguro, premios o garantías. Son
 * exactamente las cifras que un propietario podría verificar y que, si no
 * cuadran, destruyen la confianza que esta franja pretende construir.
 *
 * Sin iconos: cuatro pictogramas genéricos delatan plantilla. El filete
 * vertical basta para separar y mantiene el tono sobrio.
 */
export default async function TrustBar() {
  const t = await getTranslations("Home");

  const LABELS: Record<(typeof TRUST_SIGNALS)[number], string> = {
    serviceArea: t("trustServiceArea"),
    residentialCommercial: t("trustResidentialCommercial"),
    freeEstimates: t("trustFreeEstimates"),
    bilingual: t("trustBilingual"),
  };

  return (
    <section className="border-y border-line bg-surface" aria-label={t("trustServiceArea")}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/*
          Móvil: cuadrícula 2×2 — cuatro elementos en fila obligan a un tamaño
          de letra ilegible a 320px. Escritorio: fila única con separadores.
        */}
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {TRUST_SIGNALS.map((signal, i) => (
            <li
              key={signal}
              className={`flex min-h-[64px] items-center justify-center px-3 py-4 text-center font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted lg:min-h-[72px] lg:text-xs ${
                // El filete separa, no encierra: solo entre elementos.
                i % 2 === 1 ? "border-l border-line" : ""
              } ${i >= 2 ? "border-t border-line" : ""} lg:border-t-0 ${
                i > 0 ? "lg:border-l lg:border-line" : "lg:border-l-0"
              }`}
            >
              <span className="text-balance">{LABELS[signal]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
