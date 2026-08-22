# Ampargo — Guía del proyecto

Documento guía del sitio web de Ampargo (construcción y remodelación, Houston TX). Sirve como brief permanente: de dónde salió cada decisión, qué se construyó, qué falta, y cómo retomar el trabajo en una sesión futura.

---

## 1. Resumen ejecutivo

**Cliente:** Ampargo — contratista de construcción y remodelación general en Houston, TX. Contacto: Jose Andrade (principal), Ramon Andrade, Mario Parra. 30 años de experiencia.

**Fuente del brief:** `Formulario_Requerimientos_Web_Rellenable.pdf` — entrevista de levantamiento de requerimientos realizada por Alexis Patiño el 16-08-2026.

**Objetivo del sitio:**
- Mostrar información de la empresa y generar clientes potenciales por WhatsApp.
- Mostrar proyectos realizados (portafolio con fotos reales).
- Recibir cotizaciones a través de un formulario simple.

**Público objetivo:** personas que quieren construir una casa, inmobiliarias, clientes de remodelación y obras grandes — todos en la zona de Houston, TX.

**Urgencia del cliente:** página publicada lo antes posible + recibir clientes por WhatsApp. Próxima reunión con el cliente para mostrar avance y cotización.

---

## 2. Sistema de diseño

El punto de partida fue tratar a Ampargo como lo que realmente es: una empresa que vive de planos, medidas y dibujos técnicos. De ahí sale todo el lenguaje visual, evitando los clichés típicos de "constructora" (casco amarillo, naranja de seguridad, fotos de stock genéricas).

### Color

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#172335` | Azul-carbón tipo tinta de plano. Texto principal, secciones oscuras. |
| `--color-paper` | `#EDEAE2` | Piedra/concreto cálido-grisáceo. Fondo base. |
| `--color-redline` | `#B8452F` | Rojo-ladrillo apagado, inspirado en el "redlining" (marcar correcciones en rojo sobre un plano arquitectónico). Único acento — CTAs y marcas de anotación. |
| `--color-graphite` | `#4A5160` | Texto secundario, líneas de acotación. |
| `--color-bone` | `#F7F5F0` | Texto/superficie sobre fondo oscuro. |
| `--color-steel` | `#8B93A1` | Líneas finas, bordes sutiles. |

Definidos en `app/globals.css` vía `@theme` (Tailwind v4) — generan automáticamente clases `bg-ink`, `text-redline`, `border-steel/30`, etc.

### Tipografía

- **Space Grotesk** (`--font-display`) — titulares, geométrica con carácter técnico, uso comedido en tamaños grandes.
- **IBM Plex Sans** (`--font-body`) — cuerpo de texto, legible en español e inglés.
- **IBM Plex Mono** (`--font-mono`) — etiquetas, datos de contacto, "sheet labels". Plex nació como tipografía de ingeniería en IBM — coherente con el resto del sistema.

### Layout: metáfora de "hoja de plano"

Cada sección se ancla con un componente `<SectionLabel>` que imita el cajetín de una hoja de dibujo técnico: un eyebrow en mono caps a la izquierda y un código de hoja (`A-100`, `A-200`...) a la derecha, siguiendo la convención real de sets de planos de arquitectura. **No se usan números de proceso genéricos (01/02/03)** porque el contenido no es una secuencia real — eso habría sido el default genérico.

### Firma (signature element): líneas de acotación

El componente `<DimensionLine>` (`components/DimensionLine.tsx`) dibuja una línea fina con marcas de graduación que "se traza" de izquierda a derecha cuando entra en el viewport (`IntersectionObserver` + transición CSS), como una línea de medida real sobre un plano. Es el único elemento decorativo audaz de la página — todo lo demás se mantiene disciplinado. Respeta `prefers-reduced-motion` (queda estática, sin animar).

### Movimiento

- Hero: reveal orquestado una sola vez al cargar (Framer Motion, `staggerChildren`).
- Tarjetas de servicios/proyectos: elevación e inversión de color sutil en hover.
- Nada de animación decorativa adicional. `prefers-reduced-motion` se respeta en dos frentes,
  porque el reset de CSS **no basta**: Framer Motion anima con estilos en línea vía JavaScript y
  el `@media (prefers-reduced-motion)` de `globals.css` no le afecta. Por eso el hero consulta
  además el hook `useReducedMotion()` (`components/Hero.tsx`).

---

## 3. Mapa del sitio

Landing page de una sola página, secciones ancladas (`app/page.tsx` las ensambla en este orden):

1. **Header** (`components/Header.tsx`) — wordmark "AMPARGO", navegación ancla, toggle ES/EN, botón WhatsApp siempre visible.
2. **Hero** (`Hero.tsx`) — foto real del proyecto de patio/piscina de lujo como fondo, titular, CTA WhatsApp + "Ver proyectos", barra de confianza (30 años / Houston TX / especialidad).
3. **Servicios** (`Services.tsx`) — los 9 servicios marcados por el cliente en el formulario.
4. **Por qué elegirnos** (`WhyUs.tsx`) — 30 años de experiencia, garantía (fotos del proceso), los 8 valores marcados por el cliente en formato de lista tipo especificación.
5. **Proyectos** (`Projects.tsx`) — galería curada de 9 fotos reales del cliente, agrupadas por categoría.
6. **Nosotros** (`About.tsx`) — texto breve basado en las respuestas del formulario.
7. **Contacto** (`Contact.tsx`) — ambos números de WhatsApp con nombre, formulario (envía por WhatsApp, sin backend), mapa de Google embebido con la dirección.
8. **Footer** (`Footer.tsx`) — estilo "cajetín" de plano con datos de contacto y zona de servicio.

---

## 4. Decisiones técnicas

| Decisión | Por qué |
|---|---|
| **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4** | Next 16 es la versión estable actual (verificado con `npm view next dist-tags` — no next@15 como se planeó inicialmente). Tailwind v4 permite definir los tokens de diseño directamente en CSS con `@theme`, sin `tailwind.config.js`. |
| **Framer Motion** | Única animación orquestada del hero; librería madura, bien soportada con App Router. |
| **i18n propio** (`content/es.ts`, `content/en.ts`, `lib/i18n-context.tsx`) | Una landing de una sola página no necesita una librería de i18n con ruteo. El contexto usa `useSyncExternalStore`, que evita el error de hidratación. **Limitación conocida:** el HTML servido siempre está en español y el inglés se aplica tras hidratar, así que (a) Google no indexa la versión inglesa y (b) un visitante que eligió inglés ve un parpadeo. La solución es migrar a rutas por idioma (`app/[lang]/`); está pendiente y documentada en `AUDITORIA_Y_PLAN_AMPARGO.md`. |
| **Sin backend/CMS** | El cliente no tiene hosting ni dominio todavía, y la mayoría del contenido real (textos institucionales, fotos categorizadas, colores de marca) todavía no existe. El formulario de contacto abre WhatsApp con el mensaje prellenado — cero dependencias de servidor. |
| **`next/image` con fotos reales del cliente** | Las 29 fotos que el cliente envió (`imagenes reales.zip`) sustituyen cualquier placeholder — ver sección 6. |

### Estructura de archivos

```
/app/layout.tsx              — fuentes (next/font/google), <html>, LanguageProvider
/app/page.tsx                 — ensambla las secciones
/app/globals.css              — tokens de diseño (@theme), utilidades (.sheet-label, .dimension-line)
/components/                  — Header, Hero, Services, WhyUs, Projects, About, Contact, Footer,
                                 WhatsAppButton, LanguageToggle, DimensionLine, SectionLabel
/content/es.ts, en.ts, types.ts — todo el copy del sitio, tipado
/lib/i18n-context.tsx         — contexto de idioma (useSyncExternalStore + localStorage)
/lib/whatsapp.ts              — helper para enlaces wa.me con mensaje prellenado
/public/images/proyectos/     — las 29 fotos reales del cliente. El carrusel usa 12 curadas;
                                 el resto queda disponible pero sin enlazar.
GUIA_PROYECTO.md              — este documento
```

---

## 5. Comandos

```bash
npm install       # instalar dependencias
npm run dev        # servidor de desarrollo (http://localhost:3000)
npm run build       # build de producción
npm run lint        # ESLint
```

---

## 6. Fotos reales del cliente

El cliente entregó `imagenes reales.zip` (29 fotos JPEG exportadas de WhatsApp, sin nombres descriptivos). Se revisaron una por una y se organizaron por tipo de trabajo en `public/images/proyectos/`:

| Categoría | Archivos | Cantidad |
|---|---|---|
| Baños | `bano-01` a `bano-04` | 4 |
| Cocinas (cuarzo) | `cocina-cuarzo-01` a `cocina-cuarzo-07` | 7 |
| Cocinas (granito) | `cocina-granito-01` | 1 |
| Demolición/preparación | `demolicion-01`, `demolicion-02` | 2 |
| Estructuras y techos (carports) | `estructura-01` a `estructura-09` | 9 |
| Exteriores/jardín | `exterior-jardin-01`, `exterior-jardin-02` | 2 |
| Exteriores de lujo (patio/piscina) | `exterior-lujo-01` | 1 |
| Interiores | `interior-01` | 1 |
| Instalaciones/plomería | `plomeria-01` | 1 |
| Acabados/detalle | `acabado-01` | 1 |

La galería del sitio (`Projects.tsx`) muestra una selección curada de 9 fotos (una por categoría representativa) para que se vea como un portafolio editorial y no como un volcado de fotos sin curar. **Las 29 fotos completas quedan disponibles en la carpeta** para ampliar la galería más adelante.

`exterior-lujo-01.jpeg` (patio, cocina exterior y piscina junto a un lago) se usó como imagen del Hero por ser, con diferencia, la foto de mayor impacto visual del lote — comunica de inmediato el nivel de la empresa.

El zip original (`imagenes reales.zip`) y la copia sin renombrar (`_fotos_originales/`) se conservan en la raíz del proyecto como respaldo. **`_fotos_originales/` está en `.gitignore`** para no duplicar 2MB de fotos en el control de versiones — las que realmente usa el sitio ya viven en `public/images/proyectos/`.

---

## 7. Pendientes del cliente (para la próxima reunión)

Estos son los datos reales que faltan para que el sitio deje de tener contenido genérico/placeholder:

- [ ] **Logotipo** en alta calidad (el cliente indicó que sí tiene, pero no lo adjuntó).
- [ ] **Confirmar cuál de los dos números de WhatsApp debe ser el principal** (por ahora el sitio muestra ambos: Jose Andrade y Mario Parra — decisión tomada así a falta de una respuesta clara en el formulario).
- [ ] **Nombre, ubicación y año de cada proyecto** de la galería — hoy las leyendas son genéricas y honestas ("Remodelación de cocina con encimera de cuarzo"), pero no tienen datos específicos porque el formulario no los trajo (pregunta 46 quedó en blanco).
- [ ] **Colores de marca**, si el cliente decide definirlos (marcó que no tiene).
- [ ] **Textos institucionales** más específicos si quieren ampliar "Nosotros" (historia, misión, visión — quedaron vacíos en el formulario).
- [ ] **Dominio y hosting** — el cliente no tiene ninguno todavía (mencionó `www.ampargo.com` como idea).
- [ ] **Correo corporativo** — no existe aún, hay que crearlo.
- [ ] **Políticas legales** (privacidad, términos) — el cliente marcó "no sabemos"; recomendable tener al menos un aviso de privacidad básico antes de publicar, dado que el formulario de contacto recopila datos.

---

## 8. Fase 2 — Roadmap (fuera de alcance de esta pasada)

- **Visualizador 3D de planos** (idea propia del cliente, pregunta 85 del formulario: que el cliente suba un plano en papel y se convierta a 3D). Esto es un proyecto de investigación y desarrollo aparte — reconstrucción 3D a partir de dibujos 2D es un problema de visión por computadora no trivial, no una función de landing page. Requiere su propia propuesta de alcance, tiempo y costo.
- **Google Ads y Google Analytics reales** — el cliente marcó "más adelante" y no tiene cuenta de Google Ads ni Google Business Profile todavía. El sitio está listo para conectar Analytics/Meta Pixel cuando el cliente lo pida (no hay nada que lo bloquee, simplemente no hay claves que insertar todavía).
- **Google Business Profile** — configurarlo cuando el cliente esté listo, ayuda directamente con el SEO local que pidieron.
- **Panel de administración de contenido (CMS)** — el cliente marcó "no, solo informativa por ahora" (pregunta 69). Si más adelante quieren editar contenido ellos mismos, se puede añadir sin rehacer el sitio, dado que el contenido ya vive en archivos tipados y separados de los componentes.
- **Políticas legales definitivas** — redactar privacidad/términos una vez el cliente decida qué datos recopila y cómo los usa.

---

## 9. Cómo retomar este proyecto en una sesión futura

Si vuelves a este proyecto sin memoria de esta conversación: lee este archivo primero, después revisa `content/es.ts` (toda la copy vive ahí) y `app/globals.css` (todo el sistema de diseño vive ahí). El PDF original del cliente y el zip de fotos siguen en la raíz del proyecto como fuente de verdad.
