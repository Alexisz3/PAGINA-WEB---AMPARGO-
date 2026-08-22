import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WHATSAPP_CONTACTS, BUSINESS_EMAIL } from "@/lib/site";

/**
 * Banda oscura de cierre, presente en todas las páginas.
 *
 * Muestra únicamente datos confirmados: los dos teléfonos reales y el área de
 * servicio. El correo empresarial NO existe todavía, así que en lugar de
 * inventar uno (los mockups mostraban "info@ampargo.com", que es ficticio)
 * se declara honestamente su estado.
 */
export default async function CtaBand() {
  const t = await getTranslations("Home");
  const tc = await getTranslations("Contact");

  return (
    <section className="bg-carbon text-bone">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <span className="eyebrow text-accent-ink">{t("ctaBandEyebrow")}</span>
          <h2 className="mt-5 max-w-lg text-balance font-display font-semibold leading-tight [font-size:clamp(1.75rem,3.4vw,2.75rem)]">
            {t("ctaBandHeading")}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-bone/75">{t("ctaBandBody")}</p>
          <Link
            href="/quote"
            className="mt-8 inline-flex min-h-[52px] items-center gap-2 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover"
          >
            {t("heroCtaPrimary")}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <dl className="space-y-6 self-center">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-bone/55">
              {tc("callLabel")}
            </dt>
            <dd className="mt-2 space-y-1">
              {WHATSAPP_CONTACTS.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:+${c.phone}`}
                  className="flex min-h-[44px] items-center gap-3 text-lg transition-colors hover:text-accent-ink"
                >
                  <span className="font-mono">{c.phoneDisplay}</span>
                  <span className="text-sm text-bone/60">{c.name}</span>
                </a>
              ))}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-bone/55">
              {tc("emailLabel")}
            </dt>
            <dd className="mt-2 text-bone/60">
              {BUSINESS_EMAIL ?? tc("emailPending")}
            </dd>
          </div>

          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-bone/55">
              {tc("addressLabel")}
            </dt>
            <dd className="mt-2 text-lg">{tc("address")}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
