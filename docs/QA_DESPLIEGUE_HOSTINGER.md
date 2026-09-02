# Informe QA — Despliegue de prueba en Hostinger

**Sitio evaluado:** `darkorange-cobra-592836.hostingersite.com`
**Repositorio:** `andrade-parra-corporation` · rama `main`
**Entorno:** Hostinger Business (Node 22.x, Carolina del Norte) · Next.js 16.3.2 (Turbopack)
**Fecha:** 2 de septiembre de 2026
**Alcance:** funcionalidad, visual, experiencia de usuario, responsive (escritorio 1440×900 y móvil 375×812), ambos idiomas

---

> **Estado de los hallazgos.** Este informe se conserva **tal como se escribió**:
> es el registro de lo que se midió ese día, y reescribirlo a posteriori lo
> convertiría en otra cosa. Varios hallazgos ya están cerrados en la fase 4
> (rama `fase-4-integridad`):
>
> - **A3** (404 sin marca) y **M1** (`og:image` ausente) — cerrados.
> - **A1** (CSP sobrescrita), **A2** (`robots.txt` sobrescrito) y **M3** (falta
>   HSTS) — **abiertos**. No son problemas de código: dependen de soporte de
>   Hostinger y de la conexión del dominio definitivo.
> - **M2** (rutas legales en 404) — deliberado y sin cambios: esperan revisión
>   del texto por un abogado en Texas. Ver `app/[locale]/privacy/page.tsx`.
> - **M4** (canal «Email» sin backend) — abierto, pendiente de decisión.
> - **m1** (contador ambiguo al filtrar) y **m2** (idioma por defecto de la
>   raíz) — abiertos, sin decidir.
>
> El apartado del formulario de cotización de este informe lo dio por bueno, y
> lo estaba en lo que se probó. La fase 4 encontró después tres defectos que
> esta pasada no alcanzó: el reparto entre los dos contactos, el envío sin
> descripción saltando con el stepper, y el mensaje que prometía fotos
> inexistentes.

---

## Resumen ejecutivo

El despliegue en Hostinger **funciona**. Las tres dudas técnicas que teníamos antes de contratar quedaron resueltas a favor:

| Duda previa | Resultado |
|---|---|
| ¿Corre Node 22? | ✅ Sí, seleccionable en el panel |
| ¿Funciona el middleware (`proxy.ts`)? | ✅ Sí — enrutado de idiomas, prefijos y rutas traducidas operan correctamente |
| ¿Compila `sharp` para optimizar imágenes? | ✅ Sí — las imágenes se sirven en AVIF (12–43 KB) |

**Pero** aparecieron 3 problemas de prioridad alta que no existían en Vercel, dos de ellos causados por la propia plataforma de Hostinger, que **sobrescribe respuestas de la aplicación**.

**Conteo:** 3 altos · 5 medios · 2 menores · 24 verificaciones superadas.

---

## 🔴 Prioridad alta

### A1. Hostinger anula la política de seguridad (CSP) de la aplicación

La cabecera `Content-Security-Policy` que se definió en `next.config.mjs` **no llega al visitante**. En su lugar, Hostinger sirve la suya:

```
Content-Security-Policy: upgrade-insecure-requests
```

Lo que debería servirse (y sí se sirve en Vercel):

```
default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src ...; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'
```

**Impacto.** El endurecimiento del commit `ce5e106` («añade CSP») queda anulado en este hosting. Esa política existía para un motivo concreto y documentado en el propio código: impedir que un script inyectado —por una dependencia comprometida o una extensión del navegador— **exfiltre lo que el visitante escribe en el formulario de cotización**, que es exactamente donde deja su nombre y su teléfono. Además desaparece `frame-ancestors 'none'`, la protección moderna contra clickjacking sobre ese mismo formulario.

**Detalle irónico:** Hostinger inyecta `upgrade-insecure-requests`, justo la directiva que se excluyó a propósito y se documentó por qué (rompía las pruebas locales en WebKit).

**Nota:** el resto de cabeceras sí pasa intacto — `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, y `X-Powered-By` correctamente oculto. El problema es específico de la CSP.

**Qué hacer:** consultar a soporte de Hostinger si la CSP del origen puede respetarse (posiblemente vía configuración del CDN `hcdn`). Si no es posible, es un argumento de peso para Vercel, donde ya funcionaba.

---

### A2. Hostinger también anula el `robots.txt` de la aplicación

`app/robots.ts` genera correctamente, con `NEXT_PUBLIC_INDEXABLE=false`:

```
User-agent: *
Disallow: /
```

Pero lo que realmente se sirve en `/robots.txt` es:

```
User-agent: Googlebot
Disallow: /

User-agent: *
Allow: /
```

**Impacto inmediato (bajo):** bloquea a Google pero **permite explícitamente al resto** — Bing, Yandex, rastreadores de IA. El dominio temporal podría indexarse en esos buscadores. El riesgo real está contenido porque la etiqueta `<meta robots="noindex, nofollow, nocache">` **sí** se aplica correctamente en todas las páginas, y esa es la señal fuerte.

**Impacto futuro (alto) — esto es lo que importa:** si Hostinger mantiene esta sobrescritura cuando conectes `ampargo.com`, el `robots.txt` real de la aplicación **nunca se servirá**, incluido el enlace al sitemap. Para un negocio que depende de aparecer en búsquedas locales de Houston, eso es un problema de SEO directo.

**Qué hacer:** verificar `/robots.txt` **inmediatamente después** de conectar el dominio definitivo y poner `NEXT_PUBLIC_INDEXABLE=true`. Si sigue apareciendo la versión de Hostinger, hay que resolverlo antes de considerar el sitio publicado.

---

### A3. No hay página 404 propia

Cualquier URL inexistente muestra la pantalla por defecto de Next.js: **fondo negro, texto en inglés, sin cabecera, sin navegación, sin marca**.

```
404 | This page could not be found.
```

**Impacto.** Un visitante que escribe mal una dirección o llega por un enlace viejo cae en un callejón sin salida: ni logo, ni menú, ni un enlace para volver al inicio. Y lo ve en inglés aunque venga de una URL en español. Para el sitio de un cliente es un fallo de marca visible.

**Qué hacer:** crear `app/[locale]/not-found.tsx` con la cabecera del sitio, un mensaje en el idioma correcto y enlaces a Inicio / Proyectos / Solicitar cotización.

---

## 🟡 Prioridad media

### M1. Falta `og:image` en la portada — y el sitio se comparte por WhatsApp

| Página | `og:image` |
|---|---|
| Portada ES (`/es`) | ❌ ausente |
| Portada EN (`/en`) | ❌ ausente |
| Cotización | ❌ ausente |
| Detalle de proyecto | ✅ presente |

Las páginas declaran `twitter:card: summary_large_image` — es decir, **prometen una tarjeta con imagen grande** — pero sin `og:image` esa tarjeta sale vacía.

**Por qué importa especialmente aquí:** todo el flujo de conversión del sitio pasa por WhatsApp, y la portada es la URL que Jose o Mario van a compartir. Hoy, ese enlace aparece en WhatsApp **sin imagen de previsualización**, en un negocio cuyo argumento de venta es enteramente visual.

**Qué hacer:** añadir una imagen Open Graph (1200×630) a la portada en ambos idiomas y a la página de cotización.

---

### M2. Rutas legales registradas pero sin página (404)

`/es/privacidad`, `/en/privacy`, `/es/terminos`, `/en/terms` → **404**.

Están declaradas en `pathnames` de `i18n/routing.ts` pero las páginas se retiraron en el commit `ce5e106` por ser borrador sin revisar. **Lo bueno:** verifiqué el HTML de la portada y el pie **ya no las enlaza**, así que no hay enlaces rotos visibles. Solo son alcanzables escribiendo la URL a mano.

**Qué hacer:** o publicar las páginas legales (el cliente debe revisar el texto), o retirar también las entradas del registro de rutas para que no queden URLs registradas que no existen.

---

### M3. Falta la cabecera HSTS

`Strict-Transport-Security` está **ausente**. En Vercel venía incluida por defecto (el propio `next.config.mjs` lo comenta: *«En Vercel es además redundante: sirve solo HTTPS con HSTS»*). En Hostinger no se está enviando, así que esa protección contra degradación a HTTP se perdió al cambiar de plataforma.

---

### M4. El canal «Email» se ofrece pero no funciona

En el paso 3 del formulario, el visitante elige entre **Email** y **WhatsApp**. Debajo aparece: *«El correo aún no está disponible, así que las solicitudes van por WhatsApp.»*

Es honesto —y coherente con la decisión documentada de no prometer lo que no existe— pero como experiencia es una trampa pequeña: se ofrece una opción que no lleva a ninguna parte. Alguien que prefiere email lo selecciona y luego descubre que igual va por WhatsApp.

**Qué hacer:** mientras el correo no exista, o deshabilitar visiblemente la opción Email con la explicación al lado, o retirarla y dejar solo WhatsApp.

---

### M5. Peso de JavaScript

Peso total de la portada: **921 KB**.

| Tipo | Peso |
|---|---|
| Scripts | 531 KB |
| CSS / fuentes | 195 KB |
| Fetch / datos | 107 KB |
| Imágenes | 88 KB |

Las imágenes están **muy bien optimizadas** (AVIF, 12–43 KB cada una). El peso está en el JavaScript. No es alarmante para una app Next.js con i18n, pero conviene tenerlo presente dado que la propia documentación del proyecto marca la velocidad en móvil como innegociable.

Tiempos medidos: DOM listo ~1,0 s · carga completa ~1,1 s.

---

## 🟢 Menores

### m1. Contador de proyectos ambiguo al filtrar
Al filtrar por «Cocinas» se muestran 2 proyectos, pero el contador sigue diciendo **«Proyecto 2 de 7»** / «Project 2 of 7». Se lee como indicador de carrusel («vas por el 2 de 7») cuando en realidad es una cuadrícula filtrada. Conviene revisar la redacción.

### m2. La raíz `/` redirige según el idioma del navegador
`/` → `/es` en mi prueba, por detección de `Accept-Language`. Es el comportamiento diseñado (`localeDetection: true`), pero `DEFAULT_LOCALE` está en `en-US`. Vale la pena confirmar que es lo deseado para un mercado mayoritariamente angloparlante como Houston.

---

## ✅ Verificado y funcionando

**Rutas y contenido**
- Las 19 rutas principales responden **200** con títulos localizados correctos, en ambos idiomas.
- Detalle de servicios (5) y proyectos (7) generados estáticamente sin errores.
- `sitemap.xml` correctamente vacío mientras `INDEXABLE=false` (comportamiento intencionado).

**Internacionalización — el punto que más nos preocupaba**
- El middleware `proxy.ts` **funciona**: prefijos `/es` y `/en`, sin bucles de redirección.
- Rutas traducidas correctas: `/es/servicios` ↔ `/en/services`, `/es/proyectos` ↔ `/en/projects`.
- El selector de idioma **preserva el lugar y los filtros**: `/es/proyectos?categoria=kitchens` → `/en/projects?categoria=kitchens`.
- Traduce el slug de la entidad: `renovacion-de-cocina` → `kitchen-renovation` (sin 404).
- `hreflang` correcto para `es-US`, `en-US` y `x-default`. Canonical correcto.

**Formulario de cotización (probado de punta a punta)**
- Las 3 etapas avanzan y **los datos persisten** entre ellas; el resumen lateral se actualiza en vivo.
- Validación sólida: mensajes con `role="alert"`, campos con `aria-invalid`, y textos humanos («Necesitamos un nombre para saber con quién hablamos»).
- Envío vacío **bloqueado** correctamente.
- Envío completo genera el enlace de WhatsApp correcto, con todos los datos de las 3 etapas y bien codificado:
  `wa.me/18327940720?text=Solicitud de cotización… Servicio: Remodelaciones · Ubicación: Houston, TX 77002 · Nombre… Teléfono… Correo…`

**Móvil (375×812)**
- **Cero desbordamiento horizontal** — el fallo móvil más común, ausente.
- Objetivos táctiles: todos ≥44 px (el único de 1×1 px es el enlace «Saltar al contenido», que es el patrón correcto de accesibilidad).
- Menú hamburguesa: abre, `aria-modal="true"`, bloquea el scroll de fondo, y contiene los 5 enlaces + cotización + los dos teléfonos con marcación directa.

**Accesibilidad**
- Un solo `<h1>` por página, jerarquía H1→H2→H3 coherente.
- **Todas** las imágenes con `alt` descriptivo (0 sin atributo, 0 vacías).
- Enlace «Saltar al contenido» presente. `lang="es-US"` / `lang="en-US"` correcto.

**Imágenes y rendimiento**
- Optimización activa: se sirve **AVIF** (43 KB, 36 KB, 33 KB, 12 KB) con negociación de contenido correcta (cae a JPEG si el cliente no acepta AVIF).
- Ninguna imagen rota en todo el recorrido.

**SEO / metadatos**
- `meta description`, `og:title`, `og:type`, `og:locale` y datos estructurados JSON-LD presentes.
- `noindex, nofollow, nocache` aplicado correctamente — la variable `NEXT_PUBLIC_INDEXABLE=false` funciona.

**Consola**
- Sin errores de JavaScript en todo el recorrido. Un único aviso menor: una imagen con `preload` que no se usa de inmediato (`exterior-lujo-01.jpeg`) — optimización, no fallo.

---

## Sobre el fallo que reportaste (clicks que no responden)

**No pude confirmarlo como bug del sitio.** Lo intenté reproducir muchas veces y el comportamiento fue inconsistente: a veces los clicks automatizados no navegaban, y no solo en inglés — también falló alguna vez en español, lo que contradice el patrón que describiste.

Investigando la causa encontré que **mi herramienta de automatización estaba resolviendo coordenadas incorrectas**: en una prueba, tres elementos distintos del formulario (radio, checkbox y botón de envío, apilados verticalmente) fueron reportados todos en la misma altura `y=494`. Es decir, mis clicks aterrizaban en el lugar equivocado. Cuando disparé los mismos elementos correctamente, **todo funcionó**: el selector de idioma, los enlaces de navegación y el formulario completo.

También descarté una falsa alarma visual: una captura mostraba la cabecera flotando en mitad de la página, pero al verificar por DOM estaba correcta (`position: fixed`, `top: 0`) — era un artefacto de la captura, no del sitio.

**Conclusión:** no hay evidencia de un fallo determinista de navegación. Puede haber sido una condición puntual (hidratación en la primera carga, caché del navegador) o algo específico de tu sesión.

**Para descartarlo del todo**, la próxima vez que te ocurra:
1. Abre F12 → pestaña **Console** y mira si aparece algo en rojo.
2. Fíjate si pasa en los **primeros 1-2 segundos** tras cargar la página, o ya llevando rato.
3. Comprueba si con un segundo click sí responde.

---

## Recomendaciones, por orden

1. **Antes de conectar el dominio:** resolver A3 (404 propio) y M1 (`og:image` en portada) — son trabajo de código, independientes del hosting.
2. **Consultar a Hostinger** por A1 (CSP sobrescrita). Es el hallazgo más serio y no depende de ti: si no pueden respetar la CSP del origen, el sitio queda con menos protección de la que ya tenías construida en Vercel.
3. **Al conectar `ampargo.com`:** cambiar `NEXT_PUBLIC_SITE_URL` al dominio real, poner `NEXT_PUBLIC_INDEXABLE=true`, y **verificar de inmediato** `/robots.txt` (A2) y que la CSP no siga sobrescrita.
4. **Decidir sobre M2** (páginas legales) con el cliente — necesita que él revise el texto.
5. M3, M4, M5 y los menores pueden esperar a una segunda pasada.

---

## Comparación con Vercel

Lo que **se pierde** al mover de Vercel a Hostinger, según lo medido:

| | Vercel | Hostinger |
|---|---|---|
| CSP propia de la app | ✅ se aplica | ❌ sobrescrita |
| `robots.txt` propio | ✅ se aplica | ❌ sobrescrito |
| HSTS | ✅ por defecto | ❌ ausente |
| Middleware `proxy.ts` | ✅ | ✅ |
| Imágenes AVIF (`sharp`) | ✅ | ✅ |
| Formulario / i18n / móvil | ✅ | ✅ |

La aplicación en sí corre bien en Hostinger. Lo que se degrada es la **capa de plataforma**: dos respuestas que la aplicación genera correctamente son reemplazadas por el CDN de Hostinger, y una cabecera de seguridad desaparece. Si A1 y A2 no tienen solución con soporte, eso —y no el precio— es el argumento decisivo entre las dos opciones.
