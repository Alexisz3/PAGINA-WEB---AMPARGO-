import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname, AppLocale } from "@/i18n/routing";
import { SERVICES } from "@/content/services";
import { WHATSAPP_CONTACTS, BUSINESS_EMAIL } from "@/lib/site";

const COMPANY_LINKS: {
  href: StaticPathname;
  key: "about" | "projects" | "process" | "contact";
}[] = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/process", key: "process" },
  { href: "/contact", key: "contact" },
];

/**
 * Pie corporativo.
 *
 * Antes era una sola fila de cinco enlaces. Ahora agrupa por intención —
 * servicios, empresa, contacto — que es como un visitante busca al final de
 * la página: o quiere un servicio concreto, o quiere saber quién es la
 * empresa, o quiere llamar.
 *
 * El correo solo aparece si existe de verdad. El año es dinámico: un pie con
 * el año congelado es la señal más barata de que un sitio está abandonado.
 */
export default async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Contact");
  const locale = (await getLocale()) as AppLocale;
  const year = new Date().getFullYear();

  const services = SERVICES.filter((s) => s.published);

  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid gap-10 border-b border-line pb-8 sm:grid-cols-2 lg:grid-cols-4 lg:pb-12">
          {/* ── Marca ── */}
          <div>
            <span className="font-display text-lg font-semibold text-ink">
              AMPARGO<span className="text-accent">.</span>
            </span>
            <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-muted">
              {t("tagline")}
            </p>
          </div>

          {/* ── Servicios ── */}
          <nav aria-label={t("servicesHeading")}>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("servicesHeading")}
            </h2>
            <ul className="mt-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={{ pathname: "/services/[slug]", params: { slug: s.slugs[locale] } }}
                    className="flex min-h-[44px] items-center text-sm text-ink transition-colors hover:text-accent"
                  >
                    {s.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Empresa ── */}
          <nav aria-label={t("companyHeading")}>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("companyHeading")}
            </h2>
            <ul className="mt-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[44px] items-center text-sm text-ink transition-colors hover:text-accent"
                  >
                    {tn(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Contacto ── */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("contactHeading")}
            </h2>
            <ul className="mt-3">
              {WHATSAPP_CONTACTS.map((c) => (
                <li key={c.phone}>
                  <a
                    href={`tel:+${c.phone}`}
                    className="flex min-h-[44px] items-center font-mono text-sm text-ink transition-colors hover:text-accent"
                  >
                    {c.phoneDisplay}
                  </a>
                </li>
              ))}
              {BUSINESS_EMAIL ? (
                <li>
                  <a
                    href={`mailto:${BUSINESS_EMAIL}`}
                    className="flex min-h-[44px] items-center text-sm text-ink transition-colors hover:text-accent"
                  >
                    {BUSINESS_EMAIL}
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="mt-2 text-sm text-muted">{tc("address")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="font-mono text-xs text-muted">
            &copy; {year} AMPARGO. {t("rights")}
          </p>
          {/*
            Los enlaces legales existen como rutas pero permanecen fuera de la
            navegación pública hasta que el contenido sea revisado por el
            cliente. Ver AUDITORIA_Y_PLAN_AMPARGO.md §13.
          */}
        </div>
      </div>
    </footer>
  );
}
