"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { BRAND } from "@/lib/site";
import BrandLogo from "./BrandLogo";
import FlagRule from "./FlagRule";
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
        {/*
          Velo degradado sobre el hero transparente.

          Sin él, los enlaces caían directamente sobre la fotografía y el
          contraste medido era de 1,95:1 en "Contacto" y 1,46:1 en el selector
          de idioma — muy por debajo del 4,5:1 que exige WCAG AA para texto
          normal. Y no lo detectaba nada: `qa:axe` da cero violaciones porque
          axe NO evalúa contraste contra una imagen de fondo, lo marca como
          "incompleto". El fallo estaba a la vista de todos en la portada.

          Por qué un degradado y no un fondo sólido: la cabecera transparente
          sobre el hero es un invariante de las referencias aprobadas. Un
          rectángulo opaco lo rompería; un velo que se desvanece hacia abajo
          mantiene la fotografía visible y el gesto intacto, y solo oscurece la
          banda donde de verdad hay texto.

          Va detrás del contenido (`-z-10`) y no intercepta el puntero, para no
          robarle el clic a ningún enlace.
        */}
        {solid ? null : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180%] bg-gradient-to-b from-carbon/90 via-carbon/70 to-transparent"
          />
        )}
        {/*
          El filete de bandera vive DENTRO de la cabecera fija, no al principio
          del body: fuera de ella se iría con el scroll en la primera pasada y
          no volvería a verse nunca.

          Se mantiene sobre el hero transparente a propósito — son dos colores
          macizos que aguantan cualquier fotografía debajo.
        */}
        <FlagRule />

        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 lg:px-10">
          {/*
            El nombre nuevo es mucho más largo que el anterior, así que el
            enlace lleva `min-w-0`: sin él, el logotipo usa su ancho de
            contenido como mínimo de flex y empuja la navegación fuera de la
            pantalla en móvil. Por debajo de `sm` se muestra solo el isotipo.
          */}
          {/*
            `min-w-[44px]` y no `min-w-0`: en móvil solo se ve el isotipo, que
            mide 33 px de ancho, y el enlace se ajustaba a él — cumplía el alto
            táctil de 44 px pero no el ancho. El encogimiento del texto largo lo
            resuelve el `min-w-0` del <span> interior, no el enlace.
          */}
          <Link
            href="/"
            className="flex min-h-[44px] min-w-[44px] items-center text-bone"
            aria-label={`${BRAND.name} — ${BRAND.descriptor}`}
          >
            {/*
              Solo el isotipo, en todas las anchuras. El nombre completo no se
              pierde: lo lleva el `aria-label` del enlace para quien navega con
              lector de pantalla, y aparece en el hero, el pie y el <title>.
            */}
            <BrandLogo variant="compact" size={30} decorative />
          </Link>

          <nav aria-label={t("menuTitle")} className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                /* Sin `/85`: rebajar la opacidad del texto sobre una foto es
                   restar contraste justo donde ya faltaba. El matiz de "no
                   activo" lo da ahora el velo, no un texto más apagado. */
                className="flex min-h-[44px] items-center px-3 text-sm text-bone transition-colors hover:text-accent-ink"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/*
              `LocaleSwitcher` lee `useSearchParams()` para conservar los
              filtros al cambiar de idioma; eso obliga a un límite de Suspense
              para que el resto de la página siga prerenderizándose estática.
              El fallback reserva el mismo tamaño y evita salto de layout.
            */}
            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="h-11 w-[6.5rem] rounded-full border border-bone/30"
                />
              }
            >
              <LocaleSwitcher />
            </Suspense>
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
