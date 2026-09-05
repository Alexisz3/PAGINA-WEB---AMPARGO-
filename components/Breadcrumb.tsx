import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";

interface Crumb {
  label: string;
  /** Sin href = elemento actual, no enlazable. */
  href?: StaticPathname;
}

/**
 * Migas de pan. `<nav>` con lista ordenada y `aria-current="page"` en el
 * último elemento: el orden y la posición actual los comunica la semántica,
 * no solo el separador visual.
 */
export default async function Breadcrumb({
  items,
  theme = "light",
}: {
  items: Crumb[];
  theme?: "light" | "dark";
}) {
  const t = await getTranslations("Nav");
  const isDark = theme === "dark";

  return (
    <nav aria-label={t("breadcrumb")}>
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.08em] ${
          isDark ? "text-bone/55" : "text-muted"
        }`}
      >
        <li>
          <Link
            href="/"
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors ${
              isDark ? "hover:text-bone" : "hover:text-accent"
            }`}
          >
            {t("home")}
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`inline-flex min-h-[44px] items-center transition-colors ${
                    isDark ? "hover:text-bone" : "hover:text-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className={isDark ? "text-bone/85" : "text-ink"}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
