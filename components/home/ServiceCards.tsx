import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const CARDS = ["custom", "remodeling", "kitchensBaths", "outdoor", "repairs"] as const;

/**
 * Banda de tarjetas oscuras que en escritorio monta sobre el borde inferior
 * del hero (referencia aprobada). En móvil se apila en carril horizontal
 * desplazable para no generar cinco pantallas de scroll.
 */
export default async function ServiceCards() {
  const t = await getTranslations("ServiceCards");

  return (
    <section className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <ul className="-mt-16 grid gap-px overflow-hidden bg-bone/10 sm:grid-cols-2 lg:-mt-24 lg:grid-cols-5">
          {CARDS.map((key) => (
            <li key={key} className="bg-carbon">
              <Link
                href="/services"
                className="group flex h-full min-h-[190px] flex-col justify-between p-6 transition-colors hover:bg-carbon-raised"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight text-bone">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/70">{t(`${key}.description`)}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors group-hover:border-accent group-hover:bg-accent"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
