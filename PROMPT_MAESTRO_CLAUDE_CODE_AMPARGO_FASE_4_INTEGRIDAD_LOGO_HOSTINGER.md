# PROMPT MAESTRO FASE 4 — INTEGRIDAD DEL FORMULARIO, LOGOTIPO Y HOSTINGER

> Pegar completo en una nueva sesión de Claude Code con Opus 5 / Ultracode, abierta en:
>
> `C:\Users\kevin\OneDrive\Desktop\NUEVO PROYECTO AMPARGO`
>
> Repositorio remoto:
>
> `https://github.com/Alexisz3/andrade-parra-corporation.git`

---

## INICIO DEL PROMPT PARA CLAUDE CODE

Actúa como un equipo senior integrado por **ingeniero de producto Next.js 16, diseñador de identidad, UX writer bilingüe, QA lead, especialista en accesibilidad y release engineer de Hostinger**.

Tu misión es la Fase 4 sobre el estado actual del repositorio. **No rehagas** el diseño, la arquitectura i18n ni el modelo de contenido: todo eso funciona y está verificado en producción. Debes resolver cinco frentes concretos:

1. **tres defectos reales del formulario de cotización**, ya reproducidos, que hoy están costando solicitudes;
2. **simplificar el formulario** eliminando el paso de fotos, que no entrega nada;
3. **rediseñar el isotipo** hacia una versión más amigable, decidida y aprobada;
4. **cerrar los huecos de la auditoría**: 404 sin marca en rutas no reconocidas, `og:image` ausente, zona de servicio;
5. **marcar** (no cambiar) los textos genéricos para revisión del responsable.

Trabaja con evidencia. Inspecciona, reproduce, implementa, prueba en build de producción y entrega un informe verificable. No te detengas después del plan.

### Restricción crítica de release

El sitio está desplegado en **Hostinger con auto-despliegue activado**: todo push a `main` se publica automáticamente por webhook, **sin despliegue de vista previa y sin reversión con un clic**. Un push roto llega a producción de inmediato.

Por tanto:

- Trabaja en una rama (`fase-4-integridad`), **nunca directo sobre `main`**.
- No hagas push a `main` hasta que **todas** las pruebas de aceptación de la sección 12 pasen.
- El dominio definitivo todavía **no** está conectado: hoy vive en `https://darkorange-cobra-592836.hostingersite.com` con `NEXT_PUBLIC_INDEXABLE=false`. No cambies esa variable en esta fase.

---

## 1. Lee antes de editar

Lee completos, sin saltarte comentarios — este proyecto documenta el *porqué* de cada decisión dentro del propio código, y varias trampas de esta fase están explicadas ahí:

- `components/quote/QuoteShell.tsx`
- `lib/assignment.ts`
- `lib/whatsapp.ts`
- `lib/site.ts`
- `i18n/routing.ts`
- `qa/build-brand.mjs`
- `components/BrandLogo.tsx`
- `docs/brand/README.md`
- `docs/QA_DESPLIEGUE_HOSTINGER.md` (informe QA de este despliegue; ver correcciones en la sección 3.6)
- `content/services.ts` — en particular la **REGLA DE CONTENIDO** de la cabecera
- `AGENTS.md`

**Regla de contenido, innegociable en toda esta fase.** Está prohibido afirmar licencias, permisos, certificaciones, años de experiencia, número de obras, garantías, precios, plazos fijos o disponibilidad. Si un texto nuevo necesita un dato así, se deja como marcador visible entre corchetes — nunca se inventa.

---

## 2. Estado actual que debes verificar antes de tocar nada

Ejecuta y confirma:

```bash
npm run typecheck
npm run lint
npm run build
```

Confirma también:

- `git status` limpio salvo lo que tú vayas a crear.
- La rama local está sincronizada con `origin/main`.
- Node 22.x (`package.json` lo exige en `engines`).

---

## 3. Hallazgos ya reproducidos

Estos cuatro defectos están **verificados en el código y en el sitio desplegado**. No los re-investigues desde cero: reprodúcelos una vez para confirmar, corrige, y prueba que la corrección los cierra.

### 3.1 Mario Parra no recibe ninguna solicitud

`lib/assignment.ts` implementa un reparto determinista 50/50 entre los contactos (hash FNV-1a, documentado como *"los dos números son igualmente principales"*). **Ese módulo no se usa en ningún sitio.** `grep -rn "pickContactIndex"` devuelve solo su propia definición.

En `QuoteShell.tsx`, `submitViaWhatsApp()` hace:

```ts
const target = whatsappTargets[0];
```

Resultado: **el 100% de las cotizaciones va a Jose Andrade**. Mario Parra no recibe ninguna.

**Decisión tomada (no la re-abras):** los dos contactos son intercambiables — mismo negocio, la diferencia es solo disponibilidad. **No** se le da a elegir al visitante: se arregla el reparto automático que ya está construido.

**Corrección:** usa `pickContactIndex(seed, whatsappTargets.length)` para elegir el destinatario. La semilla debe ser **determinista respecto a la solicitud** (para que reintentar abra el mismo contacto y no duplique la solicitud en dos teléfonos) y estar compuesta por los datos ya presentes en el borrador — por ejemplo nombre + teléfono + descripción. Respeta la nota de alcance del propio módulo: cuando exista backend, la semilla pasará a ser el identificador de la cotización.

Añade una prueba que verifique el reparto sobre un lote de semillas variadas: ambos contactos deben salir, y la misma semilla debe dar siempre el mismo contacto.

### 3.2 Se puede enviar una cotización sin descripción del proyecto

`QuoteShell.tsx` valida por etapa:

```ts
if (n === 1 && draft.description.trim().length < 4) e.description = t("errDescription");
if (n === 3) { /* nombre, contacto, canal, consentimiento */ }
```

Pero el stepper navega **sin validar**:

```tsx
<QuoteStepper current={step} onStepChange={setStep} />
```

Y `validateStep(3)` **no comprueba la descripción**, porque esa condición solo corre con `n === 1`.

Camino reproducible: entrar en `/es/cotizacion`, pulsar el círculo **«3 Contacto»**, rellenar nombre + teléfono + canal + consentimiento, enviar. Sale una solicitud sin descripción.

Esto reabre exactamente el defecto que el comentario del propio archivo dice haber cerrado: *"un aviso que no se puede responder, que es peor que no recibir nada porque hace perder tiempo"*.

**Corrección:** la validación de envío debe cubrir **todas** las etapas, no solo la actual. Y el stepper no debe permitir saltar a una etapa posterior sin que las anteriores estén válidas — retroceder sí, siempre. Cuando se bloquee un salto, enfoca el primer campo que falta y anúncialo con el patrón `role="alert"` que ya usa el formulario.

### 3.3 El mensaje de WhatsApp promete fotos que nunca llegan

`buildMessage()` incluye:

```ts
if (draft.photoCount > 0) lines.push("", t("msgPhotos"));
```

con `msgPhotos = "Fotos de referencia listas para enviar"` / `"Reference photos ready to send"`.

**No se adjunta ninguna foto ni existe mecanismo para hacerlo.** El enlace `wa.me` solo admite texto (`?text=`); el esquema de URL de WhatsApp no permite adjuntar archivos. El cliente cree que envió fotos; el contratista recibe un mensaje que dice que las hay y no hay nada.

Además, las fotos **no sobreviven** a nada: `photoCount` está excluido a propósito del borrador de `sessionStorage`, y los objetos `File` no son serializables.

**Corrección:** ver sección 5 — se elimina el paso completo.

### 3.4 Las rutas no reconocidas muestran el 404 por defecto de Next

`app/[locale]/not-found.tsx` **existe y está bien hecho** (cabecera, pie, texto traducido, CTA). Pero **no hay `app/not-found.tsx` en la raíz** ni ruta comodín dentro de `[locale]`.

Consecuencia, verificada en producción:

| URL | Resultado |
|---|---|
| `/es/privacidad` (ruta reconocida que llama a `notFound()`) | 22.536 bytes, 404 con marca ✅ |
| `/es/ruta-inventada` (no coincide con ninguna ruta) | 7.200 bytes, pantalla negra por defecto de Next, en inglés ❌ |

**Corrección:** que las URLs no reconocidas también rendericen el 404 con marca, en el idioma correcto. No dupliques el diseño: reutiliza el componente existente.

---

## 4. Correcciones del formulario (secciones 3.1 y 3.2)

Implementa 3.1 y 3.2 conservando lo que ya está bien y está razonado en los comentarios:

- Teléfono **o** correo, indistintamente — exigir ambos pierde solicitudes.
- Servicio y ubicación siguen siendo **opcionales**.
- Los mensajes de error se mantienen en lenguaje humano, con `role="alert"` y `aria-invalid`.
- La confirmación sigue siendo literal: *"WhatsApp está abierto con su solicitud"*, nunca *"hemos recibido su solicitud"*.

---

## 5. Eliminar el paso de fotos: de tres etapas a dos

**Decisión tomada.** El paso de subida de fotos se elimina por completo.

Motivos, para que las decisiones de implementación sean coherentes:

- Hoy el visitante sube fotos que se pierden. Esfuerzo tirado y expectativa falsa.
- Menos etapas = más formularios completados, que es la métrica del negocio.
- WhatsApp maneja fotos **mejor que cualquier enlace**: se ven en el chat, se amplían, se reenvían. Un enlace obligaría a Jose a salir del chat.
- Coste cero, sin backend que mantener.

**Qué hacer:**

1. Elimina la etapa 2 (referencias) y su componente de subida. El stepper pasa a **dos** etapas: *Proyecto* y *Contacto*.
2. Elimina `photoCount` del borrador, la línea `msgPhotos` del mensaje y las claves de traducción que queden huérfanas en `messages/es-US.json` y `messages/en-US.json`. Ejecuta `npm run check:i18n` para confirmar que no quedan claves descuadradas entre idiomas.
3. En la pantalla de confirmación (`handoffBody` y alrededores), **añade una línea nueva** en ambos idiomas invitando a adjuntar las fotos en el propio chat. Debe quedar claro que es opcional y que ayuda. Redáctala tú respetando el tono del sitio: directo, sin exclamaciones, sin promesas.
4. Revisa el resumen lateral: la fila **«IMÁGENES DE REFERENCIA»** desaparece.
5. Comprueba que el borrador guardado en `sessionStorage` de una sesión anterior (que todavía tenga `step: 3`) no rompe el formulario ahora que solo hay dos etapas. Acota el paso restaurado al rango válido.

**No** construyas la subida a almacenamiento en esta fase. Queda para cuando el cliente contrate la persistencia, y entonces las fotos se archivan junto a la solicitud — que es cuando tiene sentido.

---

## 6. Isotipo: dirección aprobada

**Decisión tomada: «Ensamble redondeado».** Se conserva el concepto documentado —un montante que hace de pata de la A y de asta de la P— y se redondean uniones y remates. Cambia la sensación sin tirar la idea.

Referencia de trazo aprobada (viewBox `0 0 80 64`, trazo de ~11 unidades, `stroke-linecap` y `stroke-linejoin` a `round`):

```
montante:  M42 10 V55
riostra:   M42 10 L14 55
cuenco P:  M42 15 H55 A11 11 0 0 1 55 37 H42
travesaño: M23 42 H40      ← única pieza en acento #B8452F
```

Trátalo como **punto de partida, no como entrega**: ajusta proporciones, grosor y encaje óptico hasta que el conjunto lea bien. La prueba que manda es el **tamaño favicon**: si a 20 px se emborrona o las contraformas se cierran, está mal — ajusta grosor y separaciones hasta que se lea.

**Qué tocar, en este orden:**

1. `qa/build-brand.mjs` — la geometría vive en las constantes `BRACE`, `STEM`, `BAR`, `BOWL`. Al pasar de relleno a trazo, la construcción cambia: revisa el archivo entero, no solo esas cuatro líneas.
2. Regenera los seis SVG de `public/brand/` y los PNG de `public/brand/png/`.
3. Espeja la geometría en `components/BrandLogo.tsx` (el comentario ya advierte que ambos deben tocarse juntos) y en `app/icon.svg`.
4. **Reescribe la sección «Construcción» de `docs/brand/README.md`.** Hoy documenta el grosor único de 12 en rejilla de 80×64 y el cálculo del coseno para la riostra: con trazo redondeado esa matemática ya no aplica. Documenta la nueva con el mismo nivel de detalle — es el manual que usará quien venga después.
5. En la lista de usos prohibidos del manual, **conserva** la prohibición de sombras, biseles, degradados y efectos 3D.

Verifica el resultado sobre fondo claro y sobre `#121412`, en las tres variantes (`horizontal`, `compact`, `stacked`) y a 56 / 32 / 20 px.

---

## 7. Página 404 con marca en rutas no reconocidas (sección 3.4)

Haz que una URL que no coincide con ninguna ruta muestre el mismo 404 con marca que ya existe, en el idioma correcto cuando se pueda deducir del prefijo de la URL, y en el idioma por defecto cuando no.

Prueba los tres casos:

- `/es/ruta-inventada` → 404 con marca, en español.
- `/en/made-up-route` → 404 con marca, en inglés.
- `/ruta-sin-prefijo` → 404 con marca, sin bucle de redirección.

Y comprueba que **no rompes** los 404 deliberados que ya funcionan bien: `/es/privacidad` y `/es/terminos` deben seguir devolviendo 404 con marca mientras `PRIVACY_POLICY` y los términos sigan siendo `null`. Ese comportamiento está razonado en `app/[locale]/privacy/page.tsx` y **no se toca**.

---

## 8. `og:image` en portada y cotización

Hoy la portada (ES y EN) y `/cotizacion` declaran `twitter:card: summary_large_image` pero **no tienen `og:image`**: prometen tarjeta con imagen grande y sale vacía. Las fichas de proyecto sí la tienen.

Importa especialmente aquí porque **todo el flujo de conversión pasa por WhatsApp**, y la portada es la URL que Jose y Mario van a compartir: hoy ese enlace aparece sin previsualización, en un negocio cuyo argumento de venta es visual.

Añade `og:image` (1200×630) a portada y cotización, en ambos idiomas, usando una fotografía real del portafolio ya presente en `public/images/`. Verifica que la URL absoluta se construya con `SITE_URL` y no quede relativa.

---

## 9. Zona de servicio en lugar de dirección

**Decisión tomada.** El cliente todavía no ha confirmado si hay oficina física de cara al público. Hasta que lo haga, el sitio **no muestra dirección**: muestra **zona de servicio**.

Revisa dónde hoy se insinúa una ubicación física y asegúrate de que en todos esos puntos se hable de zona de servicio, de forma coherente entre `/contacto`, el pie y los datos estructurados JSON-LD. El dato verdadero disponible es *«Houston y alrededores»* / *«Houston and surrounding areas, TX»*.

En JSON-LD, esto significa `areaServed` y **no** una `PostalAddress` inventada. Si el esquema que uses exige dirección, usa la forma mínima admitida sin fabricar calle ni número.

Deja un comentario en el código apuntando que esto se revisa cuando el cliente confirme la oficina — es también el punto 06 del checklist de `docs/MATERIAL_PENDIENTE_CLIENTE.html`, que necesita la dirección para la ficha de Google Business.

---

## 10. Ampliar imágenes en proyectos (lightbox)

En las fichas de proyecto y en la cuadrícula de `/proyectos`, al seleccionar una imagen debe poder verse ampliada. Es una petición explícita: el propietario juzga el trabajo por el remate del azulejo, y hoy no puede acercarse.

Requisitos:

- Funciona con teclado: se abre con Enter/Espacio, se cierra con Escape, el foco queda atrapado dentro mientras está abierto y vuelve a la imagen de origen al cerrar. `MobileMenu.tsx` ya resuelve exactamente ese patrón de foco — reutiliza el enfoque, no lo reinventes.
- En móvil, cerrar debe ser fácil con el pulgar; objetivo táctil mínimo 44 px.
- No añade ninguna librería nueva.
- Bloquea el scroll de fondo mientras está abierto, compensando el ancho de la barra como ya hace `MobileMenu.tsx`.
- No degrada la carga: la imagen ampliada usa el mismo pipeline de `next/image`.

**Aviso de contexto:** las 29 fotos actuales llegaron por WhatsApp y están limitadas a 960 px de ancho — por eso `next.config.mjs` topa los `deviceSizes` ahí. Ampliar una foto de 960 px la va a mostrar blanda. No subas el tope ni intentes reescalar: haz que el visor respete la resolución real y se vea nítido dentro de ese límite. Los originales están pendientes de que el cliente los envíe (punto 04 de `MATERIAL_PENDIENTE_CLIENTE.html`).

---

## 11. Textos genéricos: marcar, no cambiar

**No reescribas nada de contenido en esta fase.**

Recorre los textos visibles del sitio en ambos idiomas y produce un archivo `docs/TEXTOS_A_REVISAR.md` con una tabla:

| Archivo y clave | Texto actual (ES) | Texto actual (EN) | Por qué suena genérico | Propuesta |
|---|---|---|---|---|

Criterios de «genérico»: frases intercambiables que podrían describir a cualquier constructora, superlativos sin respaldo, relleno de marketing, y traducciones que suenan a traducción en vez de a original.

Cada propuesta debe respetar la REGLA DE CONTENIDO: nada de licencias, años, número de obras, garantías, precios ni plazos. Si una mejora real necesitaría un dato así, dilo en la columna «Por qué» y deja la propuesta entre corchetes como marcador.

El responsable decidirá cuáles se aplican. Esa aplicación es una fase posterior.

---

## 12. Pruebas de aceptación obligatorias

Ninguna de estas es opcional. Documenta el resultado de cada una con evidencia.

**Formulario**

1. Con el stepper, intentar saltar a la última etapa con la primera vacía → bloqueado, con foco y anuncio en el primer campo que falta.
2. Enviar sin descripción por cualquier camino → imposible.
3. Enviar sin nombre, sin canal o sin consentimiento → bloqueado.
4. Teléfono sin correo → permitido. Correo sin teléfono → permitido. Ninguno de los dos → bloqueado.
5. Un lote de solicitudes variadas reparte entre **ambos** contactos; la misma solicitud abre siempre el mismo contacto.
6. El mensaje de WhatsApp llega completo, bien codificado, sin ninguna mención a fotos.
7. La confirmación invita a adjuntar fotos en el chat, en el idioma correcto.
8. Un borrador antiguo con `step: 3` en `sessionStorage` no rompe el formulario de dos etapas.

**404**

9. `/es/ruta-inventada`, `/en/made-up-route` y `/ruta-sin-prefijo` → 404 con marca, idioma correcto, sin bucles.
10. `/es/privacidad` y `/es/terminos` → siguen devolviendo 404 con marca (comportamiento deliberado intacto).

**Logotipo**

11. Las tres variantes se ven correctas sobre claro y sobre `#121412`.
12. A 20 px el isotipo se lee: las contraformas no se cierran.
13. `public/brand/` y `app/icon.svg` están regenerados y coinciden con `BrandLogo.tsx`.
14. `docs/brand/README.md` documenta la construcción nueva, no la vieja.

**Resto**

15. Portada ES, portada EN y cotización tienen `og:image` con URL absoluta.
16. El lightbox cumple los requisitos de teclado, foco y móvil de la sección 10.
17. Ninguna vista muestra dirección postal; la zona de servicio es coherente entre `/contacto`, pie y JSON-LD.
18. `docs/TEXTOS_A_REVISAR.md` existe y está completo.

**Regresión — el sitio ya funcionaba, no lo rompas**

19. `npm run typecheck`, `npm run lint`, `npm run build` en verde.
20. `npm run check:i18n` sin claves descuadradas.
21. `npm run qa:functional` y `npm run qa:axe` sin regresiones.
22. Las 19 rutas principales siguen devolviendo 200 en ambos idiomas.
23. El selector de idioma sigue preservando página, entidad y filtros: `/es/proyectos?categoria=kitchens` → `/en/projects?categoria=kitchens`.
24. Cero desbordamiento horizontal a 375 px; objetivos táctiles ≥44 px.
25. Sin errores de JavaScript en consola en ninguna vista.

---

## 13. Fuera de alcance para código — acciones humanas

Estas **no** son tareas de programación. Inclúyelas en el informe final como pendientes del responsable, no intentes resolverlas con código:

- **La CSP de la aplicación no llega al visitante.** El CDN de Hostinger (`server: hcdn`) sobrescribe la cabecera *después* de que la app la genera, y sirve `upgrade-insecure-requests` en su lugar. Ningún cambio en `next.config.mjs` lo evita — es un ticket a soporte de Hostinger. **No inventes un sustituto ni desactives la CSP del código:** debe seguir ahí para cuando se resuelva, y para cualquier otro entorno.
- **El `robots.txt` de la aplicación tampoco se sirve.** `app/robots.ts` genera correctamente `User-agent: * / Disallow: /`, pero Hostinger sirve una versión propia que bloquea solo a Googlebot y permite al resto. Debe verificarse **inmediatamente después** de conectar el dominio definitivo: si la sobrescritura persiste, el `robots.txt` real —con el enlace al sitemap— nunca se servirá, y eso es un problema de SEO directo para un negocio que depende de búsquedas locales en Houston.
- **Falta la cabecera HSTS**, que en Vercel venía por defecto.
- **El canal «Email» del formulario sigue sin backend.** Hoy se ofrece y se avisa de que no está disponible. Decidir si se deshabilita visiblemente o se retira hasta que exista correo de empresa.

---

## 14. Informe final

Al terminar, entrega un informe compacto pero comprobable con:

1. **Resultado:** qué cambió y cuál es el estado real de cada frente.
2. **Defectos:** cómo reprodujiste cada uno de los cuatro de la sección 3 y cómo confirmaste que quedan cerrados.
3. **Logotipo:** decisiones de proporción y grosor, y evidencia visual a 56 / 32 / 20 px sobre ambos fondos.
4. **Formulario:** estructura final de dos etapas y qué se eliminó exactamente.
5. **Pruebas:** comandos ejecutados, número de pruebas, navegadores y viewports, y resultados.
6. **Evidencia visual:** rutas de las capturas finales.
7. **Archivos clave:** lista de archivos creados y modificados con su propósito.
8. **Pendientes humanos:** los de la sección 13, en el estado en que queden.

**No hagas push a `main` hasta que la sección 12 esté completa en verde.** Recuerda: en Hostinger, `main` es producción.
