"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import LocaleSwitcher from "./LocaleSwitcher";
import WhatsAppButton from "./WhatsAppButton";
import MobileMenu from "./MobileMenu";

const NAV_LINKS: { href: StaticPathname; key: "services" | "projects" | "process" | "about" | "contact" }[] = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/process", key: "process" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

/**
 * Header único para todo el sitio: transparente sobre el hero de cada página
 * (así se ve en las cuatro referencias aprobadas) y con fondo sólido en
 * cuanto el visitante hace scroll, para seguir siendo legible sobre
 * contenido claro. No es sticky-solid desde el inicio: eso mataría el
 * efecto cinematográfico del hero que las referencias fijan como invariante.
 */
export default function Header() {
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? "bg-carbon/95 backdrop-blur border-b border-bone/10" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <Link href="/" className="flex min-h-[44px] items-center font-display text-lg font-semibold tracking-tight text-bone">
            AMPARGO<span className="text-accent">.</span>
          </Link>

          <nav aria-label={t("menuTitle")} className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center px-3 text-sm text-bone/85 transition-colors hover:text-bone"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <div className="hidden md:block">
              <WhatsAppButton />
            </div>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="-mr-2 flex h-11 w-11 items-center justify-center text-bone lg:hidden"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div id="menu-movil">
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} triggerRef={triggerRef} />
      </div>
    </>
  );
}
