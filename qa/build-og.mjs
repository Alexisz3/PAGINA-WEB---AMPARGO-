/**
 * Genera las tarjetas Open Graph de 1200 × 630.
 * Uso: npm run build:og
 *
 * Por qué existen. Todo el embudo de este sitio pasa por WhatsApp, y la
 * portada es la URL que Jose y Mario comparten. Las páginas declaraban
 * `twitter:card: summary_large_image` —es decir, prometían tarjeta con imagen
 * grande— y no tenían `og:image`: el enlace salía sin previsualización, en un
 * negocio cuyo argumento de venta es enteramente visual.
 *
 * Por qué son archivos y no `next/og` en tiempo de ejecución: una tarjeta
 * social se pide una vez por enlace compartido y no cambia nunca. Un archivo
 * estático se sirve desde el CDN sin ejecutar nada, y sobre todo se puede
 * MIRAR antes de publicarlo, que es lo que uno quiere de la imagen que
 * representa al negocio en el chat de un cliente.
 *
 * Por qué Playwright y no sharp: el mismo motor que ya rasteriza el logotipo
 * en `export-brand-png.mjs`. Compone foto y logotipo con las reglas de
 * maquetación del navegador en vez de con aritmética de recortes.
 *
 * Aviso sobre resolución: las fotos del portafolio llegaron por WhatsApp y
 * topan en 960 px de ancho. Una tarjeta de 1200 px las amplía un 25 %, que a
 * tamaño de previsualización no se nota. NO se sube ese tope ni se reescala
 * el original; los archivos de cámara están pendientes del cliente — punto 04
 * de docs/MATERIAL_PENDIENTE_CLIENTE.html.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { mark, NAVY, BRICK } from "./build-brand.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = `${ROOT}public/og`;
mkdirSync(OUT, { recursive: true });

const IVORY = "#F2EFE8";
const W = 1200;
const H = 630;

/**
 * Qué foto lleva cada tarjeta.
 *
 * La portada usa la MISMA fotografía que su propio hero: quien pulsa el
 * enlace compartido aterriza en la imagen que acaba de ver en el chat, y esa
 * continuidad es la mitad de para qué sirve una tarjeta social.
 *
 * La cotización lleva una cocina terminada, que es el trabajo que más se pide
 * y el que mejor se juzga de un vistazo. Se descartó `cocina-cuarzo-06` —mejor
 * encuadre— porque tiene a un operario reconocible al fondo: una tarjeta
 * social se queda congelada en cientos de chats y no hay consentimiento por
 * escrito para publicar la imagen de nadie.
 */
const CARDS = [
  { name: "home", photo: "exterior-lujo-01.jpeg" },
  { name: "quote", photo: "cocina-cuarzo-05.jpeg" },
];

/*
 * Sin texto de reclamo sobre la foto.
 *
 * Es tentador poner "Presupuestos sin costo" o similar, pero una tarjeta
 * social es un sitio donde una afirmación queda congelada en cientos de chats
 * y no se puede corregir. Va solo la marca —que es un hecho— sobre un velo
 * oscuro que garantiza el contraste sea cual sea la foto.
 */
function card(photoDataUri) {
  return `<!doctype html><meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=block">
  <style>
    html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#121412}
    .card{position:relative;width:${W}px;height:${H}px}
    .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(18,20,18,.97) 0%,rgba(18,20,18,.93) 16%,rgba(18,20,18,.62) 32%,rgba(18,20,18,0) 58%)}
    .lockup{position:absolute;left:56px;bottom:52px;display:flex;align-items:center;gap:20px}
    .name{font-family:'Space Grotesk',Arial,sans-serif;color:${IVORY};line-height:1}
    .n1{display:block;font-weight:700;font-size:44px;letter-spacing:-.01em}
    .n2{display:block;margin-top:12px;font-weight:500;font-size:19px;letter-spacing:.24em;color:#C9CEd6}
    .rule{position:absolute;left:0;right:0;bottom:0;height:8px;display:flex}
    .rule i{display:block;height:100%}
  </style>
  <div class="card">
    <img class="photo" src="${photoDataUri}">
    <div class="veil"></div>
    <div class="lockup">
      <svg viewBox="0 0 80 64" height="86" width="${(86 * 80) / 64}">${mark({ body: IVORY, accent: BRICK })}</svg>
      <span class="name">
        <span class="n1">ANDRADE PARRA <span style="font-weight:500">CORPORATION</span></span>
        <span class="n2">GENERAL REMODELING</span>
      </span>
    </div>
    <div class="rule"><i style="background:${NAVY};width:38%"></i><i style="background:${BRICK};width:62%"></i></div>
  </div>`;
}

const browser = await chromium.launch();

for (const { name, photo } of CARDS) {
  const bytes = readFileSync(`${ROOT}public/images/proyectos/${photo}`);
  const uri = `data:image/jpeg;base64,${bytes.toString("base64")}`;

  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(card(uri), { waitUntil: "networkidle" });
  // Sin esperar a las fuentes se rasteriza la de reserva y el nombre sale con
  // otra letra que la del sitio.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 82 });
  await page.close();
  console.log(`public/og/${name}.jpg — ${W}×${H} desde ${photo}`);
}

await browser.close();
