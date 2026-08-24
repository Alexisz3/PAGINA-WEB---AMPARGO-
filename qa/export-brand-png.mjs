/**
 * Exporta el logotipo a PNG con fondo transparente.
 *
 * El motor es Chromium vía Playwright, que ya es dependencia del proyecto:
 * rasteriza el SVG con el mismo intérprete que un navegador real y
 * `omitBackground` deja el canal alfa limpio. No hace falta Inkscape ni
 * ImageMagick instalados.
 *
 * Se renderiza a `deviceScaleFactor` alto en vez de escalar el PNG después:
 * ampliar un mapa de bits emborrona los bordes, mientras que rasterizar el
 * vector directamente al tamaño final los mantiene nítidos.
 *
 * Uso: npm run export:brand
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BRAND_DIR = fileURLToPath(new URL("../public/brand", import.meta.url));
const OUT = fileURLToPath(new URL("../public/brand/png", import.meta.url));
mkdirSync(OUT, { recursive: true });

/** [archivo SVG, anchos en px, sufijo] */
const EXPORTS = [
  ["mark-ap.svg", [256, 512, 1024, 2048]],
  ["logo-horizontal.svg", [1024, 2048]],
  ["logo-stacked.svg", [1024, 2048]],
  ["logo-light.svg", [1024, 2048]],
  ["logo-monochrome.svg", [1024, 2048]],
  ["favicon.svg", [180, 512]],
];

const browser = await chromium.launch();
let count = 0;

for (const [file, widths] of EXPORTS) {
  const svg = readFileSync(`${BRAND_DIR}/${file}`, "utf8");
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const [vw, vh] = [Number(vb[1]), Number(vb[2])];

  for (const w of widths) {
    const h = Math.round((w * vh) / vw);
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();

    // El SVG ocupa exactamente el viewport; sin márgenes ni fondo del body.
    await page.setContent(
      `<!doctype html><meta charset="utf-8">
       <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=block">
       <style>
         html,body{margin:0;padding:0;background:transparent}
         svg{display:block;width:${w}px;height:${h}px}
       </style>
       ${svg}`,
      { waitUntil: "networkidle" }
    );
    // Las fuentes del wordmark tardan en resolverse; sin esto se rasteriza
    // la tipografía de reserva y el PNG sale con otra letra.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    const name = file.replace(".svg", "") + `-${w}.png`;
    await page.screenshot({ path: `${OUT}/${name}`, omitBackground: true });
    await ctx.close();
    count++;
  }
}

await browser.close();
console.log(`${count} PNG con transparencia en public/brand/png/`);
