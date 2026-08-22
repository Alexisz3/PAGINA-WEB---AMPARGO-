# PROMPT MAESTRO — AMPARGO CONCEPTO A

> Diseñado para pegarse completo en una nueva sesión de Claude Code con Opus 5 / Ultracode, abierta en:
>
> `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO`

---

## INICIO DEL PROMPT PARA CLAUDE CODE

Actúa como un equipo senior integrado por dirección de arte digital, product design, UX, arquitectura frontend, backend, accesibilidad, performance, SEO técnico, seguridad de cargas de archivos y QA. Tu misión es **auditar, rediseñar e implementar localmente AMPARGO como un sitio web multipágina profesional, bilingüe y visualmente excepcional**, tomando como norte estético el **Concepto A — Monolithic Editorial** que ya fue aprobado.

No te limites a producir una auditoría, un plan o una maqueta. Después de inspeccionar y documentar lo necesario, implementa de forma iterativa todo el trabajo local que sea seguro y verificable. No declares que algo está terminado si sólo existe visualmente, si depende de datos inventados o si no superó pruebas reales.

### Resultado principal esperado

Al finalizar debe existir una web multipágina coherente y responsive, no una landing page larga, que:

- eleve sustancialmente el diseño visual y la percepción profesional de AMPARGO;
- use el Concepto A como sistema, no como una copia superficial de una sola captura;
- tenga rutas independientes para Inicio, Servicios, Proyectos, Proceso, Nosotros, Cotización y Contacto;
- tenga español e inglés correctamente estructurados por URL, con contenido y metadatos localizados;
- incorpore carruseles/galerías de proyectos atractivos pero accesibles;
- incorpore un comparador interactivo de antes/después sólo cuando existan pares verificables;
- permita adjuntar imágenes de referencia al solicitar una cotización;
- obligue al usuario a escoger **un solo canal final: Email o WhatsApp**;
- registre la solicitud antes de entregar el flujo a WhatsApp;
- prepare la arquitectura 3D como producto separado y conectable, sin cargar el sitio principal con Three.js;
- quede validada con pruebas funcionales, visuales y de accesibilidad, no sólo con `build`.

---

## 1. Reglas de operación y autoridad

### 1.1 Lee antes de editar

Antes de modificar código:

1. Confirma que estás en el directorio exacto del proyecto.
2. Lee completos `AGENTS.md`, `CLAUDE.md`, `GUIA_PROYECTO.md` y `AUDITORIA_Y_PLAN_AMPARGO.md`.
3. Inspecciona `package.json`, `next.config.mjs`, `tsconfig.json`, `.env.example`, el árbol de `app/`, `components/`, `content/`, `lib/`, `public/` y `qa/`.
4. Debido a que este proyecto usa Next.js 16 y sus convenciones pueden diferir de versiones anteriores, lee las guías relevantes instaladas en `node_modules/next/dist/docs/` antes de escribir o mover código.
5. Verifica cada conclusión antigua de la auditoría contra el estado actual. La auditoría es contexto útil, no una verdad eterna.
6. Haz inventario de cambios ya existentes. No borres, reviertas ni sobrescribas trabajo del usuario que no pertenezca a esta misión.

### 1.2 Prioridad de fuentes

En caso de conflicto, usa este orden:

1. instrucciones locales vigentes de `AGENTS.md`;
2. requisitos explícitos de este prompt;
3. código y datos reales comprobados en el repositorio;
4. documentación local de la versión instalada de Next.js y documentación oficial pertinente;
5. `GUIA_PROYECTO.md` y `AUDITORIA_Y_PLAN_AMPARGO.md` como antecedentes;
6. imágenes conceptuales sólo para dirección visual.

### 1.3 Límites de autorización

Sí estás autorizado a:

- editar el proyecto local;
- crear componentes, páginas, contenido borrador claramente marcado, pruebas y documentación;
- instalar dependencias estrictamente necesarias después de comprobar compatibilidad y justificar cada una;
- ejecutar servidor local, lint, TypeScript, build, Playwright, auditorías y capturas;
- preparar adaptadores simulados y contratos para servicios externos todavía no disponibles.

No estás autorizado a:

- comprar dominio, hosting, correo, base de datos, almacenamiento o API;
- desplegar a producción;
- modificar DNS;
- enviar correos o mensajes reales;
- publicar fotografías sin consentimiento confirmado;
- inventar credenciales, números, certificaciones, licencias, premios, garantías, métricas o testimonios;
- ejecutar operaciones destructivas de Git o del sistema;
- hacer commits mientras el repositorio no tenga una raíz Git correcta y aislada.

### 1.4 Git: advertencia operativa crítica

La auditoría previa detectó que la raíz Git podía apuntar a `C:\Users\kevin` en lugar de este proyecto. Vuelve a comprobarlo con comandos de sólo lectura. Si la raíz sigue siendo incorrecta:

- no hagas `git add`, `git commit`, `git checkout`, `git reset`, `git clean`, rebase ni operaciones equivalentes;
- trabaja directamente sobre los archivos locales;
- documenta el bloqueo y recomienda inicializar posteriormente un repositorio propio en la carpeta AMPARGO, sin hacerlo silenciosamente.

---

## 2. Hechos conocidos que debes verificar

El estado observado antes de esta sesión era:

- Next.js `16.3.2`;
- React `19.x`;
- TypeScript;
- Tailwind CSS `4.x`;
- Framer Motion `11.x`;
- Playwright instalado;
- aproximadamente 29 fotografías en `public/images/proyectos`;
- muchas fotos actuales no superan aproximadamente 960 px y proceden de mensajería;
- el dominio, plan exacto de Hostinger, correo empresarial, almacenamiento y base de datos siguen pendientes del cliente;
- el formulario actual sólo encaminaba a WhatsApp y existía un falso negativo relacionado con `window.open(..., 'noopener,noreferrer')`;
- existía un componente de antes/después todavía no integrado de forma segura;
- la navegación móvil había mostrado un problema de foco al montar;
- las pruebas de movimiento reducido habían sido inestables;
- `lint`, TypeScript y `build` habían llegado a pasar, pero eso no acredita por sí solo calidad visual ni producción.

No repitas estas frases como certeza sin comprobar el repositorio. Registra en tu informe qué sigue vigente, qué cambió y qué era falso o incompleto.

---

## 3. Referencias visuales aprobadas

Lee primero:

`C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO\docs\design-references\README.md`

Inspecciona visualmente, a tamaño completo, estas cuatro imágenes:

1. Portada desktop:
   `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO\docs\design-references\concept-a-home-desktop.png`
2. Portada móvil:
   `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO\docs\design-references\concept-a-home-mobile-v2.png`
3. Índice de proyectos desktop:
   `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO\docs\design-references\concept-a-projects-desktop.png`
4. Cotización desktop:
   `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO\docs\design-references\concept-a-quote-desktop.png`

### Regla esencial sobre los mockups

Las referencias son autoritativas para la **intención** estética, jerarquía, ritmo, composición, densidad y adaptación entre los estados mostrados. Una captura estática no define por sí sola todo el comportamiento responsive: resuelve los puntos intermedios mediante los requisitos funcionales, accesibilidad, contenido real y pruebas. **No son autoritativas para datos.** Ignora como hechos cualquier teléfono, correo, precio, nombre de proyecto, dirección, plazo, año, métrica, garantía, estado de obra o afirmación comercial visible en ellas. La generación de imágenes puede haber inventado texto. No lo transfieras al sitio.

Tampoco copies literalmente la identidad o los elementos distintivos del sitio externo que inspiró la composición. Construye una expresión propia de AMPARGO.

---

## 4. Norte de dirección de arte: “Monolithic Editorial”

### 4.1 Personalidad

La web debe sentirse:

- arquitectónica;
- estable;
- sobria;
- contemporánea;
- precisa;
- humana mediante la fotografía real;
- premium sin lujo ostentoso;
- local a Houston sin recurrir a clichés de Texas.

Debe evitar sentirse como:

- una plantilla genérica de construcción;
- una startup SaaS llena de píldoras y gradientes;
- una inmobiliaria de lujo ficticia;
- una landing interminable;
- un catálogo de tarjetas idénticas;
- una demo 3D que sacrifica velocidad;
- una colección de animaciones sin propósito.

### 4.2 Gramática visual

- Hero fotográfico amplio y cinematográfico.
- Palabra `AMPARGO.` a escala monumental como recurso tipográfico propio, cuidando legibilidad y responsive.
- Cabecera delgada y contenida dentro del hero en la portada; en páginas internas puede adoptar una variante sólida/sticky.
- Bloques de servicio oscuros que se relacionan con el borde inferior del hero en desktop, sin ocultar contenido ni perjudicar el móvil.
- Alternancia intencional entre superficies carbón y papel cálido.
- Retícula editorial de 12 columnas en desktop; composiciones asimétricas controladas.
- Texto alineado y espacios negativos generosos.
- Líneas finas, numeración editorial, indicadores de proceso y pequeños detalles técnicos.
- Terracota como llamada de atención, no como relleno dominante.
- Radio moderado y coherente; no redondear todos los contenedores.
- Sombras mínimas; preferir contraste, borde y superposición estructural.
- En el hero móvil, mantener los CTA deliberadamente sutiles: `Solicitar cotización` debe ser un botón compacto de aproximadamente 44–48 px de alto y ancho ajustado a su texto; `Ver proyectos` debe ser un enlace textual secundario con flecha o subrayado fino, sin caja. Presentarlos en una línea cuando el ancho lo permita y envolver con elegancia cuando no. Prohibidos dos botones enormes apilados o rectángulos de ancho completo dentro del hero.

### 4.3 Tokens iniciales

Usa estos valores como punto de partida y ajústalos sólo mediante contraste medido y pruebas visuales:

```css
--color-carbon: #121412;
--color-carbon-raised: #1c1f1c;
--color-paper: #f2efe8;
--color-surface: #faf8f3;
--color-ink: #181a18;
--color-muted: #626963;
--color-line: rgb(24 26 24 / 16%);
--color-bone: #f8f6f0;
--color-accent: #b8452f;
--color-accent-hover: #9d3826;
--color-success: #2f6b50;
--color-error: #a83232;
```

No disperses hexadecimales arbitrarios. Centraliza color, espaciado, radios, anchuras, tipografía, z-index, sombras y duraciones como tokens CSS con nombres semánticos.

### 4.4 Tipografía

Dirección preferida, sujeta a disponibilidad/licencia y carga optimizada con `next/font`:

- display/titulares: `Space Grotesk` o una grotesca equivalente;
- cuerpo/UI: `IBM Plex Sans` o equivalente;
- numeración/etiquetas técnicas: `IBM Plex Mono` o equivalente, usada con moderación.

Requisitos:

- escalas fluidas con `clamp()`;
- máximo razonable de caracteres por línea;
- sin saltos de layout por carga tardía;
- soporte correcto de caracteres españoles;
- contraste de escala evidente entre display, sección, cuerpo, metadata y microcopy;
- evitar titulares gigantes si degradan la comprensión o cortan palabras en móvil.

### 4.5 Layout

- ancho máximo editorial orientativo: `1360–1440px`;
- padding lateral fluido;
- espaciado vertical de secciones amplio, aproximadamente `80–144px` en escritorio y adaptado en móvil;
- objetivos táctiles de al menos `44×44px`;
- sin scroll horizontal accidental a 320 px;
- no fijar alturas que corten contenido al cambiar idioma o aumentar texto;
- las páginas internas deben conservar el ADN del home sin repetir necesariamente el mismo hero monumental.

### 4.6 Movimiento

El movimiento debe explicar relaciones o guiar atención:

- revelados sutiles al entrar en viewport;
- transición corta de la cabecera;
- desplazamiento de carruseles con física contenida;
- microinteracción de botones, filtros y controles;
- transición limpia del comparador antes/después;
- cambios de etapa del formulario claros pero rápidos.

Evita:

- parallax agresivo;
- texto que persiga el cursor;
- animaciones largas;
- bloquear la interacción por una intro;
- animar todo por defecto;
- arrancar contenido crítico en `opacity: 0` si el script falla;
- movimiento que provoque mareo.

Con `prefers-reduced-motion: reduce`, el contenido debe ser inmediatamente visible, los carruseles no deben autoavanzar y las transiciones deben ser instantáneas o casi instantáneas.

---

## 5. Arquitectura multipágina obligatoria

La portada es un portal y resumen. No debe absorber todas las secciones completas. Implementa páginas verdaderas con navegación por rutas, estado activo, títulos únicos, metadatos propios y enlaces permanentes.

### 5.1 Locales y prefijos públicos

- locales regionales internos: `en-US` y `es-US`;
- prefijos públicos limpios: `/en` y `/es`;
- fallback provisional configurable: `en-US`, apropiado como hipótesis inicial para Houston, pero pendiente de aprobación del cliente y nunca enterrado como decisión irreversible; prueba que el sistema también funciona si la configuración final cambia a `es-US`;
- la raíz `/` debe redirigir con `307` según: preferencia explícita persistida → `Accept-Language` → fallback configurable;
- una visita explícita a `/es/...` o `/en/...` nunca debe ser sobrescrita por detección automática.

### 5.2 Rutas mínimas

Usa un registro tipado de rutas localizadas. La estructura visible recomendada es:

| Propósito | Español | Inglés |
|---|---|---|
| Inicio | `/es` | `/en` |
| Servicios | `/es/servicios` | `/en/services` |
| Detalle de servicio | `/es/servicios/[slug-es]` | `/en/services/[slug-en]` |
| Proyectos | `/es/proyectos` | `/en/projects` |
| Detalle de proyecto | `/es/proyectos/[slug-es]` | `/en/projects/[slug-en]` |
| Proceso | `/es/proceso` | `/en/process` |
| Nosotros | `/es/nosotros` | `/en/about` |
| Cotización | `/es/cotizacion` | `/en/quote` |
| Contacto | `/es/contacto` | `/en/contact` |
| Privacidad | `/es/privacidad` | `/en/privacy` |
| Términos | `/es/terminos` | `/en/terms` |

Añade `not-found` localizado y estados de error/carga coherentes cuando correspondan. Las rutas legales pueden existir técnicamente como preview, pero no deben aparecer en navegación, sitemap ni indexación hasta que el contenido sea revisado y aprobado.

### 5.3 Servicios

El modelo de contenido debe poder representar, sin inventar acreditaciones ni alcances legales:

1. construcción de viviendas;
2. remodelaciones;
3. acabados;
4. diseño arquitectónico;
5. planificación de obra;
6. proyectos comerciales;
7. mantenimiento;
8. trabajos eléctricos;
9. trabajos sanitarios/plomería.

Puedes agruparlos visualmente en categorías superiores para reducir ruido, pero cada servicio debe tener una entidad estable y localizable. No afirmes licencias o permisos específicos hasta que el cliente los confirme.

---

## 6. Arquitectura internacionalizada, no traducción cosmética

### 6.1 Enfoque técnico

Prefiere `next-intl` con App Router si, después de consultar sus fuentes oficiales y las guías locales de Next 16, confirmas compatibilidad con las versiones instaladas. Si no es compatible o introduce complejidad injustificada, implementa una capa server-first equivalente con rutas tipadas. No crees un `LanguageProvider` global puramente cliente ni dupliques árboles completos manualmente.

Para Next.js 16, verifica la convención vigente de `proxy.ts`; no asumas que todavía corresponde `middleware.ts`.

La topología objetivo debe usar `app/[locale]/layout.tsx` como root layout localizado real, con el home y todas las páginas localizadas dentro de `[locale]`. No conserves un `app/layout.tsx` rígido con `lang="es"` ni un `app/page.tsx` que duplique la portada. Mantén `robots.ts`, `sitemap.ts`, iconos y metadata verdaderamente global en `app/`. El layout localizado debe:

- validar el locale desde servidor;
- emitir `<html lang="en-US">` o `<html lang="es-US">` en el HTML inicial;
- exportar `generateStaticParams` para ambos idiomas cuando sea compatible con la estrategia elegida;
- tratar `params` y `searchParams` como promesas en Next.js 16, usando `await` o los helpers tipados vigentes;
- cargar sólo los mensajes necesarios y no enviar el diccionario completo al cliente por comodidad.

Si adoptas `next-intl`, crea una única configuración de routing con locales internos `en-US`/`es-US`, prefijos públicos `/en` y `/es`, `localePrefix` siempre visible, pathnames localizados, detección y cookie persistente. Crea su módulo de navegación tipada y usa sus equivalentes de `Link`, `redirect`, `usePathname`, `useRouter` y `getPathname` en toda navegación interna. Configura `proxy.ts` en la raíz excluyendo API, `_next`, `_vercel`, archivos estáticos y archivos especiales de metadata. Verifica la API exacta en la documentación instalada/actual; no inventes configuración por memoria ni dupliques directorios físicos para obtener slugs traducidos.

Para errores localizados, crea `app/[locale]/not-found.tsx` y un catch-all localizado que invoque `notFound()` para URLs desconocidas. Valida el locale también desde la configuración de request. Usa `global-not-found` sólo si la versión instalada y su configuración experimental lo justifican. Recuerda que `error.tsx` es Client Component: entrégale sólo los textos localizados necesarios.

### 6.2 Requisitos funcionales de idioma

- Todo enlace interno debe preservar el idioma.
- El selector ES/EN debe llevar a la página equivalente, no siempre al home.
- En detalles dinámicos, el selector debe preservar la misma entidad mediante un ID estable y cambiar al slug localizado.
- Persiste la elección en cookie propia, con configuración razonable.
- No uses banderas como sustituto del nombre del idioma.
- El selector debe ser operable con teclado y lector de pantalla.
- Nunca mezcles ambos idiomas en el mismo bloque salvo nombres propios.
- No uses traducciones automáticas visibles en producción sin revisión humana.
- El contenido incompleto debe marcarse como borrador y no publicarse silenciosamente.

### 6.3 Modelo de contenido

Separa contenido de componentes. Usa estructuras tipadas para:

- navegación;
- servicios;
- proyectos;
- etapas del proceso;
- preguntas frecuentes;
- textos del formulario;
- validaciones y errores;
- SEO/metadata;
- pie de página y avisos legales.

Cada proyecto/servicio dinámico debe tener:

- `id` estable e independiente del idioma;
- slugs por locale;
- títulos y extractos por locale;
- estado editorial (`draft`/`published`);
- imágenes con alt localizado;
- campos de hechos verificables separados del copy de marketing.

### 6.4 SEO bilingüe

Para cada página pública:

- `title` y `description` propios y localizados;
- canonical autoconsistente;
- `metadataBase` derivada de un `SITE_URL` HTTPS validado;
- `alternates.languages` con claves `es-US` y `en-US` y URLs absolutas, equivalentes y recíprocas;
- `x-default` apuntando a `/` al menos desde las variantes del home;
- Open Graph/Twitter localizados, usando locales `es_US` o `en_US` donde corresponda;
- `lang` correcto en `<html>`;
- sitemap con rutas publicadas de ambos idiomas;
- `lastModified` proveniente de una fecha editorial almacenada; si no existe, omitirla, nunca usar `new Date()` del build ni el mtime de OneDrive;
- no incluir drafts, previews, resultados de formularios ni rutas técnicas;
- robots coherente con el entorno;
- JSON-LD sólo con datos empresariales confirmados.

Genera canonical, alternates, selector de idioma y sitemap desde el mismo registro tipado de rutas. Si escribes alternates manualmente, desactiva cualquier generación automática equivalente para que no diverjan. Las páginas filtradas por query string deben canonicalizar a su índice limpio salvo decisión SEO explícita, justificada y probada.

---

## 7. Especificación por página

### 7.1 Inicio

Objetivo: causar una primera impresión contundente y dirigir a páginas especializadas.

Debe contener, en versión resumida:

1. hero fotográfico con propuesta de valor y CTA primario `Solicitar cotización / Request a quote`;
2. CTA secundario hacia proyectos;
3. banda o módulos de categorías de servicio;
4. introducción breve de AMPARGO;
5. selección curada de proyectos mediante carrusel/galería;
6. síntesis del proceso;
7. indicadores sólo si están verificados; si no, usar beneficios cualitativos;
8. bloque final de contacto/cotización.

No incluir el contenido completo de cada servicio, todo el portafolio ni el formulario entero en el home.

### 7.2 Servicios

- Encabezado interno fuerte.
- Vista general organizada por categorías.
- Tarjetas o filas con imágenes pertinentes, alcance resumido y enlace a detalle.
- Páginas de detalle útiles: problema, alcance, proceso, entregables sujetos a confirmación, proyectos relacionados y CTA.
- No repetir bloques idénticos sólo para llenar espacio.
- Puedes redactar copy editorial general derivado de servicios que el cliente sí confirmó, siempre sin convertirlo en una afirmación de licencia, experiencia, garantía, precio, plazo o capacidad específica no verificada. Si falta el contenido esencial de un detalle, omite ese bloque o mantén la página fuera de publicación; no muestres cajas `PENDIENTE` al visitante como relleno.

### 7.3 Proyectos

- Encabezado alineado con la referencia aprobada.
- Filtros accesibles por tipo de trabajo; el estado de filtro debe reflejarse en la URL si aporta navegación compartible.
- Rejilla visual con cargas progresivas y proporciones coherentes.
- Carrusel destacado opcional en la parte superior, sin duplicar innecesariamente el contenido.
- Abrir detalle/lightbox sin perder contexto, foco ni URL cuando corresponda.
- Sólo crear páginas de detalle publicadas para proyectos con información suficiente y verificada.
- Si las fotos no permiten identificar de forma fiable proyecto, ubicación, estado o relación antes/después, no inventarlos.
- La falta de originales de alta resolución no debe detener el rediseño local: usa las previews actuales con encuadres contenidos, evita ampliaciones extremas, aplica sólo tratamiento reversible y documenta claramente el bloqueo de nitidez para producción.

### 7.4 Proceso

Presenta un recorrido claro desde consulta inicial hasta cierre. Distingue lo confirmado de lo provisional. No prometas plazos universales. Usa una secuencia editorial y visual, no una simple fila de iconos genéricos.

### 7.5 Nosotros

Construye confianza con historia, forma de trabajo, valores y área de servicio sólo cuando existan datos. Usa placeholders editoriales explícitos para información pendiente; no publiques personas, años de experiencia o cifras inventadas.

### 7.6 Contacto

- Muestra únicamente datos confirmados.
- Cuando no exista correo empresarial o dominio, usa un estado local/preparado, no un dato falso.
- Puede orientar hacia cotización para solicitudes de proyecto y reservar contacto general para consultas breves.
- Incluye horarios, ubicación o mapas sólo si el cliente los confirma.

### 7.7 Privacidad y términos

Crea estructuras localizadas y claramente marcadas como borrador sujeto a revisión legal. Incluye asuntos necesarios para formularios y archivos: finalidad, consentimiento, canales, retención, eliminación, proveedores y derechos aplicables, sin presentarlo como asesoría legal definitiva. Hasta su aprobación, mantenlas en preview o detrás de una feature flag, con `noindex`, fuera del sitemap y fuera de la navegación pública. No hagas pasar texto provisional generado por IA como política vigente.

---

## 8. Galerías, carrusel y lightbox

### 8.1 Carrusel

Implementa un carrusel de proyectos visualmente protagonista, preferiblemente con CSS scroll snap y mejora progresiva antes de introducir una dependencia nueva.

Debe incluir:

- flechas visibles en desktop cuando haya desbordamiento;
- arrastre/touch nativo;
- navegación por teclado;
- indicadores o contador comprensible;
- estado activo anunciado de forma no invasiva;
- tarjetas enlazables a una página de proyecto cuando exista;
- `alt` útil y `sizes` realistas;
- ningún autoavance por defecto; si se usa excepcionalmente, debe poder pausarse y desactivarse con movimiento reducido;
- sin bucles que confundan a lectores de pantalla;
- sin secuestrar el scroll vertical en móvil.

### 8.2 Lightbox

Si implementas lightbox:

- usa semántica de diálogo;
- atrapa foco sólo mientras está abierto;
- devuelve el foco al disparador al cerrar;
- cierra con Escape y botón visible;
- bloquea el fondo sin saltos de layout;
- permite siguiente/anterior con teclado y controles táctiles;
- muestra pie de foto sólo con información verificada;
- no descarga de golpe todos los originales.

### 8.3 Tratamiento de imagen

- Inventaría dimensiones, orientación, duplicados y calidad de las 29 fotos actuales.
- Elige fotos con consentimiento confirmado o mantenlas fuera de producción.
- No uses IA para convertir una obra inconclusa en proyecto terminado.
- No exageres resolución mediante escalado como si fuera una mejora real.
- Solicita originales de al menos 2000–3000 px para heroes/portafolio de producción.
- Usa `next/image`, formatos modernos, placeholders y prioridades sólo above-the-fold.
- Define `sizes` según la retícula real; evita enviar imágenes excesivas a móvil.
- Conserva un manifiesto de atribución/consentimiento/uso por activo si el proyecto lo permite.

---

## 9. Comparador interactivo antes/después

Esta función debe ser llamativa y táctil, pero sobre todo honesta y accesible.

### 9.1 Regla de evidencia

No publiques ningún par como “antes/después” hasta confirmar que:

- ambas fotos son del mismo espacio/proyecto;
- representan momentos distintos reales;
- existe permiso para mostrar ambas;
- su encuadre permite una comparación no engañosa.

Mientras no haya pares verificados, el componente puede quedar implementado y probado con assets internos de demostración claramente excluidos de producción, o detrás de una feature flag apagada. No fuerces fotos no relacionadas.

### 9.2 Interacción

Implementa un slider de recorte superpuesto, no dos imágenes una al lado de la otra como única vista.

Requisitos:

- control nativo o semántica `role="slider"` correcta;
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y etiqueta localizada;
- teclado: flechas, Home y End;
- pointer/touch con área de agarre amplia;
- etiquetas Antes/Después o Before/After;
- posición inicial 50%;
- imágenes con dimensiones/aspect ratio equivalentes o normalización documentada;
- sin arrastre que bloquee el scroll vertical accidentalmente;
- modo reducido sin animación elástica;
- fallback legible con JavaScript desactivado;
- pruebas en RTL no necesarias, pero sí ES/EN y 320 px.

---

## 10. Sistema de cotización con imágenes

La cotización es una función principal, no un formulario decorativo. Usa una experiencia de tres etapas, guardado de borrador seguro y resumen claro.

### 10.1 Etapas recomendadas

1. **Proyecto**
   - tipo de servicio;
   - descripción libre;
   - ciudad/ZIP o área aproximada, sin pedir dirección exacta prematuramente;
   - rango de presupuesto opcional y configurable;
   - plazo deseado expresado sin promesas;
   - nombre y datos de contacto necesarios.
2. **Referencias**
   - carga de imágenes;
   - previews y estado por archivo;
   - consentimiento relacionado con las imágenes.
3. **Revisión y envío**
   - resumen editable;
   - aviso de privacidad/consentimiento;
   - elección obligatoria y mutuamente excluyente entre Email o WhatsApp;
   - confirmación local o handoff según el canal.

Puedes reorganizar campos para mejorar UX, pero conserva la progresión y no ocultes información crítica.

### 10.2 Límites de archivo

Configura como política provisional centralizada:

- máximo 8 imágenes;
- máximo 10 MB por archivo;
- máximo 40 MB combinados;
- aceptar JPEG, PNG y WebP;
- rechazar SVG y PDF;
- HEIC/HEIF sólo si puedes convertirlo de forma segura, consistente y probada; si no, muestra una explicación clara;
- validar extensión, MIME real, firma mágica y dimensiones en servidor;
- eliminar EXIF, especialmente GPS, antes del almacenamiento definitivo;
- generar miniaturas seguras;
- no confiar en validación cliente;
- nombres de almacenamiento generados por servidor, nunca el nombre original como ruta.

### 10.3 UX de carga

- drag & drop y selector estándar;
- totalmente usable sólo con teclado;
- previews con nombre legible, tamaño y estado;
- progreso real por archivo cuando exista upload;
- eliminación antes de enviar;
- reintento de fallos;
- mensajes localizados y específicos;
- contador `n de 8`;
- advertencia del total acumulado;
- compresión cliente sólo si no destruye evidencia y nunca como sustituto de validación servidor;
- borradores que no pierdan texto por una recarga accidental;
- no guardar blobs grandes en `localStorage`.

### 10.4 Arquitectura de subida

No envíes 40 MB a través de una Server Action monolítica. Los límites del framework y del proxy pueden ser configurables, pero elevarlos no es la arquitectura preferida.

Diseña contratos para:

1. crear un borrador de cotización y obtener `quoteId`;
2. solicitar URLs firmadas o credenciales temporales por archivo;
3. cargar directamente a almacenamiento privado compatible con S3;
4. confirmar cada upload en servidor y volver a validar;
5. finalizar la cotización sólo cuando el estado de archivos sea consistente;
6. ejecutar posteriormente escaneo/transformación si el proveedor lo admite.

Mientras no exista almacenamiento real, implementa un adaptador local explícito. No basta con generar una URL temporal en el navegador o simular metadata: el adaptador debe guardar realmente una copia procesada del byte recibido en almacenamiento privado de pruebas, confirmar integridad/tamaño/tipo, permitir su recuperación autorizada y probar su eliminación. Usa sólo datos sintéticos. La ubicación debe quedar fuera de `public`, ignorada por Git y, debido a que el proyecto está dentro de OneDrive, preferiblemente en un directorio temporal privado del sistema creado específicamente para las pruebas. No simules éxito de producción.

### 10.5 Persistencia

Toda solicitud debe existir en la base de datos o adaptador persistente **antes** de abrir WhatsApp. Estado mínimo sugerido:

- `draft`;
- `uploading`;
- `ready`;
- `registered`;
- `handoff_whatsapp`;
- `email_queued`;
- `email_accepted`;
- `delivered`, sólo cuando un webhook verificable del proveedor lo confirme;
- `failed`;
- `expired`.

Usa un `quoteId` no predecible, timestamps y registro de errores sin guardar secretos ni contenido excesivo en logs.

El cierre debe ser idempotente y atómico: usa una clave de idempotencia por intento lógico, impide transiciones inválidas, evita solicitudes/emails duplicados ante doble clic, recarga o timeout, y prueba reintentos concurrentes. `registered` significa que AMPARGO guardó la solicitud; `handoff_whatsapp` significa que se entregó/abrió el enlace, no que el usuario efectivamente envió el mensaje. `email_accepted` significa aceptación por el proveedor, no entrega.

Retención de referencia únicamente para **datos sintéticos de desarrollo**, hasta aprobación del cliente/legal:

- borradores no enviados: 24 horas;
- solicitudes enviadas y sus archivos: 90 días;
- mecanismo documentado de borrado y expiración;
- configurar todo por entorno, no disperso en el código.

Producción debe exigir una política de retención explícitamente aprobada y configurada; el flujo real no debe arrancar silenciosamente con estos valores provisionales.

Define además cómo el personal autorizado recuperará la solicitud y las imágenes. Implementa en local una vista privada de receptor con datos sintéticos, protegida por autenticación o por un token opaco de alcance mínimo, expiración corta y revocación. No pongas PII en la URL, no uses enlaces públicos permanentes y no confundas una URL firmada de objeto con autorización para ver el resumen completo.

### 10.6 Canal Email

- Debe ser una opción principal, no un `mailto:`.
- El correo empresarial real aún no está confirmado.
- Define una interfaz de adaptador de email y un proveedor mock/local con salida segura en desarrollo.
- Prepara variables de entorno para remitente, destino y proveedor.
- No pongas API keys en cliente ni repositorio.
- Cuando el proveedor real no esté configurado, la UI local debe indicar claramente modo demostración; jamás mostrar “enviado” si no hubo envío.
- El email debe contener resumen, `quoteId` y enlaces privados/expirables a referencias, no adjuntos enormes por defecto.

### 10.7 Canal WhatsApp

- El usuario elige **WhatsApp** como alternativa a Email, no “ambos”.
- Existen dos números principales, todavía pendientes de confirmación final.
- Distribuye internamente de forma determinista y aproximadamente equilibrada usando el `quoteId` persistido; por ejemplo, hash estable módulo 2.
- No muestres al usuario una decisión técnica innecesaria entre dos agentes salvo requisito futuro.
- Genera el enlace de WhatsApp sólo después de persistir la solicitud.
- El mensaje prellenado debe ser breve, localizado y contener `quoteId`, tipo de servicio y enlace seguro/resumen, nunca datos o URLs públicas de archivos sensibles.
- No uses el valor de retorno de `window.open` como prueba absoluta de que el popup falló, especialmente con `noopener,noreferrer`.
- Proporciona botón/enlace visible de respaldo para continuar y muestra un estado honesto: “Solicitud registrada; continúa en WhatsApp”.

### 10.8 Selección del canal

Usa un `fieldset` con `legend` y dos radios/tarjetas seleccionables:

- Email;
- WhatsApp.

Requisitos:

- exactamente una opción al enviar;
- ambas con explicación breve;
- foco visible;
- estado elegido no dependiente sólo del color;
- resumen previo del comportamiento;
- validación server-side;
- evento analítico preparado sin datos personales sensibles.

### 10.9 Seguridad y abuso

Incluye desde el contrato:

- validación con esquema compartido;
- rate limiting por capas;
- honeypot y tiempo mínimo razonable;
- protección CSRF según arquitectura;
- URLs firmadas de corta duración;
- almacenamiento privado;
- encabezados de seguridad;
- CSP compatible con las integraciones reales;
- sanitización de texto al representarlo;
- logs minimizados/redactados;
- límites de payload;
- mensajes genéricos al usuario y diagnóstico técnico sólo en servidor;
- accesibilidad de CAPTCHA si llegara a añadirse; no lo introduzcas por defecto sin necesidad.

El almacenamiento local de prueba debe tener propietario y frontera explícitos. Nunca uses información personal real en fixtures, no escribas PII en `public`, logs o snapshots, y añade cualquier ruta local a `.gitignore`. Todo proceso de expiración/cleanup debe resolver y validar la ruta absoluta, operar únicamente sobre archivos creados por el adaptador dentro de su directorio temporal aislado, rechazar rutas amplias/globs y probarse sin tocar archivos ajenos.

---

## 11. 3D: producto separado, integración preparada

No implementes el configurador 3D completo dentro del bundle principal en esta fase.

### Decisión arquitectónica

- Sitio institucional AMPARGO: aplicación principal optimizada para contenido, SEO, portafolio y conversión.
- Experiencia 3D: aplicación y despliegue separados, con presupuesto de rendimiento, dependencias y ciclo de releases propios.
- Integración futura: enlace o subdominio como `studio.dominio.com`, sesión/quote ID mediante contrato seguro y retorno al flujo de cotización.

### Evolución sugerida

No fuerces una migración inmediata. Deja documentada una evolución futura a:

```text
apps/
  web/          # sitio principal
  studio-3d/    # configurador independiente
packages/
  ui/           # tokens/componentes compartidos cuidadosamente
  contracts/    # tipos y esquemas de integración
  config/       # configuración común mínima
```

En esta fase:

- no agregues Three.js/React Three Fiber al sitio principal;
- no cargues modelos 3D ni viewers ocultos;
- define una feature flag y contrato de enlace;
- oculta el CTA 3D hasta que exista una experiencia real;
- si muestras una mención de “próximamente”, debe ser explícita y no interferir con la conversión principal.

---

## 12. Componentes y sistema de diseño

Crea componentes reutilizables basados en patrones reales del sitio, no una abstracción prematura.

Mínimos probables:

- `SiteHeader` con variantes transparent/solid;
- `MobileNavigation` accesible;
- `LocaleSwitcher` preservando ruta/entidad;
- `SiteFooter`;
- `PageHero`;
- `SectionHeading`;
- `ServiceCard`/`ServiceRow`;
- `ProjectCard`;
- `ProjectCarousel`;
- `GalleryGrid`;
- `AccessibleLightbox`;
- `BeforeAfterCompare`;
- `ProcessTimeline`;
- `QuoteStepper`;
- `ReferenceUploader`;
- `DeliveryChannelSelector`;
- `QuoteSummary`;
- estados `Empty`, `Error`, `Loading` y `Success` honestos.

Requisitos del header:

- navegación desktop y móvil coherente;
- no robar foco al montar;
- al abrir el menú móvil, foco al primer control apropiado;
- Escape cierra;
- foco atrapado mientras está abierto y restaurado al disparador;
- bloqueo de scroll sin saltos;
- estado activo correcto por idioma;
- CTA de cotización visible sin dominar todo el header;
- selector de idioma bien estructurado.

Requisitos del footer:

- navegación útil por grupos;
- selector de idioma o acceso equivalente;
- datos reales únicamente;
- enlaces legales;
- no rellenar con redes sociales ficticias;
- año dinámico permitido, pero no usarlo como falsa prueba de actualidad del contenido.

---

## 13. Accesibilidad como requisito de entrega

Apunta como mínimo a WCAG 2.2 AA.

Verifica:

- landmarks y jerarquía de headings;
- skip link;
- nombres accesibles;
- navegación completa por teclado;
- foco visible y contraste suficiente;
- contraste medido en overlays sobre fotografías reales, no sólo en tokens;
- texto alternativo contextual;
- zoom al 200% y reflow;
- objetivos táctiles;
- errores vinculados a sus campos;
- resumen de errores y foco al primer error;
- estados no comunicados sólo con color;
- anuncios `aria-live` sólo donde aporten valor;
- diálogos, carruseles, filtros, upload y slider antes/después;
- movimiento reducido;
- alto contraste del sistema cuando sea viable;
- contenido funcional con JavaScript lento o parcialmente fallido.

No uses ARIA para reparar semántica HTML incorrecta cuando exista un elemento nativo adecuado.

---

## 14. Rendimiento y calidad técnica

### 14.1 Objetivos orientativos de laboratorio

En páginas clave y build de producción, busca:

- LCP <= 2.5 s en perfil móvil razonable;
- CLS <= 0.1;
- INP estimado <= 200 ms;
- Lighthouse Performance >= 90 cuando las limitaciones de assets lo permitan;
- Accessibility, Best Practices y SEO >= 95, explicando cualquier excepción real.

No manipules las pruebas para obtener números. Registra entorno, página y limitaciones.

### 14.2 Presupuesto y arquitectura

- Server Components por defecto.
- `use client` sólo en islas interactivas.
- No hidratar contenido puramente editorial.
- Imports dinámicos para lightbox, upload avanzado u otras funciones pesadas cuando sea beneficioso.
- No agregar una librería grande para una microinteracción que CSS resuelve bien.
- Medir el impacto de Framer Motion; usarlo de forma selectiva.
- Precargar sólo el recurso crítico real.
- Evitar video autoplay pesado en el hero.
- Fuentes autoalojadas/optimizadas y subconjuntos adecuados.
- Cache y revalidación coherentes con contenido local.
- No convertir el sitio completo en SPA cliente.

---

## 15. Hosting, entorno y producción

El destino previsto es Hostinger con dominio propio, pero el cliente aún no compró ni confirmó el plan.

No asumas que “Hostinger” implica hosting estático ni que todos sus planes soportan el mismo runtime. La aplicación de cotización requiere un entorno Node y servicios persistentes. Antes de recomendar despliegue, verifica el plan adquirido y la documentación vigente.

Prepara:

- `.env.example` completo, sin secretos;
- validación de variables de entorno al arrancar;
- separación development/test/production;
- adaptadores intercambiables para email, almacenamiento y persistencia;
- health check no sensible si resulta apropiado;
- documentación de build/start;
- checklist de dominio, SSL, DNS, correo, backup, logs, retención y monitoreo;
- lista exacta de decisiones que el cliente debe aportar.

No hagas export estático si rompe rutas dinámicas, servidor, seguridad o cotizaciones. Tampoco afirmes que un proveedor concreto de base de datos/almacenamiento es obligatorio sin evaluar plan, costos y residencia de datos.

---

## 16. Datos, privacidad y contenido pendiente

Mantén un registro explícito, legible por el equipo, de datos pendientes:

- razón/nombre comercial exacto;
- dominio;
- correo empresarial remitente y destinatario;
- dos números de WhatsApp;
- dirección/área de servicio;
- horarios;
- licencias, seguros y certificaciones;
- años, métricas y garantías;
- textos legales;
- consentimiento de fotografías;
- pares antes/después;
- datos verificables de cada proyecto;
- proveedores de email, almacenamiento y base de datos;
- política final de retención.

La ausencia de estos datos no debe bloquear todo el trabajo local. Usa configuración, adaptadores, feature flags y contenido draft. Sí debe impedir una falsa declaración de “listo para producción”.

---

## 17. Plan de ejecución obligatorio

Mantén un plan vivo y actualízalo al completar cada fase. No pidas confirmación entre fases salvo que una decisión faltante cambie materialmente el producto o implique una acción externa.

### Fase 0 — Baseline verificable

1. Inspecciona repositorio, instrucciones y árbol.
2. Comprueba raíz Git sin modificarla.
3. Ejecuta el baseline disponible: lint, TypeScript, build y pruebas existentes.
4. Arranca sólo una instancia controlada del servidor.
5. Captura páginas actuales en viewports clave.
6. Registra errores, warnings, tamaño de assets, fallos de consola y rutas rotas.
7. Revisa visualmente las cuatro referencias aprobadas.

### Fase 1 — Arquitectura y contenido

1. Define mapa de rutas localizado.
2. Crea registro tipado de pathnames/slugs y modelo de contenido.
3. Migra header/footer/metadata al sistema bilingüe.
4. Implementa redirección de raíz y persistencia de idioma.
5. Evita enlaces primarios a anchors como sustituto de páginas.

### Fase 2 — Foundations visuales

1. Implementa tokens, fuentes y container/grid.
2. Crea primitives y variantes de cabecera.
3. Refactoriza el home hacia Concepto A.
4. Verifica desktop y móvil inmediatamente; no dejes responsive para el final.

### Fase 3 — Páginas internas

1. Servicios y detalles publicables.
2. Proyectos, filtros, galerías y detalles verificables.
3. Proceso.
4. Nosotros.
5. Contacto y legales draft.
6. 404/error states localizados.

### Fase 4 — Interacción visual

1. Carrusel accesible.
2. Lightbox.
3. Comparador antes/después detrás de regla de evidencia/feature flag.
4. Motion coherente y reduced motion.
5. QA de menú móvil, foco, scroll y localización.

Antes de entrar en infraestructura de cotización, establece una **puerta de calidad visual obligatoria**: Home desktop, Home móvil, Proyectos y el shell visual de Cotización deben estar implementados, capturados y comparados contra las cuatro referencias. Corrige primero jerarquía, ritmo, responsive y coherencia de marca. La mayor parte del criterio de calidad de esta misión es visual; no permitas que el trabajo backend diluya esa prioridad.

### Fase 5 — Cotización

1. Esquemas y modelo de datos.
2. Flujo de etapas y validación.
3. Carga mock/local basada en contratos seguros.
4. Elección Email/WhatsApp.
5. Persistencia previa al handoff.
6. Adaptadores y variables de entorno.
7. Estados de error, reintento, expiración y confirmación.

### Fase 6 — SEO, accesibilidad y performance

1. Metadata/canonical/hreflang/sitemap.
2. JSON-LD sólo con datos confirmados.
3. Auditoría axe/manual.
4. Optimización de imágenes, fuentes y JS.
5. Pruebas de contraste sobre fotografías reales.

### Fase 7 — Verificación y documentación

1. Ejecuta toda la matriz de pruebas.
2. Captura resultado final equivalente a las referencias.
3. Compara before/after visual del sitio, no confundir con la función de proyectos.
4. Actualiza documentación sin borrar historia útil.
5. Entrega informe honesto de completado, pendiente y bloqueado.

---

## 18. Matriz de QA obligatoria

### 18.1 Comandos

Ejecuta como mínimo:

- ESLint;
- TypeScript con `--noEmit`;
- build de producción;
- pruebas Playwright existentes y nuevas;
- `npm run check:i18n` o equivalente obligatorio;
- rastreo/análisis de enlaces y rutas publicadas.

El chequeo i18n debe fallar ante claves de mensajes desiguales, traducciones publicadas incompletas, slugs duplicados, entidades sin pareja localizada, canonicals repetidos, alternates no recíprocos, drafts incluidos en navegación/sitemap o rutas públicas que devuelvan 404.

No des por sentado que un `build` exitoso valida la experiencia.

### 18.2 Viewports

Prueba al menos:

- 320×568;
- 375×812;
- 390×844;
- 768×1024;
- 1024×768;
- 1366×768;
- 1440×900;
- 1920×1080.

En ambos idiomas, cubre al menos Home, Proyectos, Cotización y una página interna adicional. Revisa visualmente las capturas completas, no sólo asserts automáticos.

### 18.3 Flujos críticos

Automatiza y valida:

1. raíz → locale correcto;
2. selector ES/EN conserva página equivalente;
3. selector conserva entidad dinámica y cambia slug;
4. menú móvil abre/cierra, gestiona foco y no roba foco al cargar;
5. navegación multipágina y estado activo;
6. filtros de proyectos;
7. carrusel por botones, teclado y swipe;
8. lightbox y devolución del foco;
9. antes/después con teclado y touch cuando feature flag esté activa;
10. validación del formulario por etapa;
11. archivos válidos;
12. demasiados archivos, archivo demasiado grande, MIME falso y formato rechazado;
13. quitar/reintentar archivo;
14. envío por Email en modo mock;
15. envío por WhatsApp con persistencia previa;
16. selección determinista equilibrada entre los dos números usando casos controlados;
17. popup bloqueado/fallback sin falso negativo;
18. error de servidor y recuperación;
19. movimiento reducido;
20. ausencia de errores de consola e hidratación.

Añade casos i18n/SEO explícitos:

- sin cookie, `Accept-Language: es` produce `307` a `/es`;
- sin cookie, inglés o idioma no soportado produce `307` al fallback configurado;
- una cookie española prevalece sobre un encabezado inglés;
- un prefijo explícito `/en/...` prevalece sobre una cookie española;
- no hay bucles y el `307` se comprueba sin seguir automáticamente la redirección;
- locale no soportado y slug perteneciente al otro idioma no producen contenido duplicado;
- con JavaScript desactivado, el HTML inicial, `<html lang>`, navegación y contenido ya están localizados;
- el selector mantiene página y entidad dinámica, cambia el slug y persiste la cookie;
- el HTML crudo contiene title, description, canonical, alternates recíprocos y Open Graph correctos;
- sitemap contiene ambas variantes, excluye drafts y robots cambia según entorno;
- rastreo de todas las rutas publicadas y todos los enlaces internos sin 404 inesperado;
- ejecutar los E2E contra `next build` + `next start` en un puerto aislado, no sólo `next dev`;
- correr el flujo crítico en Chromium, Firefox y WebKit.

### 18.4 Regresión visual

- Guarda capturas baseline aprobables para páginas/estados clave.
- Usa umbrales explícitos y máscaras sólo para contenido genuinamente no determinista.
- No enmascares áreas grandes para hacer pasar la prueba.
- Compara también contenido: idioma, índice del carrusel, foco y estado del formulario.
- Repite la suite crítica al menos tres veces para detectar flakiness.

### 18.5 Accesibilidad automatizada y manual

Integra `@axe-core/playwright`; sólo omítelo ante incompatibilidad concreta, reproducible y documentada. Complementa con pruebas manuales de:

- Tab/Shift+Tab;
- Escape;
- lectura del orden visual y DOM;
- foco visible sobre foto y fondos oscuros;
- zoom/reflow;
- VoiceOver/NVDA si el entorno lo permite;
- mensajes de validación;
- carrusel, lightbox, upload, slider y selector de canal.

---

## 19. Criterios de aceptación visual

No consideres aprobada la dirección A hasta que:

- el home desktop conserva el impacto del hero, marca monumental, módulos oscuros y transición a papel cálido;
- el móvil es una composición propia y legible, no el desktop comprimido;
- el par de CTA del hero móvil es compacto y refinado: un botón primario ajustado al contenido y un enlace secundario sin caja; no domina la fotografía ni el titular;
- Proyectos se siente como una página editorial completa, no una sección desprendida del home;
- Cotización se siente parte del mismo sistema de marca, no un panel SaaS genérico;
- el sistema mantiene consistencia entre todas las páginas sin clonarlas;
- las fotos reales se ven nítidas dentro de sus límites y nunca deformadas;
- los CTA son claros y el terracota no se usa indiscriminadamente;
- no hay textos superpuestos de forma ilegible;
- la jerarquía funciona en ES y EN, incluyendo expansiones de texto;
- no hay desbordes, saltos de layout ni controles minúsculos;
- las animaciones no afectan comprensión, rendimiento o accesibilidad;
- el sitio luce profesional aun con motion desactivado.

---

## 20. Definición de “terminado localmente”

Puedes declarar **implementación local completa** sólo si:

- las rutas multipágina existen y son navegables en ES/EN;
- el selector de idioma conserva contexto;
- el Concepto A está implementado en home y páginas internas;
- carrusel y lightbox funcionan y son accesibles;
- el comparador está correctamente implementado y, si no hay evidencia, oculto por feature flag;
- cotización valida, procesa y almacena realmente imágenes sintéticas mediante el adaptador local privado; permite recuperarlas con autorización, comprueba integridad y prueba su eliminación segura;
- la elección Email/WhatsApp es exacta y mutuamente excluyente;
- la solicitud se persiste localmente antes del handoff simulado;
- la finalización es idempotente y resiste doble submit/reintento sin duplicar solicitud o notificación;
- la vista privada local del receptor aplica expiración/revocación y nunca expone PII en una URL pública;
- no se afirma un envío real si falta proveedor;
- lint, TypeScript, build y pruebas críticas pasan;
- las capturas fueron revisadas visualmente;
- no existen errores conocidos P0/P1 sin documentar;
- la documentación de configuración y pendientes está actualizada.

### “Listo para producción” es distinto

No uses esa frase hasta contar y probar como mínimo con:

- dominio y plan de hosting adecuados;
- correo empresarial y proveedor real;
- base de datos y almacenamiento privado reales;
- dos números de WhatsApp confirmados;
- políticas legales y retención aprobadas;
- consentimiento de fotografías;
- contenido comercial verificado;
- secretos configurados fuera del repositorio;
- pruebas end-to-end en staging;
- observabilidad, backups y plan de recuperación;
- revisión final del cliente.

---

## 21. Forma de reportar el trabajo

Al finalizar, entrega un informe compacto pero comprobable con:

1. **Resultado:** qué cambió y cuál es el estado real.
2. **Diseño:** cómo se tradujo el Concepto A a desktop, móvil y páginas internas.
3. **Arquitectura:** rutas, i18n, contenido y límites de la solución 3D.
4. **Cotización:** qué funciona localmente, qué usa mocks y qué falta para producción.
5. **Pruebas:** comandos, cantidad de pruebas, navegadores/viewports, repeticiones y resultados.
6. **Evidencia visual:** rutas de capturas finales y comparaciones principales.
7. **Archivos clave:** lista de archivos creados/modificados con su propósito.
8. **Pendientes del cliente:** lista priorizada y accionable.
9. **Riesgos/bloqueos:** sin minimizar ni esconder problemas.
10. **Siguiente paso recomendado:** uno concreto.

Incluye capturas reales del resultado. No cierres con afirmaciones vagas como “todo se ve bien”. Si algo no pudo verificarse, dilo y explica exactamente cómo verificarlo.

---

## 22. Recordatorio final de calidad

Tu prioridad es la excelencia visual, pero visual no significa superficial. La experiencia debe unir fotografía, tipografía, espacio, movimiento, contenido, accesibilidad, rendimiento y confianza comercial. Conserva la fuerza del Concepto A en cada página y estado, sin convertir el sitio en una copia de la referencia ni usar información generada como si proviniera del cliente.

Empieza ahora con la inspección del repositorio y el baseline. Mantén el plan actualizado, continúa con la implementación segura y no te detengas después de la auditoría.

## FIN DEL PROMPT PARA CLAUDE CODE
