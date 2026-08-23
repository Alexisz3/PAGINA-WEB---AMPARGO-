# PROMPT MAESTRO FASE 3 — SERVICIOS, I18N CONTEXTUAL, VERCEL Y AUDITORÍA FINAL

> Pegar completo en una nueva sesión de Claude Code con Opus 5 / Ultracode, abierta en:
>
> `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO`
>
> Repositorio remoto:
>
> `https://github.com/Alexisz3/PAGINA-WEB---AMPARGO-.git`

---

## INICIO DEL PROMPT PARA CLAUDE CODE

Actúa como un equipo senior integrado por **product designer, UX writer bilingüe, information architect, especialista en Next.js 16 y next-intl, QA lead, especialista en accesibilidad, release engineer de Vercel y auditor de privacidad/Git**.

Tu misión es ejecutar la Fase 3 de AMPARGO sobre el estado local actual. No rehagas el rediseño mobile-first que ya funciona. Debes resolver cuatro problemas concretos:

1. las tarjetas de servicios no llevan a información específica;
2. el selector ES/EN pierde página, entidad, filtros o estado en ciertos contextos;
3. el deployment de Vercel falla por configuración de URL inválida;
4. hace falta una auditoría completa de regresión antes de cualquier release.

Trabaja con evidencia. Inspecciona, reproduce, implementa, prueba en build de producción, revisa visualmente y entrega un informe verificable. No te detengas después del plan.

### Restricción crítica de release

El branch local `main` está actualmente **dos commits por delante de `origin/main`**. No hagas push, force push, rebase destructivo, cambio de visibilidad del repositorio ni redeploy hasta resolver explícitamente la decisión de privacidad descrita en la sección 10.

---

## 1. Lee antes de editar

Lee completos:

1. `AGENTS.md`.
2. `CLAUDE.md`.
3. `PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_CONCEPTO_A.md`.
4. `PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_MOBILE_FIRST_VERCEL.md`.
5. `AUDITORIA_Y_PLAN_AMPARGO.md`.
6. `GUIA_PROYECTO.md`.
7. `README.md`.
8. `docs/design-references/README.md`.
9. `package.json`, `.nvmrc`, `.env.example`, `.gitignore`, `next.config.mjs` y `proxy.ts`.
10. Todo `app`, `components`, `content`, `i18n`, `lib`, `messages`, `qa` y `.github/workflows`.
11. Las guías pertinentes de Next.js 16 instaladas en `node_modules/next/dist/docs/` antes de modificar routing, metadata o deployment.
12. La documentación oficial de la versión instalada de `next-intl` para navegación tipada, pathnames dinámicos, cambio de locale y `proxy.ts`.

Comprueba la raíz Git antes de cualquier operación:

```text
C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO
```

No operes nunca sobre el antiguo repositorio padre `C:\Users\kevin`.

---

## 2. Estado actual que debes verificar

El estado observado al redactar este prompt es:

- `HEAD`: `3b615aa` — `fix: hueco vertical en escritorio y prueba inestable del selector de idioma`;
- commit anterior local: `dd9d535` — rediseño mobile-first y QA;
- remoto `origin/main`: `d7f1b74`;
- ahead/behind: `0 2` — dos commits locales sin publicar;
- working tree estaba limpio antes de crear este prompt;
- el sitio local se reporta en `http://localhost:4318`;
- la Fase 2 reportó 210/210 capturas, 32/32 funcional en tres motores y tres pasadas, axe sin violaciones graves y build limpio;
- el home móvil bajó de 6008 px a 3335 px;
- Vercel sólo ha intentado desplegar el commit remoto antiguo `d7f1b74`;
- el deployment fallido es `dpl_4RNHVdHdhdztKZTsBgM3jNrf8oai`;
- el repositorio de GitHub es público;
- dos fotos con rostro fueron retiradas en el commit local `dd9d535`, pero siguen accesibles en el historial público de `d7f1b74`.

No repitas estos datos como verdad si el estado cambió. Ejecuta comandos de sólo lectura y registra las diferencias.

---

## 3. Hallazgos ya reproducidos

### 3.1 Servicios: todas las tarjetas llevan al mismo índice

En `components/home/ServiceCards.tsx`, las cinco tarjetas usan literalmente:

```tsx
href="/services"
```

Por eso Construcción personalizada, Remodelaciones, Cocinas y baños, Espacios exteriores y Reparaciones y mejoras terminan en la misma página general.

Además, `app/[locale]/services/[slug]/page.tsx` devuelve `notFound()` incondicionalmente. La ruta dinámica existe en el registro, pero no hay ninguna página de servicio publicable.

### 3.2 Selector de idioma: sólo parece correcto en rutas simples

`LocaleSwitcher.tsx` usa `usePathname`, `useParams` y:

```tsx
router.replace({ pathname, params }, { locale: target })
```

pero no:

- preserva `searchParams`;
- traduce slugs de entidades mediante su ID estable;
- conserva el estado del formulario de cotización;
- maneja de forma explícita una entidad sin traducción.

Reproducciones confirmadas:

```text
/es/proyectos?categoria=cocinas
→ al pulsar EN termina en /en/projects
→ se pierde ?categoria=cocinas
```

```text
/es/proyectos/renovacion-de-cocina
→ al pulsar EN termina en /en/projects/renovacion-de-cocina
→ conserva el slug español
→ muestra 404
→ el destino correcto es /en/projects/kitchen-renovation
```

La afirmación del comentario actual de que next-intl “reescribe el slug automáticamente” es falsa para slugs editoriales almacenados en `content/projects.ts`. next-intl puede traducir el patrón de ruta, pero no conoce la relación entre dos slugs de contenido si no se la proporcionamos.

### 3.3 Vercel: causa exacta del error

El log oficial del deployment muestra:

```text
Error occurred prerendering page "/es-US"
TypeError: Invalid URL
at generateMetadata (app/[locale]/layout.tsx:56:19)
metadataBase: new URL(SITE_URL)
input: ''
```

La causa es doble:

1. En Vercel existe `NEXT_PUBLIC_SITE_URL` con valor vacío.
2. `lib/site.ts` usa:

```ts
process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
```

El operador `??` sólo cae al fallback ante `null`/`undefined`, no ante `""`. Por ello `SITE_URL` se convierte en cadena vacía y `new URL("")` rompe el prerender.

El warning adicional de Vercel indica que `engines.node = ">=20.9.0"` permitirá saltar automáticamente a futuros majors. Existe `.nvmrc` con Node 22, pero `package.json` debe alinearse de forma reproducible.

---

## 4. Resultado funcional esperado

Al terminar:

- cada tarjeta de servicio abre una página de detalle propia;
- cada detalle existe en ES y EN con slug localizado;
- las páginas contienen información útil sin inventar licencias, precios, plazos o garantías;
- el selector de idioma preserva la misma página y entidad;
- filtros/query string se conservan;
- el formulario de cotización no pierde sus campos/paso por cambiar idioma;
- ninguna ruta cae silenciosamente al home;
- Vercel compila aunque `NEXT_PUBLIC_SITE_URL` esté ausente o vacío;
- una URL inválida produce un diagnóstico claro y seguro, no un stack críptico durante prerender;
- Preview permanece `noindex`;
- se completa una auditoría visual, funcional, i18n, SEO, accesibilidad, performance y release;
- no se hace push hasta decidir qué hacer con las fotografías del historial público.

---

## 5. Implementación de páginas de servicios

### 5.1 Modelo de contenido tipado

Crea `content/services.ts` como fuente única. No mezcles datos duplicados en componentes y diccionarios.

Cada servicio debe incluir como mínimo:

```ts
type Service = {
  id: string;
  slugs: Record<AppLocale, string>;
  title: Record<AppLocale, string>;
  shortDescription: Record<AppLocale, string>;
  introduction: Record<AppLocale, string>;
  scopeItems: Record<AppLocale, string[]>;
  processSummary: Record<AppLocale, string[]>;
  relatedProjectCategories: ProjectCategory[];
  heroImage?: string;
  published: boolean;
};
```

Usa IDs estables independientes del idioma. Propuesta coherente con las cinco tarjetas actuales:

| ID | Español | English |
|---|---|---|
| `custom-construction` | `/es/servicios/construccion-personalizada` | `/en/services/custom-construction` |
| `remodeling` | `/es/servicios/remodelaciones` | `/en/services/remodeling` |
| `kitchens-bathrooms` | `/es/servicios/cocinas-y-banos` | `/en/services/kitchens-and-bathrooms` |
| `outdoor-spaces` | `/es/servicios/espacios-exteriores` | `/en/services/outdoor-spaces` |
| `repairs-improvements` | `/es/servicios/reparaciones-y-mejoras` | `/en/services/repairs-and-improvements` |

Verifica si otro naming mejora comprensión/SEO y mantenlo consistente. No cambies slugs después sin redirect permanente documentado.

### 5.2 Contenido permitido y prohibido

Sí puedes redactar contenido editorial general basado en los servicios ya visibles y confirmados:

- qué tipo de necesidad atiende cada categoría;
- ejemplos generales de alcance;
- cómo iniciar una consulta;
- relación con proyectos reales ya publicados;
- proceso general sin prometer fechas.

No puedes inventar:

- licencias o certificaciones;
- cobertura de permisos;
- años de experiencia;
- cantidad de obras;
- garantías;
- precios;
- tiempos fijos;
- disponibilidad inmediata;
- marcas/materiales obligatorios;
- testimonios;
- nombres de clientes;
- afirmaciones técnicas no confirmadas.

Usa lenguaje prudente: “podemos evaluar”, “el alcance se define después de revisar el proyecto”, “las necesidades varían”. No llenes páginas con placeholders `PENDIENTE` visibles.

### 5.3 Estructura visual del detalle

Cada página debe sentirse parte del Concepto A y contener:

1. breadcrumb accesible;
2. hero interior compacto con título, descripción e imagen pertinente ya autorizada;
3. introducción útil;
4. alcance orientativo con lista escaneable;
5. proceso resumido;
6. proyectos relacionados reales, si existen;
7. CTA compacto hacia cotización con el servicio preseleccionado;
8. enlace para volver a Servicios sin depender del botón del navegador;
9. metadata, canonical y alternates correctos.

No conviertas cada detalle en una landing genérica enorme. En móvil debe ser corto, fotográfico y escaneable.

### 5.4 Rutas y static generation

Implementa en `app/[locale]/services/[slug]/page.tsx`:

- `generateStaticParams` para las cinco entidades × dos locales;
- búsqueda mediante slug localizado;
- `notFound()` sólo para combinación inexistente/no publicada;
- `generateMetadata` por servicio;
- canonical/autolocale recíproco;
- JSON-LD `Service` sólo con datos confirmados y sin ofertas/precios falsos;
- datos relacionados obtenidos del modelo, no por strings duplicados.

### 5.5 Enlaces

Las tarjetas del home y del índice de servicios deben usar navegación tipada:

```tsx
<Link
  href={{
    pathname: "/services/[slug]",
    params: { slug: service.slugs[locale] }
  }}
>
```

La tarjeta completa puede ser el enlace, con nombre accesible claro. La flecha no debe ser un control separado vacío. Cada uno de los cinco `href` finales debe ser distinto.

### 5.6 Cotización preseleccionada

El CTA del servicio puede navegar a una cotización con un identificador estable, por ejemplo:

```text
/es/cotizacion?servicio=kitchens-bathrooms
```

El valor interno no se traduce. La etiqueta visible sí. El formulario debe validar el ID y preseleccionar sin sobrescribir una elección previa del usuario.

---

## 6. Selector ES/EN que preserva contexto

### 6.1 Regla de producto

Cambiar idioma significa **traducir el lugar actual**, no “volver a empezar”. El selector nunca debe redirigir al home salvo que el usuario ya esté en el home.

Debe preservar:

- página estática equivalente;
- misma entidad dinámica mediante ID estable;
- slug localizado de destino;
- query string funcional;
- hash relevante;
- filtros;
- paso y datos de cotización cuando sea razonable y seguro;
- historial mediante `replace`, evitando añadir una entrada inútil.

### 6.2 Arquitectura recomendada

Crea un resolvedor central y tipado, por ejemplo `i18n/localized-destination.ts`, en vez de introducir condicionales frágiles dentro del botón.

Responsabilidades:

1. identificar el pathname interno actual;
2. reconocer si es estático, proyecto dinámico o servicio dinámico;
3. para una entidad dinámica, localizarla por slug actual y recuperar su ID;
4. obtener el slug del locale destino desde `content/projects.ts` o `content/services.ts`;
5. conservar `URLSearchParams` permitidos;
6. conservar hash permitido;
7. producir un destino tipado para `next-intl`;
8. no usar fallback silencioso a `/`.

No confíes en que next-intl traduzca el valor de `[slug]`. next-intl traduce el patrón; la aplicación debe traducir la entidad.

### 6.3 Query strings

Preserva al menos:

- `categoria` en Proyectos;
- `servicio` en Cotización;
- parámetros de campaña legítimos si el proyecto decide conservarlos;
- ningún parámetro desconocido sensible por defecto.

El filtro usa un ID estable no traducido. Ejemplo esperado:

```text
/es/proyectos?categoria=cocinas
→ EN
/en/projects?categoria=cocinas
```

Si se decide localizar el nombre público del parámetro, crea mapeo recíproco y tests; no mezcles ambos enfoques.

### 6.4 Proyectos dinámicos

Caso de aceptación obligatorio:

```text
/es/proyectos/renovacion-de-cocina
→ EN
/en/projects/kitchen-renovation
```

Y retorno:

```text
/en/projects/kitchen-renovation
→ ES
/es/proyectos/renovacion-de-cocina
```

Debe responder 200 y representar el mismo `project.id`.

### 6.5 Servicios dinámicos

Caso equivalente:

```text
/es/servicios/cocinas-y-banos
→ EN
/en/services/kitchens-and-bathrooms
```

Debe conservar la misma entidad y responder 200.

### 6.6 Cotización

Cambiar idioma en medio del formulario no debe borrar campos, previews, servicio preseleccionado o paso actual.

Revisa cómo se persiste el draft. Diseña una solución mínima y honesta:

- estado serializable seguro en `sessionStorage` o adaptador de draft existente;
- no blobs grandes en storage;
- previews reconstruidas sólo si es técnicamente seguro;
- no PII en query string;
- cambio de locale después de persistir el estado;
- restauración y mensajes en el idioma nuevo;
- si un archivo no puede persistirse, advertir antes de cambiar o conservar el mismo componente sin navegación completa.

No sacrifiques privacidad por conveniencia.

### 6.7 Estados sin equivalente

Toda página publicada debería tener pareja ES/EN. Si una entidad no tiene contenido destino:

- no la publiques en un solo idioma;
- o deshabilita el cambio con explicación accesible;
- nunca envíes al home sin avisar;
- nunca construyas un slug inválido que termine en 404.

---

## 7. Corrección robusta de Vercel

### 7.1 Reproduce antes de corregir

Ejecuta localmente:

```powershell
$env:NEXT_PUBLIC_SITE_URL=''
npm run build
```

Debe reproducir el `ERR_INVALID_URL`. Hazlo en una shell controlada y restaura/elimina la variable después; no contamines otras sesiones.

### 7.2 Resolver URL de sitio

Reemplaza la lectura directa por una función pura y testeable. Requisitos:

- `trim()`;
- cadena vacía se trata como ausente;
- sólo aceptar URL absoluta `http:` o `https:`;
- normalizar origen sin barra final;
- no aceptar `javascript:`, rutas relativas o basura;
- fallback compatible con Vercel Preview;
- `metadataBase` siempre recibe una URL válida;
- un valor explícito inválido en producción genera un error claro que menciona la variable, no datos secretos.

Precedencia recomendada:

1. `NEXT_PUBLIC_SITE_URL` válido y no vacío;
2. `VERCEL_PROJECT_PRODUCTION_URL` válido, agregando `https://` si no incluye protocolo;
3. `VERCEL_URL` válido para preview, agregando `https://`;
4. `http://localhost:3000` sólo como fallback local/no Vercel.

Una forma orientativa, no para copiar sin revisar:

```ts
function parseHttpOrigin(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  const url = new URL(withProtocol);
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.origin;
}
```

No permitas que esta función convierta automáticamente cualquier texto inválido en dominio aparente. Distingue variables Vercel sin protocolo de valores explícitos del usuario.

### 7.3 Variables de Vercel

El valor vacío configurado en Vercel debe eliminarse o reemplazarse por una URL HTTPS real del deployment/proyecto. No inventes el dominio final del cliente.

Para Preview:

- `NEXT_PUBLIC_INDEXABLE=false`;
- URL de preview válida o fallback automático de Vercel;
- robots `noindex`;
- sitemap vacío si esa es la política vigente.

Para Production provisional:

- mantener `NEXT_PUBLIC_INDEXABLE=false` hasta dominio, legales y contenido aprobados;
- usar el dominio de Vercel válido como `SITE_URL` sólo para que metadata compile;
- no activar indexación porque Lighthouse SEO suba de puntuación.

Cambiar variables del dashboard o lanzar un redeploy es una acción externa. Hazlo sólo cuando el usuario autorice el release y después de resolver privacidad/Git.

### 7.4 Node reproducible

Alinea:

- `.nvmrc`: `22`;
- `package.json`: preferiblemente `"node": "22.x"` si Next 16 y Vercel lo soportan según documentación vigente;
- GitHub Actions: Node 22;
- entorno local/CI/Vercel.

Elimina el rango abierto `>=20.9.0` que permite saltos automáticos a un major futuro. No actualices dependencias sin necesidad.

### 7.5 Pruebas de configuración

Crea tests para:

| Caso | Resultado esperado |
|---|---|
| variable ausente, local | localhost válido |
| variable `""` | no rompe build |
| variable espacios | no rompe build |
| `https://example.com/` | normaliza sin barra |
| `VERCEL_URL=foo.vercel.app` | `https://foo.vercel.app` |
| URL relativa | rechazo/error claro |
| protocolo peligroso | rechazo |
| indexable false | noindex + sitemap vacío |

Ejecuta un build exacto con `NEXT_PUBLIC_SITE_URL` vacío después de la corrección. Debe pasar; no basta testear sólo la función.

### 7.6 Verificación Vercel

Cuando el usuario autorice push/release:

1. push de los commits aprobados;
2. esperar CI;
3. observar deployment nuevo, no reusar el viejo `d7f1b74`;
4. inspeccionar logs;
5. confirmar build exitoso;
6. abrir `/es` y `/en` en Preview;
7. ejecutar smoke tests en la URL real;
8. confirmar `noindex` y robots;
9. verificar redirects, assets y rutas dinámicas;
10. no promover a dominio definitivo todavía.

---

## 8. Auditoría adicional completa

No te limites a los tres bugs. Realiza una auditoría de regresión sobre el estado posterior a las correcciones.

### 8.1 Visual y responsive

Revisa:

- 320×568;
- 360×800;
- 375×812;
- 390×844;
- 393×852;
- 412×915;
- 430×932;
- landscape móvil;
- 768×1024;
- 1024×768;
- 1280×800;
- 1366×768;
- 1440×900;
- 1920×1080.

Páginas/estados mínimos:

- Home;
- Servicios;
- los cinco detalles de servicio;
- Proyectos y filtros;
- un detalle de proyecto;
- Cotización en tres pasos;
- cambio de idioma en cada tipo de página;
- menú móvil;
- carruseles;
- 404.

Busca:

- overflow horizontal;
- cortes de títulos ES/EN;
- tarjetas con alturas torpes;
- targets menores de 44×44;
- carruseles sin affordance;
- CTA repetidos;
- espacio muerto;
- foco tapado por sticky elements;
- imágenes deformadas;
- contraste sobre fotos;
- páginas de servicio demasiado largas o genéricas;
- footer desproporcionado.

Abre y mira las capturas. Un script que genera 210 archivos no acredita belleza.

### 8.2 Funcional

Prueba:

- enlaces únicos de tarjetas;
- back/breadcrumb;
- servicio preseleccionado en quote;
- filtros con JS y sin JS;
- navegación multipágina;
- selector locale estático/dinámico/query/form;
- menú, carrusel, lightbox y formularios;
- errores de consola/hidratación;
- reload directo de cada URL;
- 404 de slug incorrecto;
- canonical/hreflang de detalles.

### 8.3 Accesibilidad

- axe en Home, Servicios, cinco detalles, Proyectos, detalle, Cotización y menú;
- teclado completo;
- focus order;
- reduced motion;
- zoom 200%;
- headings, landmarks y breadcrumb;
- enlace de tarjeta con nombre útil;
- selector de idioma anunciando el idioma actual y el cambio;
- carriles alcanzables y desplazables;
- no duplicar enlaces vacíos por flechas decorativas.

### 8.4 i18n y SEO

- claves completas;
- slugs únicos por locale;
- entidad emparejada por ID;
- `lang` inicial;
- canonical autorreferente;
- alternates recíprocos;
- `x-default`;
- metadata localizada por servicio/proyecto;
- sitemap excluye drafts/legales no aprobados;
- URLs filtradas canonicalizan de acuerdo con la política;
- ninguna página inglesa contiene copy español y viceversa;
- selector nunca cae al home sin motivo.

### 8.5 Performance

Repite Lighthouse mobile en Home, Servicios, un detalle, Proyectos y Cotización. Compara con baseline:

- Home: Performance 87, LCP 3.31 s, TBT 275 ms;
- Proyectos: Performance 83, LCP 3.61 s, TBT 303 ms;
- Cotización: Performance 89, LCP 2.80 s, TBT 375 ms.

No atribuyas automáticamente todo a fotos de 960 px. Mide waterfall, imagen LCP, fuentes, JS, providers, animaciones y cache. No sacrifiques calidad visual ni accesibilidad por un punto de Lighthouse.

### 8.6 Deployment

- build con env vacío;
- build con env válido;
- checkout limpio + `npm ci`;
- CI YAML;
- Node version;
- no dependencia de archivos ignorados;
- variables Preview/Production;
- Vercel logs;
- smoke real sólo tras autorización.

---

## 9. Pruebas de aceptación obligatorias

Añade pruebas automatizadas explícitas.

### Servicios

1. Las cinco tarjetas tienen `href` diferentes.
2. Cada href responde 200.
3. Cinco detalles × dos idiomas responden 200.
4. Slug del idioma incorrecto responde 404 o redirect canónico decidido, nunca contenido duplicado.
5. Cada página tiene título, description, canonical y alternates propios.
6. CTA preselecciona el servicio correcto en quote.

### Idioma

1. `/es/servicios/cocinas-y-banos` ↔ `/en/services/kitchens-and-bathrooms`.
2. `/es/proyectos/renovacion-de-cocina` ↔ `/en/projects/kitchen-renovation`.
3. `/es/proyectos?categoria=cocinas` ↔ `/en/projects?categoria=cocinas`.
4. Home ↔ Home.
5. Servicios index ↔ Services index.
6. Proceso, Nosotros, Contacto y Cotización conservan página.
7. La cotización conserva paso y campos escritos.
8. Cambio ida/vuelta conserva entidad.
9. No aparece 404 en destinos válidos.
10. Ningún cambio inesperado termina en `/es` o `/en` home.

### Vercel/env

1. `NEXT_PUBLIC_SITE_URL` ausente: build pasa.
2. Vacío: build pasa.
3. Espacios: build pasa.
4. URL HTTPS válida: metadata correcta.
5. Vercel host sin protocolo: se normaliza.
6. URL peligrosa/relativa: se rechaza.
7. Preview: noindex.
8. Node version alineada.

### Navegadores

Ejecuta flujos críticos en Chromium, Firefox y WebKit, al menos tres pasadas globales, contra `next build` + `next start` en puerto aislado. No uses el servidor viejo de `4318` si no corresponde al build actual.

---

## 10. Privacidad e historial público: decisión obligatoria

Dos fotografías retiradas contienen el rostro identificable de un trabajador:

- `public/images/proyectos/cocina-cuarzo-04.jpeg`;
- `public/images/proyectos/cocina-cuarzo-06.jpeg`.

Los archivos fueron eliminados del árbol actual en `dd9d535`, pero siguen en el commit público `d7f1b74`. Un commit posterior que los borra **no los elimina del historial**.

Antes de push/release, presenta al usuario estas opciones:

### Opción A — Recomendada e inmediata

Poner el repositorio en privado mientras se consulta al cliente y al trabajador. Después se puede decidir si mantener el historial privado o sanearlo.

### Opción B — Mantener público y reescribir historial

Eliminar ambos objetos de todos los commits con una herramienta apropiada y hacer un push que reemplace historia. Esto es destructivo para clones existentes y requiere autorización explícita inmediata antes de ejecutarlo.

Requisitos si el usuario elige B:

- backup/bundle verificable antes de reescribir;
- objetivos exactos validados;
- no incluir otros archivos;
- documentar que SHAs cambiarán;
- `--force-with-lease`, nunca force ciego;
- verificar con `git rev-list --objects --all` que los nombres/objetos ya no existen;
- revisar cache/artefactos/deployments externos;
- invalidar o borrar deployments sólo con confirmación adicional si implica eliminación externa.

### Opción C — Mantener público con consentimiento confirmado

Sólo si existe autorización documentada para publicar esas imágenes. Aun así, no es necesario reincorporarlas al sitio si no aportan valor.

No elijas por el usuario. No interpretes el pedido de corregir Vercel como autorización para reescribir Git o cambiar visibilidad.

Mientras la decisión esté pendiente:

- implementa y prueba localmente;
- puedes crear commits locales claros;
- no hagas push;
- no redespliegues;
- no modifiques el remoto.

---

## 11. Git y release seguro

Preserva los dos commits locales existentes. No squash/rebase sin necesidad.

Antes de cualquier futuro push:

1. raíz Git exacta;
2. working tree conocido;
3. `origin` exacto;
4. fetch y ahead/behind;
5. remote no cambió inesperadamente;
6. suite verde;
7. secretos y datos privados ausentes;
8. decisión de fotos documentada;
9. diff completo revisado;
10. push normal si no hubo reescritura; `force-with-lease` sólo para la opción B autorizada.

No confundas “Vercel necesita un commit nuevo” con “hay permiso para publicarlo”.

---

## 12. Plan de ejecución

Mantén un plan vivo con una sola fase `in_progress`.

### Fase 0 — Baseline y reproducción

1. Lee documentos/código.
2. Verifica Git y commits.
3. Ejecuta typecheck, lint, i18n, build y tests actuales.
4. Reproduce enlaces genéricos.
5. Reproduce locale con filtro y detalle.
6. Reproduce Vercel URL vacía.
7. Captura estados visuales actuales relevantes.

### Fase 1 — Servicios

1. Modelo tipado.
2. Slugs ES/EN.
3. Contenido prudente.
4. Detalles y metadata.
5. Links únicos.
6. Proyectos relacionados.
7. Quote preseleccionada.

### Fase 2 — I18n contextual

1. Resolvedor central.
2. Estáticas.
3. Proyectos dinámicos.
4. Servicios dinámicos.
5. Query/hash.
6. Cotización.
7. Estados sin equivalente.

### Fase 3 — Vercel

1. Resolver SITE_URL.
2. Tests de env.
3. Node 22 alineado.
4. Build con env vacío y válido.
5. README/env/CI.

### Fase 4 — Auditoría

1. Visual/responsive.
2. Funcional.
3. A11y.
4. I18n/SEO.
5. Performance.
6. Checkout limpio.

### Fase 5 — Decisión de release

1. Presenta A/B/C sobre fotos.
2. No actúes hasta obtener decisión.
3. Si se autoriza, aplica exactamente esa opción.
4. Push/redeploy/smoke.
5. Informe final con SHA y URL sólo si realmente ocurrió.

---

## 13. Definición de terminado localmente

Puedes declarar la implementación local completa cuando:

- las cinco páginas de servicio existen en ambos idiomas;
- cada tarjeta abre su detalle correcto;
- el contenido es útil y no inventa afirmaciones;
- el selector preserva rutas estáticas, detalles, slugs y filtros;
- cotización no pierde estado por idioma;
- ningún destino válido cae al home/404;
- Vercel build se reproduce con URL vacía antes y pasa después;
- Node está fijado coherentemente;
- typecheck, lint, check:i18n y build pasan;
- E2E pasa en tres motores;
- axe y capturas fueron revisados;
- Lighthouse fue repetido;
- no hay regresiones mobile/desktop;
- no se hizo push mientras privacidad seguía pendiente.

“Listo localmente” no equivale a “publicado”.

---

## 14. Informe final requerido

Entrega:

1. **Servicios:** páginas creadas, slugs, contenido y enlaces.
2. **Idioma:** causa, arquitectura y matriz de rutas comprobadas.
3. **Vercel:** error original, corrección, pruebas de variables y estado real.
4. **Auditoría visual:** hallazgos y capturas.
5. **Funcionalidad:** conteos por navegador/pasada.
6. **Accesibilidad:** axe y manual.
7. **SEO/i18n:** metadata, alternates, canonical y sitemap.
8. **Performance:** comparación Lighthouse.
9. **Git:** commits locales, ahead/behind y working tree.
10. **Privacidad:** opción A/B/C todavía requerida o elegida.
11. **Release:** indicar de forma inequívoca si hubo push/deploy; no insinuarlo.
12. **Archivos clave modificados.**
13. **Bloqueos reales.**
14. **Siguiente paso único recomendado.**

No cierres con frases vagas. Incluye rutas, SHAs, comandos y resultados. Si no pudiste ejecutar una prueba, dilo.

Empieza ahora por baseline y reproducción. Implementa todo lo local que sea seguro. Detente antes de cualquier acción remota destructiva o publicación mientras la decisión de privacidad siga pendiente.

## FIN DEL PROMPT PARA CLAUDE CODE
