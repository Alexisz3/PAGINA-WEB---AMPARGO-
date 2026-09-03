# PROMPT MAESTRO FASE 5 — REBRANDING DE COLOR Y REDISEÑO VISUAL COMPLETO

> Pegar completo en una nueva sesión de Claude Code con Opus 5 / Ultracode, abierta en:
>
> `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO`
>
> Repositorio remoto:
>
> `https://github.com/Alexisz3/andrade-parra-corporation.git`
>
> Este prompt referencia un mockup de 6 páginas ("REDISEÑO DE PÁGINAS WEB — VISTAS GENERALES") que el responsable adjuntó en el chat. Pídele la imagen si no la tienes a la vista — es la referencia visual obligatoria de esta fase.

---

## INICIO DEL PROMPT PARA CLAUDE CODE

Actúa como un equipo senior integrado por **director de arte, ingeniero frontend Next.js/Tailwind, especialista en accesibilidad, y auditor de contenido**.

Tu misión: llevar el sitio de AMPARGO al lenguaje visual del mockup adjunto — fondo oscuro corrido en todas las páginas y acento en naranja vivo, reemplazando la paleta actual (azul marino / rojo ladrillo `#B8452F` sobre fondo alterno claro-oscuro). Es un **cambio de identidad de color**, no solo de layout: el logo, el manual de marca y las seis páginas del sitio se actualizan juntos.

No es un rediseño libre. Cuatro decisiones ya están tomadas — no las reabras:

1. **Ninguna estadística inventada.** El mockup muestra "+10 años de experiencia", "200+ proyectos completados", "100% clientes satisfechos". El cliente (Jose) **no ha confirmado ninguno de esos números**. Donde el mockup pone una cifra, tú pones un marcador visible entre corchetes (mismo patrón que ya usa `docs/TEXTOS_A_REVISAR.md` y los comentarios de `content/services.ts`), nunca el número del mockup. Si el bloque de estadísticas queda visualmente pobre con marcadores, usa buen criterio de diseño para resolverlo (p. ej. una sola cifra real y verificable — número de servicios, ciudades del área de servicio — en vez de tres inventadas), pero nunca inventes.
2. **Sin mapa con pin de dirección.** La página de Contacto del mockup muestra un mapa con una ubicación específica en Houston. `SERVICE_AREA.hasPublicOffice` es `false` — no hay oficina pública confirmada — y ese comportamiento ya está probado en `qa/functional.mjs` ("Zona de servicio: ... no publica calle ni código postal"). Rediseña esa sección de Contacto sin mapa ni dirección puntual. Si `hasPublicOffice` cambia en el futuro, el mapa vuelve solo — no lo fuerces ahora.
3. **Fotos reales, no de stock.** El mockup usa fotografías genéricas de catálogo. Sustituye cada foto por las fotos reales ya catalogadas en `content/projects.ts` (los 7 proyectos) y las imágenes de servicio ya usadas en el sitio. No incorpores ninguna imagen nueva de stock.
4. **El copy real, no el del mockup.** Frases como "Diseño moderno, profesional y enfocado en convertir visitas en clientes" o "Ofrecemos soluciones integrales..." son placeholder del propio mockup — genéricas, del tipo que las Prioridades 1-4 de `docs/TEXTOS_A_REVISAR.md` pasaron horas retirando del sitio real. Usa el copy YA auditado que vive en `messages/es-US.json` / `messages/en-US.json`, relayado dentro de la composición nueva. Si una sección del mockup no tiene equivalente en el copy actual y hace falta texto nuevo, escríbelo seleccionado con el mismo criterio que ya aplicaste en las Prioridades 1-4 (concreto, verificable, sin superlativos) y añádelo a `docs/TEXTOS_A_REVISAR.md` como nueva entrada para que el responsable lo revise, no lo publiques sin pasar por ese registro.

**Regla de contenido, sigue vigente en toda esta fase:** nada de licencias, permisos, certificaciones, años de experiencia, número de obras, garantías, precios, plazos fijos ni disponibilidad, salvo lo ya confirmado.

---

## 1. Lee antes de tocar nada

- `docs/brand/README.md` completo — vas a reescribir la sección de paleta y necesitas entender qué más depende de ella (contrastes medidos, usos prohibidos, construcción del isotipo).
- `qa/build-brand.mjs` — genera los SVG/PNG del logo desde constantes de color; el acento nuevo se cambia ahí, no a mano en cada SVG.
- `components/BrandLogo.tsx` — debe espejar exactamente lo que genere `build-brand.mjs`.
- `app/[locale]/layout.tsx`, y las hojas de estilos/tokens de color que uses en Tailwind (busca dónde están definidos `carbon`, `paper`, `accent`, `ink`, `bone`, etc. — son los nombres de token ya usados en todo el código, no inventes nombres nuevos).
- `content/projects.ts`, `content/services.ts` — fuente real de fotos y datos.
- `docs/TEXTOS_A_REVISAR.md` — formato ya establecido para registrar copy nuevo pendiente de revisión.
- `messages/es-US.json`, `messages/en-US.json` — copy real vigente.
- `qa/functional.mjs` — pruebas existentes que no puedes romper (zona de servicio, 404, i18n, formulario, visor de imágenes, canal de correo).

---

## 2. Paleta nueva

**Punto de partida** (estímalo por tu cuenta contra el mockup adjunto — mi lectura visual es aproximada, no un valor calibrado):

| Uso | Aproximado | Nota |
|---|---|---|
| Fondo oscuro (ahora persistente, no alterno) | Reutiliza el carbón ya existente, `#121412`, o ajústalo ligeramente si el mockup se ve más negro puro | Ya está en el sistema; probablemente no haga falta un valor nuevo |
| Acento naranja | Rango `#E85D2C`–`#F0692A` a ojo | **Confirma el tono exacto comparando contra el mockup**, no publiques sin esa verificación visual |
| Texto sobre oscuro | Reutiliza el "bone"/marfil cálido ya existente para texto, no blanco puro | Mantiene coherencia con lo ya construido |

**Reglas duras:**

- El naranja reemplaza al rojo ladrillo `#B8452F` como acento principal **en todo el sitio y en el logo**. No mantengas los dos acentos compitiendo.
- Verifica contraste AA (4.5:1 texto normal, 3:1 texto grande/UI) del naranja sobre el fondo oscuro nuevo, y de cualquier texto oscuro que uses sobre naranja en botones — el naranja vivo sobre negro casi puro puede fallar contraste en texto pequeño; si falla, sube la luminosidad del naranja hasta pasar, no bajes el estándar.
- Reescribe la tabla de paleta y la sección de contrastes medidos en `docs/brand/README.md` con los valores finales reales, no los de esta tabla aproximada.
- Actualiza `qa/build-brand.mjs` (la constante de acento) y regenera `public/brand/*` y `app/icon.svg`. El isotipo mantiene la geometría "ensamble redondeado" ya aprobada — cambia el color, no la forma.
- Revisa `docs/brand/README.md §Usos prohibidos` — sigue prohibido cualquier color fuera de la paleta nueva una vez la definas.

---

## 3. Página por página

Para cada página: toma la **composición** del mockup (jerarquía, agrupación, qué va arriba/abajo, la cuadrícula de servicios, el bloque de 4 iconos de confianza, la línea de tiempo del proceso, la cuadrícula de proyectos con filtros) y constrúyela con los **tokens de color nuevos**, el **copy real**, y las **fotos reales**.

### Inicio
Hero con foto real de proyecto (no la genérica del mockup), banda de 4 iconos de confianza — usa `trustServiceArea`, `trustResidentialCommercial`, `trustFreeEstimates`, `trustBilingual`, que ya existen en `messages/*.json` y son datos reales, no los 4 iconos inventados del mockup ("Calidad garantizada", "Experiencia local", "Cumplimos tiempos", "Atención personalizada" — dos de esos cuatro son promesas no verificables, revísalos contra la regla de contenido antes de reusar la idea).

### Servicios
Los 5 servicios de `ServiceCards` ya calzan exactamente con las 5 tarjetas del mockup. Usa las imágenes reales ya asociadas a cada servicio.

### Proyectos
Cuadrícula con filtros — ya existe como funcionalidad (`filterAll`, `filterKitchens`, etc.) y como visor de imágenes ampliado (Sección 10 de la Fase 4, no lo rompas). Aplica la composición visual del mockup sobre esa funcionalidad existente, no la reconstruyas desde cero.

### Proceso
Los 5 pasos ya existen (`step1Title`...`step5Title`, con sus `Body`). Aplica la línea de tiempo horizontal del mockup.

### Nosotros
Aquí vive el bloque de estadísticas — resuélvelo según la Sección 2 de este documento (restricción 1: sin inventar). El resto (misión/visión/valores) ya tiene contenido real en `About.*`.

### Contacto
Sin mapa ni dirección puntual (restricción 2). El formulario de cotización y los datos de contacto reales (teléfonos, correo `contacto@ampargo.com`, zona de servicio) sí van — ya existen y funcionan.

---

## 4. Lo que NO se toca

- El modelo de contenido (`content/*.ts`) y las claves de `messages/*.json` — se **usan**, no se reescriben salvo lo indicado en la restricción 4.
- El comportamiento ya construido y probado: formulario de cotización de 2 etapas con reparto 50/50 y canal de correo real, visor de imágenes con foco atrapado, menú móvil, 404 con marca, `og:image`, JSON-LD de zona de servicio.
- La estructura de rutas e i18n (`i18n/routing.ts`).
- Accesibilidad ya lograda: objetivos táctiles ≥44px, `prefers-reduced-motion`, foco visible, `role="alert"` en errores, lector de pantalla. El cambio de paleta **no puede** degradar ninguna de estas — vuelve a correr `qa:axe` al final.

---

## 5. Pruebas de aceptación obligatorias

1. `npm run typecheck`, `npm run lint`, `npm run build` en verde.
2. `npm run check:i18n` sin divergencias.
3. `npm run qa:functional` — las 97 comprobaciones actuales siguen en verde (ajusta solo las que dependan de texto que tú mismo cambiaste a propósito, documentando por qué, igual que se hizo al conectar el canal de correo).
4. `npm run qa:axe` sin regresiones de contraste ni de accesibilidad con la paleta nueva.
5. Ningún número de estadística sin verificar aparece en el HTML final — grep manual de "años", "proyectos completados", "% clientes" antes de dar por cerrada la fase.
6. Ninguna referencia a mapa/dirección puntual en `/contacto` — reutiliza la prueba ya existente de "Zona de servicio... no publica calle ni código postal", no la borres.
7. Cero imágenes de `public/` nuevas que no vengan de las 7 fotos de proyecto ya versionadas — si hace falta una imagen que no existe, dilo en el informe final en vez de generar o inventar una.
8. Captura visual de las 6 páginas, desktop y móvil (375px), en los dos idiomas para el encabezado/CTA principal al menos.
9. El logo regenerado (`public/brand/*`, `app/icon.svg`) usa el nuevo acento y la misma geometría aprobada.
10. `docs/brand/README.md` queda con la paleta y los contrastes reales, no los aproximados de este documento.

---

## 6. Release

Mismo criterio que las fases anteriores: rama nueva (`fase-5-rediseno-visual` o similar), nunca commits directos sobre `main` — Hostinger despliega automáticamente en cada push a `main`. PR con evidencia visual adjunta, no solo texto. No fusiones hasta que la Sección 5 esté completa.

## 7. Informe final

Al terminar: qué se implementó, decisiones de color final con hex exactos y su justificación de contraste, qué texto nuevo quedó registrado en `docs/TEXTOS_A_REVISAR.md` pendiente de revisión, capturas de las 6 páginas en ambos idiomas y ambos anchos de viewport, y resultado de las 10 pruebas de aceptación.
