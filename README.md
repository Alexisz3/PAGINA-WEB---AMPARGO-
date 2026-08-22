# AMPARGO Website

Sitio web multipágina y bilingüe para AMPARGO, empresa de construcción y remodelación en Houston. Construido con Next.js 16, React 19, TypeScript, Tailwind CSS 4 y `next-intl`.

## Estado

La interfaz institucional, las rutas ES/EN y el flujo visual de cotización funcionan localmente. El envío real de cotizaciones por email, la persistencia y el almacenamiento privado de imágenes siguen pendientes de proveedores y credenciales del cliente; la aplicación no finge que esos servicios están conectados.

El dominio final tampoco está definido. Los despliegues provisionales deben permanecer con `NEXT_PUBLIC_INDEXABLE=false`.

## Requisitos

- Node.js 20.9 o superior compatible con Next.js 16
- npm

## Desarrollo local

```bash
npm ci
npm run dev
```

Abrir:

- Español: `http://localhost:3000/es`
- English: `http://localhost:3000/en`

## Variables de entorno

Copiar `.env.example` a `.env.local` y ajustar únicamente valores locales:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INDEXABLE=false
```

Nunca guardar secretos en variables `NEXT_PUBLIC_*` ni versionar archivos `.env` reales.

## Verificación

```bash
npm run typecheck
npm run lint
npm run check:i18n
npm run build
npm run qa:functional
npm run qa:visual
```

Las capturas de QA se generan localmente y están excluidas de Git.

## Rutas principales

Cada página tiene variante bajo `/es` y `/en`:

- Inicio
- Servicios y detalles
- Proyectos y detalles
- Proceso
- Nosotros
- Cotización
- Contacto
- Privacidad y términos provisionales

## Cotización

El formulario presenta tres etapas, referencias visuales y selección exclusiva entre Email o WhatsApp. En el estado actual opera como demostración local: permite validar y previsualizar, pero no envía mensajes, no almacena archivos en un proveedor privado y no debe presentarse como sistema de producción.

## Fotografías

El repositorio incluye únicamente fotografías utilizadas por la interfaz. Los originales, archivos descartados, ZIP, formularios del cliente y material no seleccionado están excluidos. Antes de activar un dominio público se deben confirmar permisos de publicación y solicitar originales de mayor resolución.

## Vercel

1. Importar `Alexisz3/PAGINA-WEB---AMPARGO-` desde Vercel.
2. Mantener el framework detectado como Next.js.
3. Configurar `NEXT_PUBLIC_SITE_URL` con la URL del entorno correspondiente.
4. Mantener `NEXT_PUBLIC_INDEXABLE=false` en Preview y hasta disponer del dominio/contenido legal definitivo.
5. Ejecutar un despliegue de prueba y repetir QA sobre la URL de Preview.

No se necesita `vercel.json` para la configuración actual.

## Documentación para la siguiente fase

- `PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_MOBILE_FIRST_VERCEL.md`: auditoría y rediseño mobile-first, QA multiplataforma y preparación de release.
- `PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_CONCEPTO_A.md`: especificación integral del Concepto A.
- `docs/design-references/`: referencias visuales aprobadas.
