import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/**
 * Inyecta Google Analytics 4 solo cuando existe un ID válido configurado.
 *
 * Sin `NEXT_PUBLIC_GA_MEASUREMENT_ID` este componente devuelve `null`: no hay
 * script, no hay peticiones a Google y no hay cookies. Esto importa por tres
 * motivos: el sitio no carga 40 KB de JavaScript inútil mientras no haya
 * analítica, el desarrollo no ensucia los informes de producción, y no se
 * instalan cookies de terceros sin que exista una propiedad real detrás.
 *
 * `strategy="afterInteractive"` deja que el contenido pinte primero: la
 * analítica no debe competir con el LCP por ancho de banda.
 */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
