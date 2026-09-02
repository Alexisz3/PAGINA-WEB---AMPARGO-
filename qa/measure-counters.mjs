/**
 * Mide las contraformas del isotipo sobre el píxel real, no a ojo.
 * Uso: npm run check:brand
 *
 * Rasteriza el símbolo y busca huecos de fondo ENCERRADOS por trazo: el ojal
 * de la A y el del cuenco de la P. Si a 20 px uno de los dos desaparece, el
 * dibujo está mal por bien que se vea grande — y esa es exactamente la clase
 * de regresión que no se nota revisando el logotipo en una pantalla grande.
 *
 * Falla (exit 1) si a 20 px no hay DOS contraformas o si alguna baja de 3 px
 * en su lado corto. Los valores de qa/build-brand.mjs se fijaron con esta
 * medición; ver docs/brand/README.md, «El tamaño favicon manda».
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";


const { mark, BRICK, NAVY } = await import("./build-brand.mjs");

const sizes = process.argv.slice(2).map(Number);
const SIZES = sizes.length ? sizes : [64, 32, 24, 20, 16];

/** Tamaño de referencia del criterio y lado corto mínimo admitido. */
const GATE_SIZE = 20;
const MIN_PX = 3;
const failures = [];

/* ─── Paridad entre las copias de la geometría ────────────────────────────
 *
 * La geometría vive en `qa/build-brand.mjs`. De ahí salen los SVG de
 * `public/brand/` y `app/icon.svg`, y de ahí se copia a mano —una sola vez, a
 * conciencia— a `components/BrandLogo.tsx`, que pinta el símbolo en línea en
 * la web.
 *
 * Esa copia es el punto débil: retocar el símbolo y olvidar el componente deja
 * el sitio sirviendo un logotipo distinto del que se entrega a imprenta, y
 * nada falla — las dos versiones se ven bien, solo que no son la misma. Esta
 * comprobación compara los trazados reales y detiene ese desvío.
 */
{
  const ROOT = fileURLToPath(new URL("..", import.meta.url));
  // El espacio inicial no sobra: sin él, `id="t"` del <title> cuela una
  // coincidencia falsa y la comparación falla con un trazado inventado.
  const paths = (svg) => [...svg.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);

  const source = paths(mark({ body: "#000", accent: "#000" }));
  const component = paths(readFileSync(`${ROOT}components/BrandLogo.tsx`, "utf8"));
  const icon = paths(readFileSync(`${ROOT}app/icon.svg`, "utf8"));

  const same = (a, z) => a.length === z.length && a.every((v, i) => v === z[i]);

  if (!same(source, component)) {
    failures.push(
      "components/BrandLogo.tsx no coincide con qa/build-brand.mjs — " +
        `fuente: ${source.join(" | ")} · componente: ${component.join(" | ")}`
    );
  } else {
    console.log("OK    components/BrandLogo.tsx refleja la geometría fuente");
  }

  if (!same(source, icon)) {
    failures.push(
      "app/icon.svg no coincide con qa/build-brand.mjs — ejecute `npm run build:brand`"
    );
  } else {
    console.log("OK    app/icon.svg regenerado desde la geometría fuente");
  }

  // El trazo redondeado no es decorativo: sin estos atributos el símbolo
  // vuelve a la versión de esquinas vivas sin que nada más cambie.
  const componentSrc = readFileSync(`${ROOT}components/BrandLogo.tsx`, "utf8");
  const strokeWidth = mark({ body: "#000" }).match(/stroke-width="([\d.]+)"/)?.[1];
  const ok =
    componentSrc.includes(`strokeWidth={${strokeWidth}}`) &&
    componentSrc.includes('strokeLinecap="round"') &&
    componentSrc.includes('strokeLinejoin="round"');
  if (!ok) {
    failures.push(
      `components/BrandLogo.tsx debe llevar strokeWidth={${strokeWidth}} y remates redondos`
    );
  } else {
    console.log(`OK    grosor ${strokeWidth} y remates redondos en las dos copias`);
  }
}

const b = await chromium.launch();

for (const size of SIZES) {
  const w = Math.round((size * 80) / 64);
  const page = await b.newPage({ viewport: { width: w, height: size }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:#fff}svg{display:block}</style>
     <svg viewBox="0 0 80 64" width="${w}" height="${size}">${mark({ body: NAVY, accent: BRICK })}</svg>`
  );
  const buf = await page.screenshot({ type: "png" });
  await page.close();

  // Decodifica el PNG en el propio navegador: no hace falta librería.
  const page2 = await b.newPage();
  const holes = await page2.evaluate(async (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);

    // "Fondo" = píxel casi blanco. El antialias intermedio cuenta como trazo:
    // un hueco que solo existe en el gris del suavizado no se ve como hueco.
    const bg = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      const r = data[i * 4], g = data[i * 4 + 1], bl = data[i * 4 + 2];
      bg[i] = r > 225 && g > 225 && bl > 225 ? 1 : 0;
    }

    // Inundación desde el borde: lo que quede sin marcar y sea fondo está
    // encerrado por trazo. Eso es una contraforma.
    const seen = new Uint8Array(width * height);
    const stack = [];
    for (let x = 0; x < width; x++) { stack.push(x, x + (height - 1) * width); }
    for (let y = 0; y < height; y++) { stack.push(y * width, width - 1 + y * width); }
    while (stack.length) {
      const i = stack.pop();
      if (i < 0 || i >= width * height || seen[i] || !bg[i]) continue;
      seen[i] = 1;
      const x = i % width, y = (i / width) | 0;
      if (x > 0) stack.push(i - 1);
      if (x < width - 1) stack.push(i + 1);
      if (y > 0) stack.push(i - width);
      if (y < height - 1) stack.push(i + width);
    }

    const out = [];
    const done = new Uint8Array(width * height);
    for (let i = 0; i < width * height; i++) {
      if (!bg[i] || seen[i] || done[i]) continue;
      let area = 0, minX = 1e9, maxX = -1, minY = 1e9, maxY = -1;
      const st = [i];
      done[i] = 1;
      while (st.length) {
        const j = st.pop();
        area++;
        const x = j % width, y = (j / width) | 0;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        for (const k of [j - 1, j + 1, j - width, j + width]) {
          if (k >= 0 && k < width * height && bg[k] && !seen[k] && !done[k]) { done[k] = 1; st.push(k); }
        }
      }
      out.push({ area, w: maxX - minX + 1, h: maxY - minY + 1, x: minX, y: minY });
    }
    return out.sort((a, z) => z.area - a.area);
  }, `data:image/png;base64,${buf.toString("base64")}`);
  await page2.close();

  const list = holes.length
    ? holes.map((h) => `${h.area}px² (${h.w}×${h.h})`).join(" · ")
    : "NINGUNA — las contraformas se han cerrado";
  console.log(`${String(size).padStart(3)}px → ${holes.length} contraforma(s): ${list}`);

  // El umbral se comprueba solo en el tamaño de referencia. Por debajo, el
  // manual ya remite a la tesela del favicon; por encima nunca es el problema.
  if (size === GATE_SIZE) {
    if (holes.length < 2) {
      failures.push(`a ${size} px solo quedan ${holes.length} contraforma(s): se espera el ojal de la A y el del cuenco`);
    }
    for (const h of holes) {
      const shortSide = Math.min(h.w, h.h);
      if (shortSide < MIN_PX) {
        failures.push(`a ${size} px una contraforma mide ${h.w}×${h.h}: su lado corto baja de ${MIN_PX} px`);
      }
    }
  }
}

await b.close();

if (failures.length) {
  console.log(`\n${failures.length} FALLO(S):`);
  failures.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
console.log("\nContraformas dentro de umbral.");

