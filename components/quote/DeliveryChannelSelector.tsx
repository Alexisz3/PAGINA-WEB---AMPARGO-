"use client";

import { useTranslations } from "next-intl";

export type Channel = "email" | "whatsapp";

/**
 * El visitante elige EXACTAMENTE UN canal. No existe opción "ambos":
 * es una decisión de negocio ya confirmada por el cliente.
 *
 * Se implementa con radios nativos dentro de un fieldset/legend: así la
 * exclusividad mutua, la navegación por teclado y el anuncio por lector de
 * pantalla funcionan sin ARIA añadido.
 */
export default function DeliveryChannelSelector({
  value,
  onChange,
  emailAvailable,
}: {
  value: Channel | null;
  onChange: (c: Channel) => void;
  /** Falso cuando `BUSINESS_EMAIL` es `null`: sin correo empresarial, el
   *  canal de correo no puede entregar nada y se deshabilita en vez de
   *  ofrecer una opción rota. Mismo criterio que `emailUnavailable` en
   *  `QuoteShell`. */
  emailAvailable: boolean;
}) {
  const t = useTranslations("Quote");
  const options: { id: Channel; label: string; disabled?: boolean }[] = [
    { id: "email", label: t("channelEmail"), disabled: !emailAvailable },
    { id: "whatsapp", label: t("channelWhatsapp") },
  ];

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{t("channelLabel")}</legend>
      <p className="mb-3 text-sm text-muted">{t("channelHint")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex min-h-[56px] items-center justify-between gap-3 border px-4 transition-colors ${
                opt.disabled
                  ? "cursor-not-allowed border-line opacity-50"
                  : "cursor-pointer " + (checked ? "border-accent bg-surface" : "border-line hover:border-ink")
              }`}
            >
              <span className="flex items-center gap-3 text-sm text-ink">
                {/* El estado no se comunica solo con color: el radio nativo
                    es visible y además el borde cambia. */}
                <input
                  type="radio"
                  name="channel"
                  value={opt.id}
                  checked={checked}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.id)}
                  className="h-5 w-5 accent-accent"
                />
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
