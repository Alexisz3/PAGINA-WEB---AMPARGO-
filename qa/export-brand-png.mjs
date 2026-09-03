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
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

/* ─── Iconos que el navegador pide por convención ────────────────────────
 *
 * `app/icon.svg` cubre a los navegadores modernos, pero no a todo el mundo:
 * muchos clientes —y varios agregadores y previsualizadores de enlaces— piden
 * `/favicon.ico` a pelo, sin mirar el HTML. Sin ese archivo el sitio devolvía
 * 404 en cada carga; era el único error de consola de todo el recorrido.
 *
 * `apple-icon.png` es el equivalente para iOS al guardar en pantalla de
 * inicio: sin él, Safari recorta una miniatura de la propia página.
 *
 * Los dos se generan aquí, del mismo vector que el resto de la marca, para
 * que no se conviertan en copias a mano que se quedan con el símbolo viejo.
 */
const APP = fileURLToPath(new URL("..", import.meta.url)) + "app";

/**
 * Empaqueta varios PNG en un único .ico.
 *
 * El formato ICO admite PNG embebido desde Windows Vista, así que no hace
 * falta convertir a mapa de bits BMP: basta la cabecera de directorio y los
 * PNG tal cual. Se incluyen 16, 32 y 48 px porque el navegador elige el más
 * cercano al tamaño que necesita, y dejar solo uno obliga a reescalar — que
 * es exactamente lo que emborrona un icono a 16 px.
 */
function packIco(imagenes) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);              // reservado
  cabecera.writeUInt16LE(1, 2);              // tipo 1 = icono
  cabecera.writeUInt16LE(imagenes.length, 4);

  const entradas = [];
  let offset = 6 + imagenes.length * 16;
  for (const { size, png } of imagenes) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // ancho (0 = 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // alto
    e.writeUInt8(0, 2);                      // colores de paleta
    e.writeUInt8(0, 3);                      // reservado
    e.writeUInt16LE(1, 4);                   // planos
    e.writeUInt16LE(32, 6);                  // bits por píxel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entradas.push(e);
  }
  return Buffer.concat([cabecera, ...entradas, ...imagenes.map((i) => i.png)]);
}

{
  const svg = readFileSync(`${BRAND_DIR}/favicon.svg`, "utf8");
  const render = async (size) => {
    const ctx = await browser.newContext({ viewport: { width: size, height: size } });
    const page = await ctx.newPage();
    await page.setContent(
      `<!doctype html><meta charset="utf-8">
       <style>html,body{margin:0;padding:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>
       ${svg}`
    );
    /*
     * `omitBackground` no es opcional aquí: Next rechaza el .ico si el PNG
     * embebido no viene en RGBA —"The PNG is not in RGBA format!"— y sin esta
     * bandera Chromium emite un PNG opaco sin canal alfa. El icono no queda
     * hueco por ello: la tesela azul es un <rect> del propio SVG, no el fondo
     * de la página, y además así las esquinas redondeadas salen recortadas de
     * verdad en lugar de sobre un cuadrado blanco.
     */
    const png = await page.screenshot({ omitBackground: true });
    await ctx.close();
    return { size, png };
  };

  const ico = packIco([await render(16), await render(32), await render(48)]);
  writeFileSync(`${APP}/favicon.ico`, ico);

  const { png: apple } = await render(180);
  writeFileSync(`${APP}/apple-icon.png`, apple);
  console.log("app/favicon.ico (16/32/48) y app/apple-icon.png (180) regenerados");
}

await browser.close();
console.log(`${count} PNG con transparencia en public/brand/png/`);
