import { getTranslations } from "next-intl/server";
import { SERVICE_AREA } from "@/content/company";
import { BUSINESS, BRAND } from "@/lib/site";

/**
 * Zona de servicio y sede.
 *
 * Por qué NO hay un `<iframe>` de Google Maps: pesa cerca de 700 KB, instala
 * cookies de terceros en cuanto la página carga (con lo que arrastra al sitio
 * al terreno del consentimiento de cookies) y hunde la métrica de velocidad —
 * todo para responder algo que un mapa contesta mal. Quien busca un contratista
 * no quiere ver un plano de la ciudad: quiere saber si trabajan en su zona y,
 * si acaso, cómo llegar.
 *
 * Eso se resuelve con texto y un enlace: "cómo llegar" abre Google Maps en la
 * app nativa del teléfono, que es donde el usuario realmente quiere navegar,
 * con cero coste para quien no lo pulsa.
 *
 * La dirección aparece solo si `hasPublicOffice` es cierto. La lista de
 * municipios, solo si el cliente confirmó cuáles cubre.
 */
export default async function ServiceArea() {
  const tc = await getTranslations("Contact");

  const fullAddress = `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`;
  // Formato universal: lo entienden Google Maps web, Android e iOS.
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${BRAND.name}, ${fullAddress}`
  )}`;

  return (
    <section className="border-t border-line bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* ── Cobertura ── */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {tc("addressLabel")}
            </h2>
            <p className="mt-4 text-balance font-display text-2xl font-semibold leading-tight text-ink">
              {tc("address")}
            </p>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted">
              {tc("serviceAreaHelp")}
            </p>

            {SERVICE_AREA.nearbyAreas.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
                {SERVICE_AREA.nearbyAreas.map((area) => (
                  <li
                    key={area}
                    className="border border-line bg-paper px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Invitación a preguntar: convierte una zona no listada en una
                conversación, en vez de en un visitante que se va. */}
            <p className="mt-6 border-t border-line pt-6 text-sm text-muted">
              {tc("areaAsk")}
            </p>
          </div>

          {/* ── Sede: solo con local que recibe clientes ── */}
          {SERVICE_AREA.hasPublicOffice ? (
            <div className="lg:border-l lg:border-line lg:pl-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                {tc("officeLabel")}
              </h2>
              <address className="mt-4 not-italic leading-relaxed text-ink">
                {BUSINESS.streetAddress}
                <br />
                {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
              </address>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[48px] items-center gap-2 border border-ink px-5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                {tc("directions")}
                <span aria-hidden="true">↗</span>
              </a>
              <p className="mt-4 text-sm text-muted">{tc("visitNote")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
