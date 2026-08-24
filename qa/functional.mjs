/**
 * QA funcional multipágina. Ejecutar contra el build de producción:
 *   node qa/functional.mjs [baseUrl]
 */
import { chromium, firefox, webkit } from "playwright";

const URL = process.argv[2] ?? "http://127.0.0.1:4318";
const results = [];

function check(name, passed, detail = "") {
  results.push({ name, passed });
  console.log(`${passed ? "OK   " : "FALLA"} ${name}${detail ? " — " + detail : ""}`);
}

const ENGINE = process.env.QA_BROWSER ?? "chromium";
const engines = { chromium, firefox, webkit };
const browser = await engines[ENGINE].launch();
console.log(`--- motor: ${ENGINE} ---`);

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

  r = await redirect({ "Accept-Language": "en-US", Cookie: "APC_LOCALE=es-US" });
  check("Raíz: cookie es vence a cabecera en", r.status === 307 && r.location.endsWith("/es"), `${r.status} ${r.location}`);

  /*
   * Migración de la cookie tras el cambio de marca.
   *
   * Un visitante que eligió español antes del rebranding trae la clave
   * antigua. Debe seguir aterrizando en /es pese a tener el navegador en
   * inglés, y salir de la petición con la clave nueva escrita y la vieja
   * borrada. Sin esta prueba, un futuro "ya no hace falta la migración"
   * pasaría desapercibido hasta que los visitantes recurrentes acabaran en
   * el idioma equivocado.
   */
  r = await redirect({ "Accept-Language": "en-US", Cookie: "AMPARGO_LOCALE=es-US" });
  check(
    "Idioma: la cookie anterior al rebranding conserva la preferencia",
    r.status === 307 && r.location.endsWith("/es"),
    `${r.status} ${r.location}`
  );
  {
    const res = await p.request.get(URL + "/", {
      headers: { "Accept-Language": "en-US", Cookie: "AMPARGO_LOCALE=es-US" },
      maxRedirects: 0,
    });
    const setCookies = res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie");
    const writesNew = setCookies.some((h) => /APC_LOCALE=es-US/.test(h.value));
    const clearsOld = setCookies.some((h) => /AMPARGO_LOCALE=;/.test(h.value));
    check(
      "Idioma: migra a la cookie nueva y retira la antigua",
      writesNew && clearsOld,
      `nueva:${writesNew} borra-antigua:${clearsOld}`
    );
  }

  const explicit = await p.request.get(URL + "/en", {
    headers: { Cookie: "APC_LOCALE=es-US" },
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

  /*
   * Se espera la CONDICIÓN (el cambio de URL), no un tiempo fijo. Con
   * `waitForTimeout` la prueba era inestable en WebKit, que hidrata más
   * despacio: el clic llegaba antes de que el manejador estuviera montado.
   */
  const switchLocale = async (from, expected) => {
    await p.goto(URL + from, { waitUntil: "domcontentloaded" });
    const toggle = p.locator('[role="group"] button', { hasText: "EN" });
    await toggle.waitFor({ state: "visible" });
    // Enabled + un frame de margen asegura que React ya asoció el onClick.
    await p.waitForFunction(() => document.readyState === "complete");
    await toggle.click();
    try {
      await p.waitForURL((u) => u.pathname.endsWith(expected), { timeout: 10000 });
    } catch {
      /* el check de abajo reporta la URL real alcanzada */
    }
    return p.url();
  };

  let url = await switchLocale("/es/proyectos", "/en/projects");
  check("Selector: /es/proyectos → /en/projects (misma página)", url.endsWith("/en/projects"), url);

  url = await switchLocale("/es/cotizacion", "/en/quote");
  check("Selector: /es/cotizacion → /en/quote", url.endsWith("/en/quote"), url);

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

// ─── 8. Servicios: enlaces únicos y detalles ────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);

  const hrefs = await p.locator("section a[href*='/servicios/']").evaluateAll((els) =>
    els.map((e) => e.getAttribute("href"))
  );
  const unique = new Set(hrefs);
  check("Servicios: las 5 tarjetas tienen href distintos", hrefs.length === 5 && unique.size === 5,
    `${hrefs.length} enlaces, ${unique.size} únicos`);

  const SERVICE_PATHS = [
    ["/es/servicios/construccion-personalizada", "/en/services/custom-construction"],
    ["/es/servicios/remodelaciones", "/en/services/remodeling"],
    ["/es/servicios/cocinas-y-banos", "/en/services/kitchens-and-bathrooms"],
    ["/es/servicios/espacios-exteriores", "/en/services/outdoor-spaces"],
    ["/es/servicios/reparaciones-y-mejoras", "/en/services/repairs-and-improvements"],
  ];

  let all200 = true;
  for (const pair of SERVICE_PATHS) {
    for (const path of pair) {
      const r = await p.request.get(URL + path);
      if (r.status() !== 200) all200 = false;
    }
  }
  check("Servicios: los 5 detalles responden 200 en ambos idiomas", all200);

  // Un slug del idioma equivocado no debe servir contenido duplicado.
  const wrong = await p.request.get(URL + "/en/services/cocinas-y-banos");
  check("Servicios: slug del idioma equivocado devuelve 404", wrong.status() === 404, String(wrong.status()));

  // Metadata propia por servicio.
  const html = await (await p.request.get(URL + "/es/servicios/cocinas-y-banos")).text();
  check("Servicios: canonical propio del detalle", html.includes("/es/servicios/cocinas-y-banos"));
  const lower = html.toLowerCase();
  check("Servicios: alternates recíprocos por entidad",
    lower.includes("/en/services/kitchens-and-bathrooms"));

  await ctx.close();
}

// ─── 9. Preselección de servicio en la cotización ───────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es/cotizacion?servicio=kitchens-bathrooms", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);
  check("Cotización: preselecciona el servicio del enlace",
    (await p.locator("#service").inputValue()) === "kitchens-bathrooms");

  // Un ID inventado se ignora en vez de preseleccionar basura.
  // Se limpia el borrador antes: si no, la elección guardada del caso
  // anterior gana (que es el comportamiento correcto, pero no lo que se
  // está probando aquí).
  await p.evaluate(() => {
    try { window.sessionStorage.clear(); } catch { /* sin storage */ }
  });
  await p.goto(URL + "/es/cotizacion?servicio=no-existe", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1600);
  check("Cotización: ignora un servicio inexistente",
    (await p.locator("#service").inputValue()) === "");

  await ctx.close();
}

// ─── 10. El idioma preserva el contexto ─────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  /*
   * React no expone ningún evento de "ya hidraté": `readyState === complete`
   * ocurre ANTES de que el onClick esté asociado, así que un clic temprano
   * no hace nada. En vez de subir un sleep a ciegas, se reintenta el clic
   * hasta que surta efecto. Es determinista y se detiene solo.
   */
  const switchAndGet = async (from, to, attempts = 5) => {
    await p.goto(URL + from, { waitUntil: "domcontentloaded" });
    // `URL` está sombreado por la constante de arriba: se usa el global.
    const startPath = new globalThis.URL(URL + from).pathname;
    const btn = p.locator('[role="group"] button', { hasText: to });
    await btn.waitFor({ state: "visible" });

    for (let i = 0; i < attempts; i++) {
      await btn.click().catch(() => {});
      try {
        await p.waitForURL((u) => u.pathname !== startPath, { timeout: 1500 });
        break;
      } catch {
        /* aún no había hidratado: se reintenta */
      }
    }
    return p.url().replace(URL, "");
  };

  let got = await switchAndGet("/es/proyectos/renovacion-de-cocina", "EN");
  check("Idioma: proyecto dinámico traduce el slug", got === "/en/projects/kitchen-renovation", got);

  got = await switchAndGet("/en/projects/kitchen-renovation", "ES");
  check("Idioma: vuelta conserva la entidad", got === "/es/proyectos/renovacion-de-cocina", got);

  got = await switchAndGet("/es/servicios/cocinas-y-banos", "EN");
  check("Idioma: servicio dinámico traduce el slug", got === "/en/services/kitchens-and-bathrooms", got);

  got = await switchAndGet("/es/proyectos?categoria=kitchens", "EN");
  check("Idioma: conserva el filtro de la query", got === "/en/projects?categoria=kitchens", got);

  await ctx.close();
}

// ─── 11. 404 localizado ─────────────────────────────────────────────────
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
