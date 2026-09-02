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

// ─── 6. Cotización: dos etapas, validación completa y reparto ───────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  /** Rellena la etapa de contacto. `phone`/`email` a "" para omitirlos. */
  const fillContact = async (page, { name = "Kevin Prueba", phone = "8325551234", email = "" } = {}) => {
    await page.locator("#name").fill(name);
    await page.locator("#phone").fill(phone);
    await page.locator("#email").fill(email);
    await page.locator('input[name="channel"]').last().check();
    await page.locator("#consent").setChecked(true);
  };

  /** Intercepta window.open y devuelve la URL de wa.me, o null si se bloqueó. */
  const submit = async (page) => {
    await page.evaluate(() => {
      window.__opened = null;
      window.open = (u) => { window.__opened = u; return null; };
    });
    await page.locator("button", { hasText: /Enviar por WhatsApp|Send by WhatsApp/ }).click();
    await page.waitForTimeout(500);
    return page.evaluate(() => window.__opened);
  };

  await p.goto(URL + "/es/cotizacion", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  check("Cotización: 2 etapas visibles", (await p.locator("ol button").count()) === 2);
  check("Cotización: arranca en la etapa 1", await p.locator('[aria-current="step"]').isVisible());
  check(
    "Cotización: ya no existe el paso de fotos",
    !/agregue imágenes|reference images|arrastre sus archivos/i.test(await p.locator("main").innerText())
  );

  /*
   * La descripción es obligatoria. Se comprueba por los DOS caminos, porque
   * el botón "Continuar" sí la exigía y el stepper no: pulsando el círculo de
   * la última etapa se llegaba al envío y salía una solicitud sin proyecto,
   * que el contratista no puede responder.
   */
  check(
    "Cotización: bloquea avanzar sin describir el proyecto",
    await (async () => {
      await p.locator("button", { hasText: "Continuar" }).click();
      await p.waitForTimeout(400);
      return p.locator('[role="alert"]').first().isVisible();
    })()
  );

  check(
    "Cotización: el stepper NO deja saltar a la última etapa con la primera vacía",
    await (async () => {
      await p.locator("ol button").nth(1).click();
      await p.waitForTimeout(400);
      const stillFirst = (await p.locator("#description").count()) === 1;
      const announced = await p.locator('[role="alert"]').first().isVisible();
      const focused = await p.evaluate(() => document.activeElement?.id);
      return stillFirst && announced && focused === "description";
    })(),
    "etapa 1 + alerta + foco en el campo que falta"
  );

  await p.locator("#description").fill("Remodelación de cocina de 20 m2");
  await p.locator("button", { hasText: "Continuar" }).click();
  await p.waitForTimeout(600);
  check("Cotización: avanza a Contacto", (await p.locator("#name").count()) === 1);

  const radios = p.locator('input[name="channel"]');
  check("Cotización: canal con 2 radios excluyentes", (await radios.count()) === 2);
  await radios.first().check();
  await p.waitForTimeout(200);
  await radios.last().check();
  await p.waitForTimeout(200);
  check("Cotización: solo un canal puede estar activo",
    (await p.locator('input[name="channel"]:checked').count()) === 1);

  const text = (await p.locator("main").innerText()).toLowerCase();
  check("Cotización: NO afirma envío que no ocurrió",
    !/solicitud enviada|mensaje enviado|hemos recibido|request sent|we received/.test(text));
  check("Cotización: sin aviso de modo desarrollo en producción",
    !/modo de desarrollo|development mode/.test(text));
  check("Cotización: existe acción de envío",
    (await p.locator("button", { hasText: /Enviar por WhatsApp|Send by WhatsApp/ }).count()) === 1);

  check("Cotización: bloquea el envío sin datos de contacto",
    await (async () => {
      const opened = await submit(p);
      return opened === null && (await p.locator('[role="alert"]').count()) >= 3;
    })());

  // Teléfono O correo, indistintamente: exigir ambos pierde solicitudes.
  await fillContact(p, { phone: "8325551234", email: "" });
  check("Cotización: teléfono sin correo se admite", (await submit(p)) !== null);

  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  await fillContact(p, { phone: "", email: "cliente@example.com" });
  check("Cotización: correo sin teléfono se admite", (await submit(p)) !== null);

  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  await fillContact(p, { phone: "", email: "" });
  check("Cotización: sin teléfono NI correo se bloquea", (await submit(p)) === null);

  await ctx.close();
}

// ─── 6b. El mensaje que le llega al contratista, y a quién le llega ─────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();

  /** Recorrido completo desde cero. Devuelve la URL de wa.me abierta. */
  const sendOne = async (page, { name, phone, description, locale = "es" }) => {
    await page.goto(`${URL}/${locale}/${locale === "es" ? "cotizacion" : "quote"}`, {
      waitUntil: "domcontentloaded",
    });
    /*
     * Partir de cero en cada solicitud. El formulario guarda el borrador en
     * `sessionStorage` a propósito —quien vuelve no pierde lo escrito— así que
     * sin limpiar, la segunda vuelta arranca en la etapa de contacto y no hay
     * ningún #description que rellenar.
     */
    await page.evaluate(() => window.sessionStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    await page.locator("#description").fill(description);
    await page.locator("button", { hasText: /Continuar|Continue/ }).click();
    await page.waitForTimeout(500);
    await page.locator("#name").fill(name);
    await page.locator("#phone").fill(phone);
    await page.locator('input[name="channel"]').last().check();
    await page.locator("#consent").setChecked(true);
    await page.evaluate(() => {
      window.__opened = null;
      window.open = (u) => { window.__opened = u; return null; };
    });
    await page.locator("button", { hasText: /Enviar por WhatsApp|Send by WhatsApp/ }).click();
    await page.waitForTimeout(500);
    return page.evaluate(() => window.__opened);
  };

  const first = { name: "María Fernández", phone: "8325550101", description: "Remodelación de cocina con isla" };
  const url = await sendOne(p, first);
  const message = decodeURIComponent((url ?? "").split("?text=")[1] ?? "");

  check("Mensaje: lleva proyecto, nombre y teléfono",
    /Proyecto: Remodelación de cocina con isla/.test(message) &&
    /Nombre: María Fernández/.test(message) &&
    /Teléfono: 8325550101/.test(message), message.replace(/\n/g, " | "));
  check("Mensaje: acentos y eñes bien codificados",
    (url ?? "").includes("%C3%B3") && !/Ã/.test(message));

  /*
   * Ninguna mención a fotos. El mensaje prometía "fotos de referencia listas
   * para enviar" y no llegaba ninguna: `wa.me` solo admite texto. El
   * contratista leía que había fotos y no las había.
   */
  check("Mensaje: NO promete fotos que no viajan",
    !/foto|photo/i.test(message), message.replace(/\n/g, " | "));

  check("Confirmación: invita a adjuntar las fotos en el chat (ES)",
    /adjúntelas en esa misma conversación/i.test(await p.locator("main").innerText()));

  /*
   * Reparto entre los dos contactos. `lib/assignment.ts` existía y no lo
   * llamaba nadie: el formulario mandaba siempre al primer número y el
   * segundo contacto no recibía ninguna solicitud. Se comprueba de punta a
   * punta —no solo la función— porque el defecto estaba justo en el cable.
   */
  const targets = new Set();
  const lote = [
    first,
    { name: "John Smith", phone: "7135550102", description: "Bathroom remodel, master suite" },
    { name: "Luis Peña", phone: "2815550103", description: "Ampliación de cochera" },
    { name: "Sarah Johnson", phone: "8325550104", description: "Kitchen countertops and backsplash" },
    { name: "Ramón Ortiz", phone: "8325550105", description: "Techo y estructura de patio" },
    { name: "Emily Davis", phone: "9365550106", description: "Full interior repaint and floors" },
  ];
  targets.add((url ?? "").match(/wa\.me\/(\d+)/)?.[1]);
  for (const req of lote.slice(1)) {
    const u = await sendOne(p, req);
    targets.add((u ?? "").match(/wa\.me\/(\d+)/)?.[1]);
  }
  check("Reparto: un lote variado llega a AMBOS contactos", targets.size === 2,
    [...targets].join(" y "));

  const repeat = await sendOne(p, first);
  check("Reparto: la misma solicitud abre siempre el mismo contacto",
    repeat?.match(/wa\.me\/(\d+)/)?.[1] === url?.match(/wa\.me\/(\d+)/)?.[1]);

  await sendOne(p, { name: "John Smith", phone: "7135550102", description: "Bathroom remodel", locale: "en" });
  check("Confirmación: invita a adjuntar las fotos en el chat (EN)",
    /attach them in that same chat/i.test(await p.locator("main").innerText()));

  await ctx.close();
}

// ─── 6c. Borrador antiguo de tres etapas ────────────────────────────────
{
  /*
   * Alguien con la pestaña abierta durante el despliegue trae en
   * `sessionStorage` un borrador con `step: 3`, etapa que ya no existe. Sin
   * acotar el valor, el formulario no pintaba NINGUNA etapa: un hueco en
   * blanco entre los botones, con el stepper señalando un círculo inexistente.
   */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es/cotizacion", { waitUntil: "domcontentloaded" });
  await p.evaluate(() => {
    window.sessionStorage.setItem("apc-quote-draft", JSON.stringify({
      service: "", location: "Houston, TX 77002", description: "Baño completo",
      photoCount: 4, name: "Ana", phone: "8325550001", email: "",
      channel: "whatsapp", consent: true, step: 3,
    }));
  });
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  check("Borrador antiguo (step 3): cae a la última etapa real, no a un hueco",
    (await p.locator("#name").count()) === 1 &&
    // El botón activo lleva el número y, en pantalla ancha, también la
    // etiqueta: basta con que empiece por el número de la última etapa real.
    (await p.locator('[aria-current="step"]').innerText()).trim().startsWith("2"),
    (await p.locator('[aria-current="step"]').innerText()).replace(/\s+/g, " "));
  check("Borrador antiguo: conserva lo escrito", (await p.locator("#name").inputValue()) === "Ana");
  check("Borrador antiguo: el conteo de fotos no reaparece",
    !/imágenes de referencia|reference images/i.test(await p.locator("main").innerText()));

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

// ─── 11. 404 con marca en cualquier ruta no reconocida ──────────────────
{
  /*
   * `app/[locale]/not-found.tsx` existía y estaba bien hecho, pero solo se
   * pintaba cuando una ruta EXISTENTE llamaba a `notFound()`. Una dirección
   * que no coincidía con ninguna ruta caía en la pantalla por defecto de
   * Next: 7.200 bytes, fondo negro, en inglés, sin cabecera ni marca. El
   * comodín de `app/[locale]/[...rest]` es lo que cierra ese hueco.
   */
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  const branded = async (path, expect) => {
    const r = await p.request.get(URL + path);
    const html = await r.text();
    check(
      `404: ${path} → 404 con marca en ${expect.lang}`,
      r.status() === 404 && html.includes("ANDRADE PARRA") && expect.needle.test(html),
      `${r.status()} · ${html.length} bytes`
    );
  };

  const ES = { lang: "español", needle: /Página no encontrada/ };
  const EN = { lang: "inglés", needle: /Page not found/ };

  await branded("/es/ruta-inventada", ES);
  await branded("/en/made-up-route", EN);
  // Sin prefijo: `proxy.ts` antepone el idioma detectado y el comodín hace el
  // resto. Una sola redirección, sin bucle.
  {
    const r = await p.request.get(URL + "/ruta-sin-prefijo", { maxRedirects: 0 });
    check("404: /ruta-sin-prefijo redirige UNA vez al idioma por defecto",
      r.status() === 307 && (r.headers()["location"] ?? "").startsWith("/en/"),
      `${r.status()} → ${r.headers()["location"]}`);
  }
  await branded("/ruta-sin-prefijo", EN);

  /*
   * Los 404 deliberados siguen intactos. `/privacidad` y `/terminos` devuelven
   * 404 a propósito mientras el texto legal siga sin revisar por el cliente:
   * un texto legal a medias es peor que ninguno. Ver
   * app/[locale]/privacy/page.tsx.
   */
  await branded("/es/privacidad", ES);
  await branded("/es/terminos", ES);
  await branded("/en/privacy", EN);
  await branded("/en/terms", EN);

  await ctx.close();
}

// ─── 12. Tarjeta social ─────────────────────────────────────────────────
{
  /*
   * El sitio declaraba `summary_large_image` sin `og:image`: prometía tarjeta
   * con imagen grande y salía vacía. Importa porque TODO el embudo pasa por
   * WhatsApp y la portada es la URL que se comparte.
   */
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  for (const path of ["/es", "/en", "/es/cotizacion", "/en/quote"]) {
    const html = await (await p.request.get(URL + path)).text();
    const og = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1];
    check(`og:image en ${path}, con URL absoluta`,
      Boolean(og) && /^https?:\/\//.test(og ?? ""), og ?? "ausente");
  }

  const img = await p.request.get(URL + "/og/home.jpg");
  check("og:image: el archivo existe y se sirve", img.status() === 200,
    `${img.status()} · ${img.headers()["content-type"]}`);

  await ctx.close();
}

// ─── 13. Visor de imagen ampliada ───────────────────────────────────────
{
  /*
   * El propietario juzga el trabajo por el remate del azulejo y en la
   * cuadrícula no podía acercarse. El visor reutiliza el patrón de foco de
   * `MobileMenu.tsx`: se abre con teclado, atrapa el foco, cierra con Escape
   * y lo devuelve al origen.
   */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL + "/es/proyectos/renovacion-de-cocina", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1500);

  const trigger = p.locator('button[aria-label^="Ver la fotografía ampliada"]').first();
  check("Visor: la foto es un disparador con nombre accesible",
    (await trigger.count()) === 1);

  const overflowBefore = await p.evaluate(() => getComputedStyle(document.body).overflow);

  // Se abre con teclado: es un <button> nativo, así que Enter basta.
  await trigger.focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);

  const dialog = p.locator('[role="dialog"][aria-modal="true"]');
  check("Visor: abre un diálogo modal", (await dialog.count()) === 1);
  check("Visor: el foco entra en el visor",
    await p.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null));
  check("Visor: bloquea el scroll del fondo",
    (await p.evaluate(() => document.body.style.overflow)) === "hidden");
  check("Visor: el objetivo de cierre llega a 44 px",
    await (async () => {
      const box = await p.locator('[role="dialog"] button[aria-label]').last().boundingBox();
      return Boolean(box) && box.width >= 44 && box.height >= 44;
    })());
  check("Visor: no amplía la foto por encima de su resolución real",
    await (async () => {
      const box = await p.locator('[role="dialog"] img').first().boundingBox();
      return Boolean(box) && box.width <= 960 + 1;
    })(),
    "las fotos actuales topan en 960 px de ancho");

  // Trampa de foco: tabular en círculo no debe salir del diálogo.
  for (let i = 0; i < 6; i++) await p.keyboard.press("Tab");
  check("Visor: el foco queda atrapado dentro",
    await p.evaluate(() => document.activeElement?.closest('[role="dialog"]') !== null));

  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  check("Visor: Escape cierra", (await dialog.count()) === 0);
  check("Visor: el foco vuelve a la imagen de origen",
    await p.evaluate(() =>
      document.activeElement?.getAttribute("aria-label")?.startsWith("Ver la fotografía ampliada") === true
    ));
  check("Visor: el scroll del fondo se restaura",
    (await p.evaluate(() => getComputedStyle(document.body).overflow)) === overflowBefore);

  // En la cuadrícula la lupa va aparte del enlace: pulsar la tarjeta navega.
  await p.goto(URL + "/es/proyectos", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(1200);
  check("Visor: la cuadrícula ofrece la lupa sin robar la navegación",
    (await p.locator('button[aria-label^="Ver la fotografía ampliada"]').count()) > 0);
  await p.locator("article a").first().click();
  await p.waitForTimeout(900);
  check("Visor: pulsar la tarjeta sigue abriendo el proyecto",
    /\/es\/proyectos\/.+/.test(p.url()), p.url());

  await ctx.close();
}

// ─── 14. Ninguna vista publica dirección postal ─────────────────────────
{
  /*
   * Mientras el cliente no confirme por escrito que hay local de cara al
   * público, el sitio afirma ZONA DE SERVICIO y no dirección: `address` en
   * JSON-LD le dice a Google "aquí se puede venir", y sobre un domicilio
   * particular eso dirige desconocidos a la casa de alguien.
   * Ver content/company.ts.
   */
  const ctx = await browser.newContext();
  const p = await ctx.newPage();

  for (const path of ["/es", "/es/contacto", "/en/contact"]) {
    const html = await (await p.request.get(URL + path)).text();
    check(`Zona de servicio: ${path} no publica calle ni código postal`,
      !/Burning Hills|77075|PostalAddress/.test(html));
  }

  const home = await (await p.request.get(URL + "/es")).text();
  check("Zona de servicio: el JSON-LD declara areaServed",
    /"areaServed"/.test(home) && /"name":"Houston"/.test(home));

  for (const [path, needle] of [
    ["/es/contacto", "Houston y alrededores, TX"],
    ["/en/contact", "Houston and surrounding areas, TX"],
  ]) {
    const html = await (await p.request.get(URL + path)).text();
    check(`Zona de servicio coherente en ${path}`, html.includes(needle), needle);
  }

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
