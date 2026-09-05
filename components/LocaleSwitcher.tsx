"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { routing, LOCALE_CODES, type AppLocale } from "@/i18n/routing";
import { resolveLocalizedDestination } from "@/i18n/localized-destination";

/**
 * Filete de bandera en miniatura — NO una bandera realista.
 *
 * Una sesión de auditoría posterior la reemplazó por banderas de España y
 * EE. UU. con estrellas y franjas, sin ver `FlagRule.tsx`: en la papelería
 * de un contratista sin licencia ni seguro confirmados por escrito, un
 * emblema con estrellas y barras se lee como acreditación oficial. Además
 * España no representa el español de Houston (`es-US`, no `es-ES`). Mismo
 * patrón reducido para ambos idiomas — no hay una bandera de país distinta
 * que poner sin mentir sobre el origen.
 */
function MiniFlag() {
  return (
    <span className="flex h-3 w-4 overflow-hidden rounded-[2px]" aria-hidden="true">
      <span className="h-full w-[38%] bg-[#1B2A4A]" />
      <span className="h-full flex-1 bg-accent-ink" />
    </span>
  );
}

/**
 * Cambia de idioma traduciendo el LUGAR actual, no volviendo al inicio.
 *
 * Preserva: la página equivalente, la misma entidad dinámica (con su slug
 * traducido), los filtros de la query string y el hash. La lógica vive en
 * `i18n/localized-destination.ts`; aquí solo se navega.
 *
 * Fase 5: pasa de dos botones ES|EN en línea a un desplegable con disparador
 * (bandera + código) y una lista de opciones (bandera + nombre completo),
 * pedido explícitamente en el rediseño visual.
 */
export default function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // `usePathname()` devuelve el PATRÓN (`/projects/[slug]`), no la ruta
  // resuelta: el slug real hay que sacarlo de los params de la ruta.
  const routeParams = useParams();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (open) {
      containerRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    }
  }, [open]);

  // Cierra al hacer clic fuera del componente.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Escape cierra y devuelve el foco al disparador — mismo patrón que
  // `MobileMenu`, a la escala de un menú de dos opciones.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const switchTo = (target: AppLocale) => {
    setOpen(false);
    triggerRef.current?.focus();
    if (target === locale) return;

    const rawSlug = routeParams?.slug;
    const currentSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const dest = resolveLocalizedDestination(
      pathname,
      locale,
      target,
      new URLSearchParams(searchParams.toString()),
      hash,
      currentSlug
    );

    // Sin equivalente en el idioma destino: se deja al visitante donde está
    // en vez de mandarlo al inicio sin avisar o construir un slug que da 404.
    if (dest.kind === "unavailable") return;

    const options = { locale: target, scroll: false } as const;

    if (dest.kind === "dynamic") {
      router.replace(
        { pathname: dest.pathname, params: { slug: dest.slug }, query: dest.query },
        options
      );
    } else {
      router.replace(
        // El pathname viene de `usePathname()`, así que ya es una ruta válida
        // del registro; el tipo genérico de `replace` no puede inferirlo.
        { pathname: dest.pathname as "/", query: dest.query },
        options
      );
    }

    // El hash no viaja en el router tipado; se reaplica tras navegar.
    if (dest.hash && typeof window !== "undefined") {
      window.setTimeout(() => {
        window.location.hash = dest.hash;
      }, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (!open || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
        const current = options.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        options[next]?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={t("languageSwitcherLabel")}
        className="flex min-h-[44px] items-center gap-2 border border-bone/30 px-3 font-mono text-xs uppercase tracking-wider text-bone transition-colors hover:border-bone/55 hover:bg-bone/10"
      >
        <MiniFlag />
        {LOCALE_CODES[locale].toUpperCase()}
        {/* Chevron: gira al abrir, puramente decorativo. */}
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={t("languageSwitcherLabel")}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[9rem] overflow-hidden border border-bone/20 bg-carbon-raised shadow-lg"
        >
          {routing.locales.map((l) => {
            const isCurrent = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={isCurrent}
                onClick={() => switchTo(l)}
                className={`flex min-h-[44px] w-full items-center gap-3 px-4 text-left text-sm transition-colors ${
                  isCurrent ? "bg-bone/10 text-bone" : "text-bone/85 hover:bg-bone/10"
                }`}
              >
                <MiniFlag />
                {l === "es-US" ? "Español" : "English"}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
