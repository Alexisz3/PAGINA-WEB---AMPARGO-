/**
 * Pruebas de resolución de SITE_URL. Sin runner externo: node puro.
 * Uso: npm run check:env
 *
 * Existe porque un `NEXT_PUBLIC_SITE_URL=""` en el panel de Vercel rompía el
 * prerender con `ERR_INVALID_URL` y el fallo solo aparecía en el deploy.
 */
import assert from "node:assert/strict";
import { parseHttpOrigin } from "../lib/site.ts";

const cases = [
  // [valor, opciones, esperado, descripción]
  [undefined, {}, null, "ausente"],
  ["", {}, null, "cadena vacía (el caso que rompía Vercel)"],
  ["   ", {}, null, "solo espacios"],
  ["https://ampargo.com", {}, "https://ampargo.com", "https válido"],
  ["https://ampargo.com/", {}, "https://ampargo.com", "normaliza la barra final"],
  ["https://ampargo.com/ruta", {}, "https://ampargo.com", "descarta la ruta, deja el origen"],
  ["  https://ampargo.com  ", {}, "https://ampargo.com", "recorta espacios"],
  ["http://localhost:3000", {}, "http://localhost:3000", "http local válido"],
  ["javascript:alert(1)", {}, null, "protocolo peligroso rechazado"],
  ["file:///etc/passwd", {}, null, "protocolo file rechazado"],
  ["/ruta/relativa", {}, null, "ruta relativa rechazada"],
  ["ampargo.com", {}, null, "dominio sin protocolo escrito a mano: rechazado"],
  ["ampargo.com", { allowProtocolLess: true }, "https://ampargo.com", "host de Vercel: asume https"],
  ["foo.vercel.app", { allowProtocolLess: true }, "https://foo.vercel.app", "VERCEL_URL típica"],
  ["", { allowProtocolLess: true }, null, "vacía incluso permitiendo sin protocolo"],
  ["no es una url", { allowProtocolLess: true }, null, "texto con espacios rechazado"],
];

let failed = 0;
for (const [value, opts, expected, label] of cases) {
  const actual = parseHttpOrigin(value, opts);
  try {
    assert.equal(actual, expected);
    console.log(`OK    ${label} — ${JSON.stringify(value)} → ${JSON.stringify(actual)}`);
  } catch {
    failed++;
    console.log(
      `FALLA ${label} — ${JSON.stringify(value)} → esperado ${JSON.stringify(expected)}, ` +
        `obtenido ${JSON.stringify(actual)}`
    );
  }
}

console.log(`\n${cases.length - failed}/${cases.length} casos superados`);
if (failed) process.exit(1);
