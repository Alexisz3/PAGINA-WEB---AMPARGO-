/**
 * QA funcional multipágina. Ejecutar contra el build de producción:
 *   node qa/functional.mjs [baseUrl]
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://127.0.0.1:4318";
const results = [];

function check(name, passed, detail = "") {
  results.push({ name, passed });
  console.log(`${passed ? "OK   " : "FALLA"} ${name}${detail ? " — " + detail : ""}`);
}

const browser = await chromium.launch();

// ─── 1. Enrutado por idioma y detección ─────────────────────────────────
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  const redirect = async (headers) => {
    const r = await p.request.get(URL + "/", { headers, maxRedirects: 0 });
    return { status: r.status(), location: r.headers()["location"] ?? "" };
  };

  let r = await redirect({ "Accept-Language": "es" });
  check("Raíz: Accept-Language es → /es", r.status === 307 && r.location.endsWith("/es"), `${r.status} ${r.location}`);

  r = await redirect({ "Accept-Language": "en-US" });
  check("Raíz: Accept-Language en → /en", r.status === 307 && r.location.endsWith("/en"), `${r.status} ${r.location}`);

  r = await redirect({ "Accept-Language": "fr" });
  check("Raíz: idioma no soportado → fallback /en", r.status === 307 && r.location.endsWith("/en"), `${r.status} ${r.location}`);

  r = await redirect({ "Accept-Language": "en-US", Cookie: "AMPARGO_LOCALE=es-US" });
  check("Raíz: cookie es vence a cabecera en", r.status === 307 && r.location.endsWith("/es"), `${r.status} ${r.location}`);

  const explicit = await p.request.get(URL + "/en", {
    headers: { Cookie: "AMPARGO_LOCALE=es-US" },
    maxRedirects: 0,
  });
  check("Prefijo explícito /en vence a cookie es", explicit.status() === 200, String(explicit.status()));

  await ctx.close();
}

// ─── 2. HTML localizado sin JavaScript ──────────────────────────────────
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();

  await p.goto(URL + "/es", { waitUntil: "domcontentloaded" });
  const esHtml = await p.content();
  check("Sin JS: /es sirve lang=es-US", (await p.getAttribute("html", "lang")) === "es-US");
  check("Sin JS: /es contiene copy en español", esHtml.includes("Solicitar cotización"));

  await p.goto(URL + "/en", { waitUntil: "domcontentloaded" });
  const enHtml = await p.content();
  check("Sin JS: /en sirve lang=en-US", (await p.getAttribute("html", "lang")) === "en-US");
  check("Sin JS: /en contiene copy en inglés", enHtml.includes("Request a quote"));
  check("Sin JS: /en NO contiene copy español", !enHtml.includes("Solicitar cotización"));

  check("SEO: canonical presente", enHtml.includes('rel="canonical"'));
  // El atributo puede serializarse como `hrefLang` o `hreflang` según el
  // motor; se compara en minúsculas para no depender de eso.
  const lower = enHtml.toLowerCase();
  check("SEO: hreflang recíprocos (es-US, en-US, x-default)",
    lower.includes('hreflang="es-us"') && lower.includes('hreflang="en-us"') && lower.includes('hreflang="x-default"'));

  await ctx.close();
}

// ─── 3. Selector de idioma preserva la página ───────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  await p.goto(URL + "/es/proyectos", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  await p.locator('[role="group"] button', { hasText: "EN" }).click();
  await p.waitForTimeout(1500);
  check("Selector: /es/proyectos → /en/projects (misma página)", p.url().endsWith("/en/projects"), p.url());

  await p.goto(URL + "/es/cotizacion", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  await p.locator('[role="group"] button', { hasText: "EN" }).click();
  await p.waitForTimeout(1500);
  check("Selector: /es/cotizacion → /en/quote", p.url().endsWith("/en/quote"), p.url());

  await ctx.close();
}

// ─── 4. Navegación multipágina ──────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);

  await p.locator("header nav a", { hasText: "Proyectos" }).click();
  await p.waitForTimeout(1500);
  check("Nav: Proyectos abre /es/proyectos", p.url().includes("/es/proyectos"), p.url());
  check("Nav: el idioma se conserva al navegar", (await p.getAttribute("html", "lang")) === "es-US");

  await ctx.close();
}

// ─── 5. Menú móvil accesible ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  check("Móvil: el foco NO se roba al cargar",
    await p.evaluate(() => document.activeElement === document.body || document.activeElement === document.documentElement));

  const trigger = p.locator('header button[aria-controls="menu-movil"]');
  await trigger.click();
  await p.waitForTimeout(600);
  const dialog = p.locator('[role="dialog"][aria-modal="true"]');
  check("Móvil: abre diálogo modal", (await dialog.count()) === 1);
  check("Móvil: el foco entra al panel",
    await p.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
  check("Móvil: bloquea scroll del fondo",
    (await p.evaluate(() => getComputedStyle(document.body).overflow)) === "hidden");

  await p.keyboard.press("Escape");
  await p.waitForTimeout(600);
  check("Móvil: Escape cierra", (await dialog.count()) === 0);
  check("Móvil: el foco vuelve al disparador",
    await p.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "menu-movil"));
  check("Móvil: scroll del fondo restaurado",
    (await p.evaluate(() => getComputedStyle(document.body).overflow)) !== "hidden");

  await ctx.close();
}

// ─── 6. Cotización: etapas y canal excluyente ───────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es/cotizacion", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  check("Cotización: 3 etapas visibles", (await p.locator("ol button").count()) === 3);
  check("Cotización: arranca en la etapa 1", await p.locator('[aria-current="step"]').isVisible());

  await p.locator("button", { hasText: "Continuar" }).click();
  await p.waitForTimeout(600);
  check("Cotización: avanza a Referencias", await p.locator("text=/Agregue imágenes|Add reference/").isVisible());

  await p.locator("button", { hasText: "Continuar" }).click();
  await p.waitForTimeout(600);
  const radios = p.locator('input[name="channel"]');
  check("Cotización: canal con 2 radios excluyentes", (await radios.count()) === 2);
  await radios.first().check();
  await p.waitForTimeout(300);
  await radios.last().check();
  await p.waitForTimeout(300);
  const checkedCount = await p.locator('input[name="channel"]:checked').count();
  check("Cotización: solo un canal puede estar activo", checkedCount === 1);

  const text = (await p.locator("main").innerText()).toLowerCase();
  check("Cotización: NO afirma envío que no ocurrió",
    !/solicitud enviada|mensaje enviado|hemos recibido|request sent|we received/.test(text));
  check("Cotización: declara el modo desarrollo",
    /modo de desarrollo|development mode/.test(text));

  await ctx.close();
}

// ─── 7. Movimiento reducido ─────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL + "/es", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(500);
  const opacity = await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).opacity : "0";
  });
  check("Movimiento reducido: contenido visible de inmediato", Number(opacity) > 0.95, `opacidad ${opacity}`);
  await ctx.close();
}

// ─── 8. 404 localizado ──────────────────────────────────────────────────
{
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const r = await p.request.get(URL + "/es/ruta-que-no-existe");
  check("404: ruta desconocida devuelve 404", r.status() === 404, String(r.status()));
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} comprobaciones superadas`);
if (failed.length) {
  console.log("Fallos:");
  failed.forEach((f) => console.log("  -", f.name));
  process.exit(1);
}
