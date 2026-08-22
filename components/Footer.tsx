import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";

const LINKS: { href: StaticPathname; key: "services" | "projects" | "process" | "about" | "contact" }[] = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/process", key: "process" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export default async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="grid gap-10 border-b border-line pb-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="font-display text-lg font-semibold text-ink">
              AMPARGO<span className="text-accent">.</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-muted">{t("tagline")}</p>
          </div>

          <nav aria-label={t("linksHeading")}>
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
              {t("linksHeading")}
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              {LINKS.map((l) => (
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
