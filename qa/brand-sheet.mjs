/**
 * Hoja de prueba del logotipo: las tres variantes, sobre los dos fondos de
 * marca, a los tres tamaños que se usan de verdad en el sitio.
 * Uso: npm run sheet:brand · Salida: qa/shots/logo-sheet.png
 *
 * `npm run check:brand` mide las contraformas y falla si se cierran, pero un
 * número no dice si el conjunto LEE bien: si la P se separa de la A, si el
 * acento pesa demasiado o si el nombre compite con el símbolo. Eso hay que
 * mirarlo, y esta hoja es lo que se mira.
 *
 * El bloqueo se compone aquí con las mismas proporciones que
 * `components/BrandLogo.tsx` (0,46 / 0,24 del alto del símbolo en horizontal;
 * 0,52 / 0,30 / 0,22 en apilado), de modo que lo que se ve es lo que el sitio
 * sirve. El símbolo sale de `qa/build-brand.mjs`, la fuente única.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mark, NAVY, BRICK } from "./build-brand.mjs";

const OUT = fileURLToPath(new URL("./shots", import.meta.url));
mkdirSync(OUT, { recursive: true });

const IVORY = "#F2EFE8";
const CARBON = "#121412";

/** Los tres tamaños reales: pie, cabecera y menú móvil / favicon. */
const SIZES = [56, 32, 20];
const VARIANTS = ["horizontal", "compact", "stacked"];

const markSvg = (size, color) =>
  `<svg viewBox="0 0 80 64" height="${size}" width="${(size * 80) / 64}">${mark({
    body: color,
    accent: BRICK,
  })}</svg>`;

function lockup(size, color, variant) {
  const m = markSvg(size, color);
  const base = `font-family:'Space Grotesk',Arial,sans-serif;color:${color};line-height:1;display:block`;

  if (variant === "compact") return `<span style="display:inline-flex">${m}</span>`;

  if (variant === "stacked") {
    return `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:8px">${m}
      <span><span style="${base};font-weight:700;font-size:${size * 0.52}px;letter-spacing:-.02em">ANDRADE PARRA</span>
      <span style="${base};font-weight:500;font-size:${size * 0.3}px;letter-spacing:.16em;margin-top:4px">CORPORATION</span>
      <span style="${base};font-weight:500;font-size:${size * 0.22}px;letter-spacing:.24em;opacity:.7;margin-top:6px">GENERAL REMODELING</span></span></span>`;
  }

  return `<span style="display:inline-flex;align-items:center;gap:10px">${m}
    <span><span style="${base};font-weight:700;font-size:${size * 0.46}px;letter-spacing:-.02em">ANDRADE PARRA <span style="font-weight:500">CORPORATION</span></span>
    <span style="${base};font-weight:500;font-size:${size * 0.24}px;letter-spacing:.2em;opacity:.7;margin-top:4px">GENERAL REMODELING</span></span></span>`;
}

const label = (color) =>
  `font:600 10px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:${color};opacity:.55`;

function panel(bg, color, title) {
  return `<div style="background:${bg};padding:26px 32px">
    <div style="${label(color)};margin-bottom:18px">${title}</div>
    ${VARIANTS.map(
      (v) => `<div style="margin-bottom:26px">
        <div style="${label(color)};margin-bottom:10px">${v}</div>
        <div style="display:flex;align-items:flex-end;gap:44px;flex-wrap:wrap">
          ${SIZES.map(
            (s) => `<div>
              <div style="font:10px ui-monospace,monospace;color:${color};opacity:.45;margin-bottom:6px">${s} px</div>
              ${lockup(s, color, v)}
            </div>`
          ).join("")}
        </div>
      </div>`
    ).join("")}
  </div>`;
}

/* Lupa del isotipo suelto: aquí es donde se ve si las contraformas cierran. */
function zoom(bg, color) {
  const cells = [24, 20, 16]
    .map(
      (s) => `<td style="padding:0 20px;vertical-align:bottom">
        <div style="font:10px ui-monospace,monospace;color:${color};opacity:.45;margin-bottom:6px">${s} px · ×8</div>
        <div style="width:${((s * 80) / 64) * 8}px;height:${s * 8}px;overflow:hidden">
          <div style="image-rendering:pixelated;transform:scale(8);transform-origin:top left">${markSvg(s, color)}</div>
        </div>
      </td>`
    )
    .join("");
  return `<div style="background:${bg};padding:24px 32px">
    <div style="${label(color)};margin-bottom:16px">isotipo ampliado sin suavizado</div>
    <table style="border-collapse:collapse"><tr>${cells}</tr></table>
  </div>`;
}

const html = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=block">
<style>body{margin:0}</style>
${panel(IVORY, NAVY, "sobre marfil #F2EFE8")}
${panel(CARBON, IVORY, "sobre carbón #121412")}
${zoom(IVORY, NAVY)}
${zoom(CARBON, IVORY)}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: "networkidle" });
// Sin esperar a la fuente se rasteriza la de reserva y el nombre sale con otra
// letra que la del sitio, que es justo lo que la hoja debe dejar comprobar.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/logo-sheet.png`, fullPage: true });
await browser.close();

console.log(`qa/shots/logo-sheet.png — 3 variantes × 2 fondos × ${SIZES.join("/")} px`);
