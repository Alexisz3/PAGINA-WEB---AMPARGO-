import type { MetadataRoute } from "next";
import { SITE_URL, INDEXABLE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Sin dominio definitivo se bloquea todo rastreo: evita que una URL
  // provisional se posicione y luego compita con el dominio real.
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
