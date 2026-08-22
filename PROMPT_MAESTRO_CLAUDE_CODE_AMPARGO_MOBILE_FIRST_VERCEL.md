# PROMPT MAESTRO FASE 2 — AMPARGO MOBILE-FIRST + UX + QA + GITHUB/VERCEL

> Pegar completo en una nueva sesión de Claude Code con Opus 5 / Ultracode, abierta en:
>
> `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO`
>
> Repositorio de destino:
>
> `https://github.com/Alexisz3/PAGINA-WEB---AMPARGO-.git`

---

## INICIO DEL PROMPT PARA CLAUDE CODE

Actúa como un equipo senior integrado por **director de arte digital, product designer mobile-first, especialista en UX para servicios locales, frontend architect de Next.js 16, especialista en accesibilidad, performance engineer, QA lead y release engineer para GitHub/Vercel**.

Tu misión es realizar una **segunda pasada de alta exigencia visual y funcional** sobre AMPARGO. La arquitectura multipágina e internacionalizada ya existe; no la reescribas por deporte. Debes mejorar de forma material la experiencia en teléfonos —el canal principal de los visitantes— sin descuidar tablet y escritorio, verificar el resultado con evidencia y dejarlo listo para un flujo seguro GitHub → Vercel.

No te detengas después de auditar o proponer. Inspecciona, implementa, ejecuta pruebas, revisa capturas reales, itera y vuelve a probar. No declares éxito basándote sólo en `build`, conteos de tests o flags: la calidad visual debe comprobarse mirando los píxeles resultantes.

---

## 1. Prioridad absoluta

Distribuye el criterio de calidad de esta fase aproximadamente así:

- **60% diseño visual mobile-first y responsive**;
- **20% experiencia de usuario e interacción táctil**;
- **15% pruebas visuales, funcionales y de accesibilidad**;
- **5% preparación de release GitHub/Vercel**.

La arquitectura, SEO e i18n existentes deben mantenerse sanos, pero no permitas que una refactorización técnica sin impacto perceptible consuma la sesión.

Resultado esperado:

- un visitante desde iPhone o Android comprende en segundos qué hace AMPARGO;
- la fotografía y la obra son protagonistas;
- la página se siente premium, editorial y fluida, no larga, pesada o repetitiva;
- la navegación con el pulgar es cómoda;
- los CTA son visibles pero sutiles;
- el usuario puede explorar trabajos mediante carrusel/galería táctil;
- el formulario se completa sin fatiga ni confusión;
- ES/EN, accesibilidad y reduced motion continúan funcionando;
- las mismas decisiones escalan elegantemente a desktop;
- el proyecto queda versionado de forma segura y preparado para Vercel sin fingir servicios externos.

---

## 2. Lecturas obligatorias antes de editar

Lee completos y respeta:

1. `AGENTS.md`.
2. `CLAUDE.md`.
3. `PROMPT_MAESTRO_CLAUDE_CODE_AMPARGO_CONCEPTO_A.md`.
4. `AUDITORIA_Y_PLAN_AMPARGO.md`.
5. `GUIA_PROYECTO.md`.
6. `docs/design-references/README.md`.
7. `package.json`, `next.config.mjs`, `.env.example`, `.gitignore` y `proxy.ts`.
8. El árbol completo de `app`, `components`, `content`, `i18n`, `lib`, `messages`, `public` y `qa`.
9. Las guías pertinentes de la versión instalada en `node_modules/next/dist/docs/`; este proyecto usa Next.js 16 y no debes asumir APIs antiguas.

Verifica siempre el código actual. El informe incluido más abajo es baseline, no una licencia para repetir conclusiones sin medirlas.

---

## 3. Baseline recibido: compruébalo

La pasada anterior informó:

- sitio disponible localmente en `http://localhost:4318/es` y `/en`;
- Next.js `16.3.2`, React 19, Tailwind 4 y Framer Motion 11;
- `next-intl 4.13.7` compatible con Next 16/React 19;
- 11 rutas por idioma prerenderizadas;
- locales internos `es-US`/`en-US`, prefijos públicos `/es` y `/en`;
- navegación, canonical, hreflang y sitemap derivados de un registro común;
- HTML inicial correctamente localizado sin JavaScript;
- formulario local de tres etapas con Email o WhatsApp, sin fingir envío real;
- `typecheck`, `lint`, `check:i18n` y `build` limpios;
- QA visual anterior 64/64;
- QA funcional anterior 32/32 repetida tres veces;
- contraste corregido del hero: aproximadamente 5.33:1 en titular y 12.31:1 en subtítulo;
- pruebas E2E anteriores sólo en Chromium;
- sin Lighthouse, Firefox, WebKit, dispositivos físicos ni lector de pantalla real;
- dominio, correo, almacenamiento y base de datos todavía pendientes.

Vuelve a comprobarlo. Si una afirmación no se reproduce, regístrala como regresión o evidencia incompleta.

---

## 4. Referencias visuales y capturas que debes mirar

Inspecciona visualmente a tamaño completo:

### Dirección aprobada

- `docs/design-references/concept-a-home-desktop.png`
- `docs/design-references/concept-a-home-mobile-v2.png` — referencia móvil vigente
- `docs/design-references/concept-a-projects-desktop.png`
- `docs/design-references/concept-a-quote-desktop.png`

`concept-a-home-mobile.png` es una V1 archivada. No uses sus dos CTA grandes apilados como referencia.

### Resultado implementado actual

Revisa como mínimo:

- `qa/shots/concepto-a-final/es-home-320x568.png`
- `qa/shots/concepto-a-final/es-home-375x812.png`
- `qa/shots/concepto-a-final/es-home-390x844.png`
- `qa/shots/concepto-a-final/es-home-1440x900.png`
- `qa/shots/concepto-a-final/es-proyectos-375x812.png`
- `qa/shots/concepto-a-final/es-cotizacion-375x812.png`
- equivalentes en inglés;
- estados y páginas que no tengan captura actual, generándolas antes de tocarlas.

### Regla de autoridad

Las referencias fijan intención visual, jerarquía, ritmo y tono. No fijan datos. No transfieras teléfonos, emails, precios, métricas, nombres, garantías, estados o afirmaciones inventadas por los mockups. El comportamiento final lo gobiernan UX, accesibilidad, rendimiento, contenido real y pruebas.

---

## 5. Hallazgos visuales que debes validar y resolver

La inspección actual a 375 px muestra problemas concretos:

1. El home completo ronda los 6000 px de altura y exige demasiado scroll para llegar a la conversión final.
2. Los CTA del hero implementado siguen siendo dos cajas grandes apiladas; no reflejan la V2 aprobada.
3. Los cinco servicios se transforman en cinco bloques verticales altos y visualmente monótonos.
4. Los proyectos destacados se apilan como una lista; no existe la exploración táctil atractiva solicitada.
5. Los bloques de valor se convierten en una columna demasiado extensa.
6. El proceso ocupa mucha longitud y carece de una interacción móvil condensada.
7. La página de proyectos muestra todos los trabajos en una sola columna larga; los filtros no son evidentes en la captura móvil.
8. En Cotización, el resumen oscuro ocupa demasiado espacio y compite con el formulario en vez de asistirlo.
9. Algunos títulos muestran una sombra/desfase rojo-cian parecido a aberración cromática. El gesto se siente áspero y perjudica nitidez; debe eliminarse o reducirse a un detalle imperceptible que no disminuya legibilidad.
10. Footer y bloque final de contacto repiten mucha altura y densidad en cada página.
11. La experiencia visual pasa pruebas automatizadas, pero eso no significa que esté refinada.

No aceptes estos hallazgos ciegamente: mídelo en las capturas y en el navegador. Si un problema ya cambió, documenta la evidencia actual.

---

## 6. Principios mobile-first obligatorios

### 6.1 Diseña desde 320 px hacia arriba

Empieza por 320–430 px. No diseñes desktop y luego apiles todo.

- Usa unidades dinámicas `svh`/`dvh` cuando corresponda.
- Respeta `env(safe-area-inset-*)` en dispositivos con notch/home indicator.
- No fijes alturas que corten contenido en español o inglés.
- No debe existir scroll horizontal del documento.
- Todo control táctil debe tener un área mínima real de 44×44 px.
- El espaciado debe permitir uso con una mano sin inflar innecesariamente la página.
- Usa tipografía fluida con límites concretos.
- Verifica zoom 200%, texto grande y orientación horizontal.
- El contenido esencial debe aparecer en HTML inicial y seguir visible con JavaScript lento o desactivado.

### 6.2 Densidad y ritmo

En móvil, busca una página más corta y escaneable:

- reduce repeticiones;
- muestra resúmenes y enlaza a páginas internas;
- usa carriles horizontales cuando mejoren exploración;
- usa acordeón/disclosure accesible cuando condense información secundaria;
- evita cinco tarjetas gigantes una debajo de otra;
- alterna fotografía, texto y superficies para mantener ritmo;
- no ocultes información crítica sólo para reducir altura;
- no conviertas todo en sliders: cada carrusel debe tener una razón.

### 6.3 Jerarquía de CTA

Dentro del hero móvil:

- `Solicitar cotización` debe ser un botón compacto de 44–48 px de alto y ancho ajustado al texto;
- `Ver proyectos` debe ser un enlace textual secundario con flecha o subrayado fino, sin caja;
- presentarlos en una fila cuando quepan y envolverlos con elegancia cuando no;
- prohibidos dos botones enormes apilados o dos rectángulos de ancho completo;
- la fotografía y el titular deben dominar, no los botones;
- no dupliques inmediatamente otro CTA rojo de ancho completo debajo del hero.

Si incorporas un CTA persistente después del scroll, debe ser fino, contextual, respetar safe area, no tapar contenido/campos y aparecer sólo cuando el CTA del hero dejó de ser visible. Valida que no compita con WhatsApp, menú o teclado virtual.

---

## 7. Rediseño del Home móvil

### 7.1 Header

- Mantén la marca legible sin ocupar demasiado ancho.
- Reduce el selector ES/EN a un control claro pero más ligero.
- Menú de 44×44 px como mínimo, con icono nítido.
- Usa una altura compacta y safe area.
- Al hacer scroll, transición a fondo sólido con borde/sombra mínima.
- Sin salto de layout al cambiar de transparente a sólido.
- Sin robo de foco en carga.
- Menú como diálogo/drawer accesible: foco inicial apropiado, trap, Escape, restauración de foco y bloqueo de scroll.

### 7.2 Hero

- Mantén el impacto de la foto real y `AMPARGO.` monumental.
- Evita cortar el punto de la marca o formar líneas visualmente torpes.
- Corrige cualquier efecto rojo/cian que reduzca nitidez.
- Mantén contraste medido sobre la foto y no oscurezcas tanto que desaparezca la obra.
- Usa `object-position` específico por breakpoint, no un único recorte para todo.
- Contenido principal dentro de la primera pantalla útil, considerando la barra del navegador móvil.
- Implementa exactamente la jerarquía CTA de la V2.
- El siguiente contenido puede insinuarse al final del viewport para comunicar que hay más página.

### 7.3 Servicios

Convierte la lista vertical pesada en un **carril horizontal táctil y accesible** o una solución equivalente compacta:

- una tarjeta principal visible y parte de la siguiente como affordance;
- ancho aproximado 82–88% del viewport;
- `scroll-snap-type`, touch nativo y sin secuestrar scroll vertical;
- numeración o iconografía sobria;
- título, descripción breve y enlace con área táctil correcta;
- flechas sólo cuando aporten, con estado disabled real;
- contador/indicador accesible;
- sin autoplay;
- en reduced motion, sin desplazamientos animados;
- en desktop, conservar la banda editorial de cinco columnas si sigue siendo la mejor solución.

### 7.4 Proyectos destacados

Implementa el carrusel fotográfico protagonista que falta:

- una tarjeta por vez o 1.1 tarjetas visibles en móvil;
- swipe fluido y scroll snap;
- imagen con proporción estable;
- estado/categoría discreto;
- título y ubicación sólo si están verificados;
- CTA a detalle;
- flechas, contador y teclado;
- lightbox accesible opcional para galería;
- no cargar todos los originales por adelantado;
- conservar una retícula editorial de tres columnas en desktop.

### 7.5 Valores

En móvil usa una cuadrícula 2×2 compacta o disclosure equivalente. Reduce copy, conserva títulos claros y evita una tarjeta alta por valor. No uses iconos genéricos sin coherencia de trazo.

### 7.6 Proceso

Reduce la longitud mediante una de estas soluciones, eligiendo por evidencia:

- stepper horizontal con snap y resumen del paso activo;
- acordeón accesible de cinco pasos;
- timeline compacta con el primer paso expandido.

Todos los pasos deben seguir disponibles, ser navegables por teclado y funcionar con JavaScript degradado. En desktop puede conservarse la secuencia horizontal.

### 7.7 CTA y footer

- Fusiona o simplifica repeticiones entre CTA final, datos de contacto y footer.
- Mantén los dos teléfonos confirmados sólo donde aportan.
- `Correo en configuración` debe seguir siendo honesto pero no dominar visualmente.
- Footer móvil compacto, con enlaces agrupados y targets amplios.
- No escondas legal/idioma, pero elimina espacio muerto.

---

## 8. Página de Proyectos móvil

La página debe sentirse como portafolio explorable, no como una lista interminable.

### 8.1 Encabezado y filtros

- Reduce el hero interior a una altura útil.
- Elimina el efecto cromático áspero del título.
- Añade filtros visibles, accesibles y desplazables horizontalmente: Todos, Exteriores, Estructuras, Cocinas, Baños, Interiores u otras categorías realmente presentes.
- Botones/chips con estado seleccionado claro, no dependiente sólo del color.
- Mantén el filtro en query string si ya existe esa arquitectura o si mejora URL compartible.
- Usa una fila sticky sólo si no compite con el header ni roba altura.

### 8.2 Rejilla y carga

- En 320–430 px: una columna con ritmo fotográfico, pero evita descripciones largas repetitivas.
- Considera cards con título/metadata compactos y detalle al tocar.
- En tablet: dos columnas si el ancho real lo permite.
- Desktop: tres columnas equilibradas.
- Usa `content-visibility`, lazy loading y `sizes` correctos cuando sea apropiado.
- Añade paginación, `Cargar más` o render progresivo si reduce coste y longitud; no scroll infinito opaco.
- Preserva URL/foco al volver desde detalle.

### 8.3 Galería/lightbox

- Swipe en móvil, teclado en desktop.
- Diálogo semántico, Escape, trap de foco y devolución al disparador.
- Contador, captions sólo verificados y controles de 44×44 px.
- No usar autoplay.

### 8.4 Antes/después

Mantén el comparador implementado detrás de feature flag mientras no existan pares verificados. No publiques fotos no relacionadas. Si se prueba localmente, usa datos sintéticos claramente excluidos de producción y valida slider por touch, teclado, reduced motion y fallback.

---

## 9. Cotización mobile-first

La cotización debe ser el flujo móvil más cuidado del sitio.

### 9.1 Estructura

- Mantén tres etapas, pero reduce distracción visual.
- Stepper compacto con texto o nombre del paso accesible; los círculos solos no bastan.
- Una sola tarea principal por pantalla/etapa.
- Progreso y datos escritos preservados al volver.
- Campos, labels y mensajes de error claros.
- Teclados móviles apropiados mediante `inputMode`, `type` y `autocomplete`.
- Scroll/foco automático al primer error sin saltos agresivos.
- Botón primario accesible con pulgar; secundario claramente secundario.

### 9.2 Resumen

En 320–767 px, el resumen no debe ocupar un panel oscuro enorme debajo de cada etapa.

Implementa una alternativa como:

- acordeón `Resumen de la solicitud` colapsado por defecto;
- bottom sheet accesible bajo demanda;
- resumen compacto sticky sólo en la etapa final.

Debe anunciar cambios relevantes sin ruido, permitir editar y no tapar campos ni teclado virtual. En desktop puede permanecer en columna lateral sticky.

### 9.3 Referencias de imagen

Mantén la política vigente del proyecto y sus validaciones. UX mínima:

- selector y drag/drop;
- cámara/galería desde móvil cuando el navegador lo soporte;
- previews cuadradas o 4:3 consistentes;
- contador, tamaño, progreso, eliminar y reintentar;
- no guardar blobs grandes en localStorage;
- no afirmar upload real mientras sólo exista modo local;
- HEIC explicado de forma clara si no se procesa;
- no perder el formulario si un archivo falla.

### 9.4 Email o WhatsApp

- Selección mutuamente excluyente con `fieldset`/`legend`.
- Tarjetas/radios compactos y fáciles de tocar.
- Explica qué ocurrirá antes de confirmar.
- Registra la solicitud antes del handoff a WhatsApp cuando exista backend real.
- En modo desarrollo, nunca afirmar que el email o WhatsApp se envió.
- Conserva y amplía la prueba que impide falsos mensajes de éxito.

---

## 10. Desktop y tablet

Mobile-first no significa degradar desktop.

- Conserva el hero cinematográfico y la banda de servicios.
- Refina proporciones a 1024, 1280, 1366, 1440 y 1920 px.
- Evita líneas demasiado largas y espacios verticales vacíos.
- El proyecto destacado debe sentirse editorial, no catálogo e-commerce.
- Cotización desktop usa formulario + resumen lateral con sticky limitado por su contenedor.
- Tablet vertical no debe heredar ni el apilado de móvil estrecho ni una retícula desktop comprimida.
- Verifica que el selector de idioma y navegación no colisionen a 1024/1100 px.
- Mantén la estética carbón/papel/terracota sin convertir cada bloque en tarjeta.

---

## 11. Movimiento y microinteracción

Usa movimiento sólo para reforzar jerarquía y estado:

- entrada sutil de secciones;
- transición corta del header;
- feedback de press/hover/focus;
- desplazamiento del carrusel con física contenida;
- cambio de filtro/proyecto sin flash;
- cambio de etapa del formulario claro;
- lightbox y menús con duraciones cortas.

Prohibido:

- parallax agresivo en móvil;
- animar todos los textos;
- iniciar contenido crítico invisible;
- autoplay de carruseles;
- scroll hijacking;
- efectos glitch/cromáticos sobre titulares;
- animaciones que sigan activas con `prefers-reduced-motion: reduce`.

Prueba reduced motion en el HTML inicial y tras hidratación. El contenido debe ser visible inmediatamente.

---

## 12. Accesibilidad y ergonomía

Apunta a WCAG 2.2 AA y verifica manualmente:

- contraste de texto sobre cada fotografía real;
- foco visible en carbón, papel y terracota;
- navegación sólo con teclado;
- orden de foco coherente;
- skip link;
- headings y landmarks;
- menú, carruseles, lightbox, filtros, acordeones, stepper, uploader y radios;
- targets 44×44 px medidos por bounding box;
- zoom 200% y reflow sin scroll horizontal;
- texto aumentado del sistema;
- labels que no dependan de placeholder;
- errores asociados y anunciados;
- estado activo no dependiente sólo del color;
- lector de pantalla mediante accessibility tree y, si el entorno lo permite, prueba manual real;
- contraste del punto/terracota y metadata pequeña.

Integra `@axe-core/playwright` salvo incompatibilidad concreta documentada. Cero violaciones críticas/serias en páginas y estados principales.

---

## 13. Performance móvil

La pasada anterior no ejecutó Lighthouse. Ahora es obligatorio medir un build de producción.

### 13.1 Procedimiento

1. `npm run build`.
2. Arranca `next start` en un puerto aislado.
3. Ejecuta Lighthouse mobile al menos en `/es`, `/es/proyectos` y `/es/cotizacion`; repite muestras si hay variación.
4. Registra versión, configuración y medianas, no una ejecución afortunada.

### 13.2 Objetivos

Busca, explicando cualquier límite real:

- LCP <= 2.5 s;
- CLS <= 0.1;
- INP/TBT razonable y sin long tasks por animaciones;
- Performance >= 90;
- Accessibility, Best Practices y SEO >= 95;
- ninguna imagen principal enviada con dimensiones absurdamente superiores al viewport;
- JS cliente reducido: Server Components por defecto e islas sólo donde haya interacción.

Optimiza:

- `next/image`, `sizes`, prioridad sólo above-the-fold y calidad racional;
- fuentes mediante `next/font`, subconjuntos y sin FOIT;
- imports dinámicos para lightbox/uploader pesado;
- Framer Motion sólo donde aporte;
- no añadir librerías grandes para carrusel si CSS scroll snap + código pequeño resuelve;
- no falsear calidad ampliando fotos de 960 px; limita encuadre y documenta la necesidad de originales.

---

## 14. QA visual obligatoria

### 14.1 Matriz

Captura páginas clave en ES y EN:

- 320×568;
- 360×800;
- 375×812;
- 390×844;
- 393×852;
- 412×915;
- 430×932;
- 568×320 y 812×375 en landscape;
- 768×1024;
- 1024×768;
- 1280×800;
- 1366×768;
- 1440×900;
- 1920×1080.

Páginas mínimas:

- Home;
- Servicios;
- Proyectos;
- un detalle de proyecto;
- Cotización en las tres etapas;
- menú móvil abierto;
- errores del formulario;
- uploader con previews;
- selector Email/WhatsApp;
- lightbox/carrusel;
- 404 localizada.

### 14.2 Assertions de visibilidad

Añade pruebas que fallen si:

- hay scroll horizontal del documento;
- texto/control sale del viewport;
- dos controles se solapan;
- un target táctil mide menos de 44×44 px;
- un elemento sticky tapa el foco o el botón final;
- hero/header se cortan por safe area;
- una imagen se deforma;
- headings cambian de línea de manera absurda;
- aparece copy del idioma contrario;
- contenido crítico queda `opacity: 0`;
- el footer aparece prematuramente por layout roto;
- un carrusel no deja ver indicio de contenido siguiente;
- el resumen de cotización domina la etapa móvil.

### 14.3 Revisión humana obligatoria

Abre y mira todas las capturas finales. Los scripts no pueden juzgar jerarquía, ritmo o belleza. Para cada página clave escribe una nota de 2–4 líneas sobre:

- primer impacto;
- jerarquía;
- ritmo/longitud;
- claridad de CTA;
- calidad fotográfica;
- coherencia ES/EN;
- diferencias respecto a la referencia aprobada.

No marques QA visual como aprobado sólo porque el script produjo archivos.

---

## 15. QA funcional y navegadores

Ejecuta los flujos críticos contra `next build` + `next start`, no sólo `next dev`, en:

- Chromium;
- Firefox;
- WebKit.

Repite la suite crítica al menos tres veces por navegador o, si el coste es alto, tres veces globales con una justificación y al menos una pasada completa en cada motor.

Flujos mínimos:

1. `/` redirige 307 por cookie/Accept-Language/fallback sin bucles.
2. Selector ES/EN conserva página y entidad dinámica.
3. HTML inicial tiene `lang`, copy y metadata correctos con JavaScript desactivado.
4. Menú móvil abre/cierra, trap de foco, Escape y retorno.
5. Header no salta ni roba foco al cargar/scroll.
6. Carrusel por swipe, botones y teclado.
7. Filtros de proyecto y URL.
8. Lightbox por touch/teclado y retorno de foco.
9. Quote stepper adelante/atrás sin pérdida de datos.
10. Validación y foco al primer error.
11. Archivos válidos y rechazos por cantidad/tamaño/MIME.
12. Eliminar/reintentar preview.
13. Email/WhatsApp mutuamente excluyentes.
14. Ningún mensaje afirma un envío real en modo desarrollo.
15. Popup de WhatsApp bloqueado ofrece fallback sin falso negativo.
16. Reduced motion muestra contenido desde el inicio.
17. 404 localizada.
18. Sin errores de consola, hydration mismatch o requests rotas.

Mantén `npm run check:i18n` y haz que CI falle ante claves, slugs, alternates o rutas inconsistentes.

---

## 16. Fotografías y privacidad antes de GitHub

El repositorio remoto es público. Trátalo como publicación irreversible.

Actualmente existen 29 JPEG en `public/images/proyectos` y material fuente privado fuera de `public`.

Antes de cualquier commit/push:

- comprueba que `Formulario_Requerimientos_Web_Rellenable.pdf`, `imagenes reales.zip`, `_fotos_originales/`, `.env*` reales, capturas QA pesadas y settings locales permanecen ignorados;
- verifica con `git check-ignore` los archivos sensibles;
- no uses `git add .` sin inspeccionar previamente la lista exacta;
- elimina del conjunto publicable cualquier archivo marcado `descartada`, no usado o sin autorización;
- identifica qué imágenes de `public` están realmente referenciadas;
- no subas EXIF/GPS si existiera; analiza y elimina metadata sensible antes de publicar;
- no subas fotos con personas/placas/direcciones identificables sin permiso;
- no añadas los originales de alta resolución al repositorio por defecto; prepara un pipeline de assets optimizados;
- si el permiso de publicación no está confirmado, detén el push y solicita al usuario elegir entre hacer el repo privado, sustituir assets o confirmar derechos.

No interpretes que “las fotos están en `public`” equivale automáticamente a consentimiento legal.

---

## 17. Preparación para Vercel

El objetivo inmediato es GitHub y posteriormente Vercel. El dominio final aún no existe.

### 17.1 Compatibilidad

- Verifica la versión Node recomendada por Next 16 y soportada por Vercel; fija un rango reproducible en `package.json` y, si aporta, `.nvmrc`.
- No agregues `vercel.json` salvo que exista una necesidad concreta; las convenciones de Next deben bastar.
- `npm ci && npm run build` debe funcionar desde un checkout limpio.
- No dependas de archivos ignorados para compilar.
- No uses rutas absolutas de Windows en runtime.
- Distingue Server/Client Components correctamente.
- Revisa que `proxy.ts` y next-intl funcionen en Vercel.

### 17.2 Entornos

Documenta variables en `.env.example` sin valores secretos:

- `NEXT_PUBLIC_SITE_URL`;
- `NEXT_PUBLIC_INDEXABLE`;
- proveedores futuros de email, DB y storage sólo si ya existe contrato de código.

Reglas:

- Preview deployments: `INDEXABLE=false`, robots noindex y canonical coherente;
- Production: no activar indexación hasta tener dominio/contenido/legales aprobados;
- no hardcodear URL localhost ni la futura URL de Vercel;
- si usas variables automáticas `VERCEL_URL`/`VERCEL_PROJECT_PRODUCTION_URL`, valida protocolo y semántica antes de metadata;
- no inventar dominio final.

### 17.3 README y CI

Crea o actualiza `README.md` con:

- descripción;
- stack;
- requisitos Node/npm;
- instalación;
- variables;
- comandos;
- rutas ES/EN;
- QA;
- modo desarrollo de cotización;
- deploy/importación en Vercel;
- pendientes de producción;
- advertencia de privacidad de imágenes.

Añade GitHub Actions CI si no existe:

- checkout;
- setup Node con cache npm;
- `npm ci`;
- typecheck;
- lint;
- check:i18n;
- build;
- pruebas funcionales que sean estables en CI;
- artefactos/capturas sólo en fallos cuando sea razonable.

No añadas secretos al workflow y usa permisos mínimos.

---

## 18. Git seguro y push

El historial global anterior apuntaba a `C:\Users\kevin`, lo cual era peligroso. Nunca operes sobre ese repositorio padre.

Antes de usar Git:

1. `git rev-parse --show-toplevel` debe devolver exactamente la carpeta `NUEVO PROYECTO AMPARGO`.
2. Debe existir un `.git` propio dentro del proyecto.
3. El remote debe ser exactamente:
   `https://github.com/Alexisz3/PAGINA-WEB---AMPARGO-.git`
4. Verifica con `git ls-remote` si el remoto sigue vacío.
5. Nunca uses force push.
6. No hagas reset/clean/checkout destructivo.
7. No borres cambios previos del usuario.

Antes del commit:

- ejecuta suite final limpia;
- inspecciona `git status --short`;
- inspecciona todos los archivos staged;
- busca secretos y datos privados;
- verifica `.gitignore`;
- evita `.next`, `node_modules`, screenshots pesados, archivos fuente privados, `.env` real y artefactos temporales;
- confirma el conjunto de fotografías autorizadas.

Commit sugerido, si el remoto continúa vacío:

`feat: build mobile-first bilingual Ampargo website`

Después:

- usa branch principal `main`;
- añade `origin` con la URL exacta;
- push normal con upstream;
- confirma el commit remoto mediante `git ls-remote` o `gh repo view`;
- entrega URL del repositorio y SHA;
- no despliegues todavía a Vercel salvo petición explícita posterior.

Si el remoto deja de estar vacío, detente antes de mezclar historias o sobrescribir contenido; inspecciona y plantea una integración segura.

---

## 19. Plan de ejecución obligatorio

Mantén un plan vivo con una sola fase `in_progress`.

### Fase 0 — Seguridad y baseline

1. Lee instrucciones/documentos.
2. Verifica Git root/remote sin mutar.
3. Ejecuta baseline completo.
4. Arranca una sola instancia controlada.
5. Captura los estados actuales faltantes.
6. Inspecciona las referencias y screenshots.
7. Registra fallos visuales concretos.

### Fase 1 — Foundations móviles

1. Audita tokens, tipografía, tamaños, grid y breakpoints.
2. Elimina aberración cromática/glitch de headings.
3. Corrige safe area, header y CTA del hero según V2.
4. Verifica 320/375/390/430 antes de continuar.

### Fase 2 — Home mobile-first

1. Carril de servicios.
2. Carrusel de proyectos.
3. Valores compactos.
4. Proceso condensado.
5. CTA/footer más eficiente.
6. Ajuste equivalente de tablet/desktop.

### Fase 3 — Proyectos y detalles

1. Filtros visibles.
2. Cards/retícula responsive.
3. Galería/lightbox.
4. Carga/performance.
5. Estado/foco/URL.

### Fase 4 — Cotización

1. Stepper móvil.
2. Resumen colapsable/adaptativo.
3. Inputs y teclado.
4. Uploader visual.
5. Canal final.
6. Errores y persistencia local honesta.

### Fase 5 — Accesibilidad, motion y performance

1. Axe/manual.
2. Reduced motion.
3. Lighthouse producción.
4. Imágenes/fuentes/JS.

### Fase 6 — QA multiplataforma

1. Capturas completas.
2. Revisión humana de cada captura.
3. Chromium/Firefox/WebKit.
4. Tres pasadas críticas.
5. Corrige flakiness real, no aumentes timeouts sin causa.

### Fase 7 — GitHub/Vercel readiness

1. Revisa privacidad/assets.
2. README/CI/env.
3. Checkout/build limpio.
4. Commit/push seguro sólo con autorización de fotos confirmada.
5. Verifica remoto.

---

## 20. Criterios de aceptación

No declares la fase completa hasta que:

- el hero móvil implementa la jerarquía CTA de la V2;
- el usuario ve propuesta, trabajo real y siguiente acción sin atravesar bloques monótonos;
- servicios y proyectos tienen exploración táctil real;
- el home móvil es materialmente más corto o más eficiente, con comparación medida;
- no hay efecto cromático que reduzca legibilidad;
- filtros de proyectos son visibles y usables;
- Cotización se completa cómodamente a 320–430 px y el resumen no domina;
- menú, carruseles, filtros, acordeones, lightbox, stepper y uploader son accesibles;
- no hay overflow, solapamientos ni targets pequeños;
- ES y EN mantienen calidad visual equivalente;
- desktop/tablet no sufren regresiones;
- reduced motion funciona;
- `typecheck`, `lint`, `check:i18n`, `build` y E2E pasan;
- Chromium, Firefox y WebKit fueron ejecutados o una incompatibilidad concreta está documentada;
- Lighthouse móvil se midió con build de producción;
- capturas finales fueron revisadas por una persona/agente visualmente;
- el repo no contiene secretos, material privado ni artefactos pesados;
- el remoto recibió un push normal verificable, sólo si los permisos de imágenes están confirmados;
- no se afirmó que Email/WhatsApp/DB/storage funcionan en producción cuando siguen pendientes.

---

## 21. Informe final requerido

Entrega:

1. **Resultado visual:** diferencias antes/después, especialmente móvil.
2. **Métricas de longitud/densidad:** altura del home a 375 px antes/después y secciones condensadas.
3. **Interacciones:** carruseles, filtros, menú, lightbox y cotización.
4. **Accesibilidad:** axe y pruebas manuales.
5. **Performance:** Lighthouse, LCP/CLS/TBT y limitaciones.
6. **QA:** comandos, cantidad, viewports, navegadores y repeticiones.
7. **Evidencia:** rutas a capturas principales.
8. **Regresiones encontradas y corregidas.**
9. **GitHub:** rama, SHA, remote y URL, si se hizo push.
10. **Vercel:** estado de preparación y variables pendientes; no afirmar deploy si no se hizo.
11. **Privacidad:** qué fotos se incluyeron/excluyeron y con qué criterio.
12. **Bloqueos reales:** dominio, correo, DB, storage, legales, fotos originales/permisos.
13. **Siguiente paso único recomendado.**

No cierres con “todo se ve bien”. Incluye evidencia verificable. Si una prueba no se ejecutó, dilo de forma directa.

Empieza ahora por la lectura, baseline y revisión visual. Continúa con la implementación segura y no te detengas después del plan.

## FIN DEL PROMPT PARA CLAUDE CODE
