"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ArrowRight from "./icons/ArrowRight";

/**
 * CTA principal del sitio. Apunta a la página de cotización, no directamente
 * a WhatsApp: el flujo aprobado exige registrar la solicitud ANTES de
 * entregar el control a WhatsApp, y el visitante elige el canal al final.
 */
export default function WhatsAppButton({ className = "" }: { className?: string }) {
  const t = useTranslations("Nav");

  return (
    <Link
      href="/quote"
      className={`inline-flex min-h-[44px] items-center justify-center gap-4 bg-accent px-6 text-sm font-medium text-bone transition-colors hover:bg-accent-hover ${className}`}
    >
      {t("quote")}
      <ArrowRight />
    </Link>
  );
}
