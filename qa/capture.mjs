/**
 * QA de captura y diagnóstico — herramienta de desarrollo, no forma parte del bundle.
 *
 * Uso:
 *   node qa/capture.mjs <etiqueta> [url]
 *
 * Ejemplo:
 *   node qa/capture.mjs antes http://127.0.0.1:4317
 *
 * Genera capturas en qa/shots/<etiqueta>/ y un informe JSON con errores de consola,
 * desbordamiento horizontal y métricas básicas por viewport e idioma.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const label = process.argv[2] ?? "sin-etiqueta";
const baseUrl = process.argv[3] ?? "http://127.0.0.1:4317";
const outDir = path.join("qa", "shots", label);

/** Los 8 viewports obligatorios del plan de QA. */
const VIEWPORTS = [
  { name: "320x568-movil-minimo", width: 320, height: 568 },
  { name: "375x812-movil", width: 375, height: 812 },
  { name: "430x932-movil-grande", width: 430, height: 932 },
  { name: "768x1024-tablet-vertical", width: 768, height: 1024 },
  { name: "1024x768-tablet-horizontal", width: 1024, height: 768 },
  { name: "1440x900-escritorio", width: 1440, height: 900 },
  { name: "812x375-movil-horizontal", width: 812, height: 375 },
  // Zoom 200% se simula reduciendo a la mitad el viewport CSS de escritorio.
  { name: "720x450-zoom-200", width: 720, height: 450 },
];

const LOCALES = ["es", "en"];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const report = { label, baseUrl, capturedAt: new Date().toISOString(), results: [] };

  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        locale: locale === "es" ? "es-MX" : "en-US",
      });

      // Fija el idioma antes de que la app hidrate, igual que un visitante recurrente.
      await context.addInitScript((loc) => {
        try {
          window.localStorage.setItem("apc-locale", loc);
        } catch {
          /* almacenamiento no disponible */
        }
      }, locale);

      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => pageErrors.push(String(err)));
      page.on("requestfailed", (req) => {
        const errorText = req.failure()?.errorText ?? "desconocido";
        // Playwright reports the previous RSC navigation as aborted when a
        // client-side transition starts. That is expected and not a broken
        // asset or application request.
        if (errorText === "net::ERR_ABORTED" && req.url().includes("?_rsc=")) return;
        failedRequests.push(`${req.url()} :: ${errorText}`);
      });

      await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60000 });
      // Deja que corran las animaciones de entrada antes de capturar.
      await page.waitForTimeout(1200);

      const diagnostics = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;

        // Elementos que sobresalen horizontalmente del viewport.
        // Se ignoran los que viven dentro de un contenedor con scroll propio
        // (un carrusel desborda por diseño) y los `position: fixed`, cuyas
        // coordenadas no dependen del scroll del documento.
        const offenders = [];
        if (overflow > 0) {
          const sx = window.scrollX;
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (getComputedStyle(el).position === "fixed") continue;

            let insideScroller = false;
            for (let a = el.parentElement; a; a = a.parentElement) {
              const ox = getComputedStyle(a).overflowX;
              if (ox === "auto" || ox === "scroll" || ox === "hidden") {
                insideScroller = true;
                break;
              }
            }
            if (insideScroller) continue;

            if (r.right + sx > doc.clientWidth + 1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.getAttribute("class") ?? "").slice(0, 120),
                width: Math.round(r.width),
                docRight: Math.round(r.right + sx),
              });
            }
            if (offenders.length >= 8) break;
          }
        }

        // Objetivos interactivos por debajo del mínimo táctil de 44x44 px.
        // Se excluye lo que está oculto a la vista (skip link, honeypot):
        // no son objetivos táctiles reales.
        const smallTargets = [];
        for (const el of document.querySelectorAll("a, button, input, select, textarea, [role='button']")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.width <= 1 || r.height <= 1) continue;
          if (el.closest("[aria-hidden='true']")) continue;
          if (r.width < 44 || r.height < 44) {
            smallTargets.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent ?? "").trim().slice(0, 40),
              w: Math.round(r.width),
              h: Math.round(r.height),
            });
          }
        }

        const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(
          (h) => `${h.tagName}: ${(h.textContent ?? "").trim().slice(0, 60)}`
        );

        return {
          lang: doc.lang,
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          horizontalOverflowPx: overflow,
          offenders,
          smallTargets,
          headings,
          h1Count: document.querySelectorAll("h1").length,
          // Un skip link es el primer enlace del documento y apunta a un ancla
          // interna; no depende de que su clase se llame "skip".
          hasSkipLink: (() => {
            const first = document.querySelector("body a[href^='#']");
            if (!first) return false;
            const target = document.querySelector(first.getAttribute("href"));
            return Boolean(target && target.closest("main, [role='main']") !== null) ||
                   first.getAttribute("href") === "#contenido";
          })(),
          // Empty alt text is valid for decorative images; only a missing
          // alt attribute is an accessibility issue.
          imagesWithoutAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
          totalImages: document.querySelectorAll("img").length,
          documentHeight: doc.scrollHeight,
        };
      });

      const file = path.join(outDir, `${locale}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: true });

      report.results.push({
        locale,
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        screenshot: file,
        consoleErrors,
        pageErrors,
        failedRequests,
        ...diagnostics,
      });

      await context.close();
    }
  }

  await browser.close();
  const reportPath = path.join(outDir, "informe.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  // Resumen legible en consola.
  console.log(`\n=== QA "${label}" — ${baseUrl} ===`);
  for (const r of report.results) {
    const flags = [];
    if (r.horizontalOverflowPx > 0) flags.push(`SCROLL-H:${r.horizontalOverflowPx}px`);
    if (r.consoleErrors.length) flags.push(`CONSOLA:${r.consoleErrors.length}`);
    if (r.pageErrors.length) flags.push(`JS-ERROR:${r.pageErrors.length}`);
    if (r.failedRequests.length) flags.push(`RED:${r.failedRequests.length}`);
    if (r.smallTargets.length) flags.push(`TAP<44:${r.smallTargets.length}`);
    if (r.h1Count !== 1) flags.push(`H1=${r.h1Count}`);
    if (!r.hasSkipLink) flags.push("SIN-SKIP-LINK");
    if (r.imagesWithoutAlt > 0) flags.push(`SIN-ALT:${r.imagesWithoutAlt}`);
    console.log(
      `${r.locale} ${r.viewport.padEnd(28)} alto=${String(r.documentHeight).padStart(6)}px  ${
        flags.length ? flags.join(" | ") : "OK"
      }`
    );
  }
  console.log(`\nInforme: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
