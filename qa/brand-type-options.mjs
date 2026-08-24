/**
 * Hoja comparativa de las tres voces tipográficas del nombre.
 *
 * El símbolo es idéntico en las tres: lo único que cambia es la letra. Sirve
 * para que el cliente elija viendo, no describiendo.
 *
 * Reutiliza la geometría de build-brand.mjs en vez de copiarla: si el símbolo
 * cambia, la comparativa cambia con él.
 *
 * Uso: npm run brand:options
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { TYPE_OPTIONS, mark, place, flagRule, NAVY, BRICK, STEEL } from "./build-brand.mjs";

const OUT = fileURLToPath(new URL("../public/brand/opciones", import.meta.url));
mkdirSync(OUT, { recursive: true });

/*
 * Bloqueo horizontal con la tipografía indicada.
 *
 * El viewBox va holgado (760) porque las serifs son bastante más anchas que
 * la grotesca al mismo cuerpo: con 500 unidades, "CORPORATION" se salía en las
 * opciones B y C. El cuerpo se mantiene idéntico en las tres a propósito —
 * ajustarlo por opción falsearía la comparación, que trata justamente de ver
 * cuánto espacio pide cada letra.
 */
function lockup(opt) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 84" width="760" height="84" class="lockup">
    ${mark({ body: NAVY, accent: BRICK, transform: place(48, 8, 12) })}
    <text x="106" y="42" font-family="${opt.family}" font-size="26"
          font-weight="${opt.nameWeight}" letter-spacing="${opt.nameTracking}" fill="${NAVY}">ANDRADE PARRA <tspan font-weight="${opt.corpWeight}">CORPORATION</tspan></text>
    ${flagRule(106, 52, 120, 3)}
    <text x="106" y="72" font-family="${opt.family}" font-size="11"
          font-weight="500" letter-spacing="0.24em" fill="${STEEL}">GENERAL REMODELING</text>
  </svg>`;
}

const families = Object.values(TYPE_OPTIONS)
  .map((o) => `family=${o.google}`)
  .join("&");

const page = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families}&display=block">
<style>
  body{margin:0;background:#F2EFE8;font:13px system-ui;color:#1B2A4A}
  .opt{padding:26px 34px;border-bottom:1px solid rgba(27,42,74,.14)}
  .opt:last-child{border-bottom:none}
  h3{margin:0 0 4px;font:600 11px ui-monospace;letter-spacing:.16em;text-transform:uppercase;color:#B8452F}
  p{margin:0 0 16px;font-size:12px;color:#5A6472}
  svg{display:block;max-width:100%;height:auto}
</style>
${Object.entries(TYPE_OPTIONS)
  .map(
    ([key, opt], i) => `<div class="opt">
      <h3>Opción ${String.fromCharCode(65 + i)} · ${key}</h3>
      <p>${opt.label}</p>
      ${lockup(opt)}
    </div>`
  )
  .join("")}`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 580, height: 480 }, deviceScaleFactor: 3 });
await p.setContent(page, { waitUntil: "networkidle" });
// Sin esto se rasteriza la tipografía de reserva y la comparación no vale.
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);

/*
 * Se mide la extensión REAL del texto, no se confía en `document.fonts.check`:
 * con fuentes variables devuelve `false` aunque la familia esté cargada y
 * pintando. Si el nombre rebasa el viewBox, "CORPORATION" sale cortada y la
 * comparativa engaña al cliente.
 */
const extents = await p.evaluate(() =>
  [...document.querySelectorAll("svg.lockup")].map((svg) => {
    const vw = Number(svg.getAttribute("viewBox").split(" ")[2]);
    const t = svg.querySelector("text");
    const end = t.getBBox().x + t.getBBox().width;
    return { vw, end: Math.round(end), cortado: end > vw };
  })
);
extents.forEach((e, i) =>
  console.log(
    `  opción ${String.fromCharCode(65 + i)}: el nombre llega a ${e.end} de ${e.vw} · ${e.cortado ? "CORTADO" : "cabe"}`
  )
);
if (extents.some((e) => e.cortado)) {
  console.error("\nHay bloqueos cortados: amplíe el viewBox antes de enseñar esto.");
  process.exitCode = 1;
}

await p.screenshot({ path: `${OUT}/comparativa-tipografias.png`, fullPage: true });
await b.close();
console.log("comparativa en public/brand/opciones/");
