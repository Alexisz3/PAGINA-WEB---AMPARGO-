# AUDITORÍA FASE 3 — AMPARGO

Fecha: 22 de agosto de 2026  
Alcance: navegación de servicios, selector ES/EN, deployment Vercel, Git/privacidad y regresión general.  
Estado: auditoría de sólo lectura; no se modificó código de la aplicación, no se hizo push ni deployment.

## Resumen ejecutivo

La Fase 2 mejoró de forma verificable el diseño mobile-first, densidad, accesibilidad y QA. Los problemas actuales no justifican rehacer el sitio. Existen, sin embargo, cuatro frentes pendientes:

1. **Vercel no puede compilar el commit remoto actual** porque recibe una URL de sitio vacía.
2. **Las tarjetas de servicios no tienen destinos específicos** y la ruta de detalle devuelve 404.
3. **El selector ES/EN no preserva contexto en rutas dinámicas ni filtros**.
4. **Dos fotografías retiradas siguen en el historial del repositorio público**.

La prioridad recomendada es: privacidad → corrección local de servicios/i18n/Vercel → auditoría de regresión → decisión de push/redeploy.

## Estado Git

```text
HEAD local:    3b615aa
Commit local:  dd9d535
origin/main:   d7f1b74
Ahead/behind:  0 / 2
```

Los dos commits de Fase 2 permanecen únicamente en local. Vercel intentó desplegar `d7f1b74`, no el rediseño actual.

## Hallazgos

### P0 — Fotografías identificables en historial público

Archivos:

- `public/images/proyectos/cocina-cuarzo-04.jpeg`
- `public/images/proyectos/cocina-cuarzo-06.jpeg`

Ambos fueron retirados del árbol actual en `dd9d535`, pero permanecen descargables desde el commit público `d7f1b74`. Un commit de borrado no elimina objetos del historial.

Impacto:

- exposición potencial sin consentimiento documentado;
- el futuro push no resuelve por sí solo la exposición anterior;
- deployments/caches externos pueden conservar copias.

Decisión requerida:

- poner el repositorio en privado temporalmente;
- o autorizar una reescritura exacta del historial;
- o confirmar documentalmente derechos de publicación.

No se recomienda ningún push nuevo hasta tomar esa decisión.

### P0 — Deployment de Vercel fallido

Deployment:

```text
dpl_4RNHVdHdhdztKZTsBgM3jNrf8oai
commit d7f1b74
```

Log relevante:

```text
TypeError: Invalid URL
app/[locale]/layout.tsx:56
metadataBase: new URL(SITE_URL)
input: ''
```

Causa confirmada:

- Vercel tiene `NEXT_PUBLIC_SITE_URL` configurada como cadena vacía.
- `lib/site.ts` usa `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`.
- `??` no reemplaza `""`.
- `new URL("")` falla durante prerender de `/es-US`.

Corrección requerida:

- normalizar/validar la variable;
- tratar vacío/espacios como ausente;
- usar una URL de Vercel válida como fallback de Preview;
- garantizar que `metadataBase` siempre reciba URL HTTP(S) absoluta;
- añadir pruebas con variable ausente, vacía, espacios, válida e inválida;
- corregir o eliminar el valor vacío del dashboard sólo después de autorización de release.

### P1 — Las cinco tarjetas de servicio terminan en el mismo sitio

Evidencia en `components/home/ServiceCards.tsx`:

```tsx
href="/services"
```

Resultado inspeccionado en el navegador:

```text
Construcción personalizada → /es/servicios
Remodelaciones             → /es/servicios
Cocinas y baños            → /es/servicios
Espacios exteriores        → /es/servicios
Reparaciones y mejoras     → /es/servicios
```

La ruta `app/[locale]/services/[slug]/page.tsx` existe, pero ejecuta `notFound()` de forma incondicional.

Recomendación:

- crear `content/services.ts` con ID y slugs localizados;
- implementar cinco detalles reales ES/EN;
- enlazar cada tarjeta a su detalle;
- añadir proyectos relacionados y CTA a cotización preseleccionada;
- no inventar licencias, precios, plazos o garantías.

### P1 — Cambio de idioma rompe rutas dinámicas

Caso reproducido:

```text
/es/proyectos/renovacion-de-cocina
→ pulsar EN
/en/projects/renovacion-de-cocina
→ 404
```

Destino esperado:

```text
/en/projects/kitchen-renovation
```

Causa:

- el componente reutiliza el valor actual de `[slug]`;
- next-intl conoce el patrón `/projects/[slug]`, pero no sabe que dos slugs editoriales representan el mismo `project.id`;
- la traducción de entidad debe resolverse mediante `content/projects.ts`.

### P1 — El selector pierde filtros

Caso reproducido:

```text
/es/proyectos?categoria=cocinas
→ pulsar EN
/en/projects
```

Se pierde `?categoria=cocinas`.

Recomendación:

- resolvedor de destinos localizado y tipado;
- preservar query strings permitidas;
- usar IDs de filtro estables;
- conservar hash cuando sea funcional;
- nunca usar el home como fallback silencioso.

### P1 — Posible pérdida de estado en Cotización

El selector actual navega mediante `router.replace`, pero no define un contrato para conservar:

- etapa activa;
- campos escritos;
- servicio preseleccionado;
- referencias seleccionadas.

Debe probarse expresamente. La solución no debe guardar blobs grandes ni PII en la URL.

### P2 — Versión Node demasiado abierta

Estado:

```text
.nvmrc: 22
package.json engines.node: >=20.9.0
```

Vercel advierte que el rango abierto actualizará automáticamente a futuros majors. Conviene alinear `package.json`, CI y Vercel con Node `22.x`, después de verificar soporte vigente.

### P2 — El deployment remoto no contiene la Fase 2

El error visible en Vercel pertenece a `d7f1b74`. Los cambios mobile-first, retiro de fotos, CI, `.nvmrc`, Axe y mejoras de QA están en dos commits locales no publicados.

No debe evaluarse la calidad del sitio desplegado como si representara el estado local actual.

## Comprobaciones positivas

- La arquitectura multipágina ES/EN existe.
- El selector sí conserva algunas rutas estáticas como Proyectos y Cotización.
- Las entidades de proyecto ya tienen ID estable y slugs ES/EN.
- El rediseño mobile-first redujo longitud y densidad.
- La Fase 2 reporta pruebas en Chromium, Firefox y WebKit.
- Las dos fotos identificables ya no están en el árbol local actual.
- PDF, ZIP, originales y material local continúan ignorados.
- El efecto cromático denunciado anteriormente no se reproduce en código ni ampliación visual; no debe “corregirse” algo inexistente.

## Matriz mínima para la corrección

### Servicios

- 5 tarjetas con 5 URLs únicas.
- 5 detalles × 2 idiomas = 10 páginas válidas.
- Metadata/canonical/hreflang propios.
- CTA con servicio preseleccionado.

### Idioma

- estáticas;
- proyecto dinámico ida/vuelta;
- servicio dinámico ida/vuelta;
- filtros preservados;
- Cotización sin pérdida de estado;
- ninguna caída inesperada a Home o 404.

### Vercel

- build con URL ausente;
- build con URL vacía;
- build con espacios;
- build con URL válida;
- fallback Vercel sin protocolo;
- Preview noindex;
- Node alineado.

### Regresión

- typecheck;
- lint;
- check:i18n;
- build;
- Chromium/Firefox/WebKit;
- axe;
- capturas mobile/tablet/desktop;
- Lighthouse;
- checkout limpio.

## Orden de trabajo recomendado

1. Mantener remoto sin cambios.
2. Implementar localmente modelo/páginas de servicios.
3. Corregir selector contextual.
4. Corregir resolución de `SITE_URL` y Node.
5. Ejecutar auditoría completa.
6. Presentar decisión de privacidad.
7. Sólo después, push y nuevo deployment Vercel autorizados.

## Prompt operativo

Las instrucciones completas para Claude Code están en:

`PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_FASE_3_SERVICIOS_I18N_VERCEL.md`
