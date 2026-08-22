/**
 * Lighthouse móvil sobre el build de producción.
 * Uso: node qa/lighthouse.mjs [baseUrl] [muestras]
 *
 * Ejecuta N muestras por página y reporta la MEDIANA, no una ejecución
 * afortunada. Los números de localhost no representan producción real
 * (sin latencia de red ni CDN) y así debe declararse.
 */
import { chromium } from "playwright";
import lighthouse from "lighthouse";

const BASE = process.argv[2] ?? "http://127.0.0.1:4318";
const SAMPLES = Number(process.argv[3] ?? 3);

const PAGES = [
  { name: "home", path: "/es" },
  { name: "proyectos", path: "/es/proyectos" },
  { name: "cotizacion", path: "/es/cotizacion" },
];

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const browser = await chromium.launch({ args: ["--remote-debugging-port=9222"] });
const results = [];

for (const page of PAGES) {
  const samples = { perf: [], a11y: [], bp: [], seo: [], lcp: [], cls: [], tbt: [] };

  for (let i = 0; i < SAMPLES; i++) {
    const runner = await lighthouse(
      BASE + page.path,
      { port: 9222, output: "json", logLevel: "error" },
      {
        extends: "lighthouse:default",
        settings: {
          formFactor: "mobile",
          screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false },
          throttling: {
            rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4,
            requestLatencyMs: 562.5, downloadThroughputKbps: 1474.56, uploadThroughputKbps: 675,
          },
        },
      }
    );

    const c = runner.lhr.categories;
    const a = runner.lhr.audits;
    samples.perf.push(Math.round(c.performance.score * 100));
    samples.a11y.push(Math.round(c.accessibility.score * 100));
    samples.bp.push(Math.round(c["best-practices"].score * 100));
    samples.seo.push(Math.round(c.seo.score * 100));
    samples.lcp.push(a["largest-contentful-paint"].numericValue);
    samples.cls.push(a["cumulative-layout-shift"].numericValue);
    samples.tbt.push(a["total-blocking-time"].numericValue);
  }

  results.push({
    page: page.name,
    Perf: median(samples.perf),
    A11y: median(samples.a11y),
    BP: median(samples.bp),
    SEO: median(samples.seo),
    "LCP (s)": (median(samples.lcp) / 1000).toFixed(2),
    CLS: median(samples.cls).toFixed(3),
    "TBT (ms)": Math.round(median(samples.tbt)),
  });
}

await browser.close();

console.log(`\nLighthouse móvil — medianas de ${SAMPLES} muestras`);
console.log(`Base: ${BASE} (build de producción, localhost)`);
console.table(results);
console.log(
  "\nNota: localhost no representa producción (sin latencia real ni CDN).\n" +
    "Sirve para comparar antes/después y detectar regresiones, no como promesa de campo."
);
