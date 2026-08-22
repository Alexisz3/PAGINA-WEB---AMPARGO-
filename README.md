# AMPARGO — Sitio web

Sitio multipágina bilingüe (español / inglés) para **AMPARGO**, empresa de
construcción y remodelación en Houston, Texas.

> **Estado:** implementación local terminada.
> **Lanzamiento bloqueado** por dependencias externas — ver [Pendientes de producción](#pendientes-de-producción).

---

## Stack

| Componente | Versión |
|---|---|
| Next.js | 16.3.2 (App Router, Turbopack) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 (tokens en `@theme`, sin `tailwind.config.js`) |
| next-intl | 4.13 |
| Playwright + axe-core + Lighthouse | solo QA |

**Node 20.9 o superior** (Next 16 lo exige). Recomendado Node 22 LTS.

---

## Instalación

```bash
npm ci
cp .env.example .env.local   # rellenar según el entorno
npm run dev                  # http://localhost:3000
```

---

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Integridad de traducciones, slugs y fotos referenciadas |
| `npm run qa:visual <etiqueta> <url>` | 210 capturas (7 páginas × 15 viewports × 2 idiomas) + diagnóstico |
| `npm run qa:functional <url>` | 32 comprobaciones de comportamiento |
| `npm run qa:axe <url>` | Accesibilidad automatizada (WCAG 2.2 AA) |
| `npm run qa:lighthouse <url> <muestras>` | Lighthouse móvil, medianas de N muestras |

La QA se ejecuta contra el **build de producción**, no contra `next dev`:

```bash
npm run build
npx next start --port 4318
npm run qa:functional http://127.0.0.1:4318
```

Para probar otros motores: `QA_BROWSER=firefox` o `QA_BROWSER=webkit`.

---

## Rutas

Locales internos `es-US` / `en-US`; prefijos públicos `/es` y `/en`.
El registro único vive en `i18n/routing.ts` — de ahí salen la navegación, los
canonical, los `hreflang` y el sitemap.

| Página | Español | Inglés |
|---|---|---|
| Inicio | `/es` | `/en` |
| Servicios | `/es/servicios` | `/en/services` |
| Proyectos | `/es/proyectos` | `/en/projects` |
| Detalle de proyecto | `/es/proyectos/[slug]` | `/en/projects/[slug]` |
| Proceso | `/es/proceso` | `/en/process` |
| Nosotros | `/es/nosotros` | `/en/about` |
| Cotización | `/es/cotizacion` | `/en/quote` |
| Contacto | `/es/contacto` | `/en/contact` |
| Legales *(borrador, `noindex`)* | `/es/privacidad`, `/es/terminos` | `/en/privacy`, `/en/terms` |

La raíz `/` redirige con 307 según: prefijo explícito → cookie → `Accept-Language` → idioma por defecto.

---

## Variables de entorno

Ver `.env.example`. Ninguna contiene secretos.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública sin barra final. Alimenta canonical, Open Graph y sitemap. |
| `NEXT_PUBLIC_INDEXABLE` | `"true"` habilita la indexación. **Cualquier otro valor fuerza `noindex` y bloquea robots.txt.** |

> Las variables `NEXT_PUBLIC_*` se incrustan en el bundle **durante el build**:
> deben existir antes de compilar y nunca pueden contener un secreto.

**Reglas por entorno:**

- **Preview / staging:** `NEXT_PUBLIC_INDEXABLE=false`. Impide que una URL provisional
  se indexe y compita después con el dominio real.
- **Producción:** activar la indexación **sólo** cuando existan dominio definitivo,
  contenido verificado y textos legales aprobados.

---

## Cotización — modo desarrollo

El formulario de tres etapas está implementado en la interfaz, pero **no envía nada**:
no hay base de datos, almacenamiento ni proveedor de correo contratados.

La propia página lo declara con un aviso visible. Está prohibido —y hay una prueba
automatizada que lo verifica— mostrar cualquier texto que afirme que la solicitud
se envió, se entregó o se recibió.

Cuando existan los servicios, el diseño previsto es: permiso firmado + `PUT` directo
a almacenamiento privado + verificación de firma de bytes en servidor. Ver
`AUDITORIA_Y_PLAN_AMPARGO.md`.

---

## Despliegue en Vercel

El proyecto usa convenciones estándar de Next.js: **no necesita `vercel.json`**.

1. Importar el repositorio en Vercel.
2. Framework preset: **Next.js** (autodetectado).
3. Node: **22.x**.
4. Variables de entorno por entorno (ver arriba). En *Preview*, `NEXT_PUBLIC_INDEXABLE=false`.
5. `npm ci && npm run build` debe funcionar desde un checkout limpio.

No hay rutas absolutas de Windows en runtime ni dependencias de archivos ignorados
por Git para compilar.

---

## Privacidad de las fotografías

> **Léase antes de publicar o desplegar.**

Las imágenes de `public/images/proyectos/` son **fotografías reales de obras y de
propiedades de clientes**. No son material de stock.

- Sólo se versionan las fotos que la aplicación referencia. El resto está en `.gitignore`.
- Se han **excluido** las fotos con rostros de trabajadores claramente identificables
  mientras no exista consentimiento por escrito.
- Se ha excluido `acabado-01` por incoherencia geográfica: la arquitectura no
  corresponde a Houston y falta confirmación del cliente sobre su autoría.
- Las fotos originales sin comprimir y el material fuente del cliente (PDF del
  formulario de levantamiento, ZIP de imágenes) **nunca deben versionarse**.

Antes de hacer público el repositorio o desplegar, confirmar con el cliente:
consentimiento de las personas que aparecen, autorización de los propietarios y
ausencia de matrículas o direcciones legibles.

---

## Pendientes de producción

| Bloqueo | Impide |
|---|---|
| Dominio no comprado | Indexación, canonical real, Open Graph, correo verificado |
| Plan de hosting no contratado | Despliegue |
| Correo empresarial no definido | Canal de email |
| Sin base de datos ni almacenamiento | Persistencia de cotizaciones y subida real de imágenes |
| Fotos en alta resolución | Nitidez del hero y del portafolio *(las actuales topan en 960 px)* |
| Material antes/después | La sección de mayor conversión en remodelación |
| Política de privacidad aprobada | Publicar un formulario que recoge datos personales |
| Decisión de idioma por defecto | Cerrar `DEFAULT_LOCALE` en `i18n/routing.ts` |

---

## Documentación interna

- `AUDITORIA_Y_PLAN_AMPARGO.md` — auditoría, decisiones y estado detallado.
- `GUIA_PROYECTO.md` — brief del cliente y sistema de diseño.
- `docs/design-references/README.md` — dirección de arte aprobada.
