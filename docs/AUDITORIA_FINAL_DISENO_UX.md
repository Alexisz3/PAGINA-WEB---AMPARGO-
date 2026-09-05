# Auditoría final — Andrade Parra Corporation

Fecha: 4 de septiembre de 2026. Revisión local, no certificación del dominio público.

## Alcance y método

Inicio, Servicios, Proyectos, Proceso, Nosotros, Contacto y Cotización en ES y EN: 14 rutas × 7 anchos (390, 430, 768, 1024, 1280, 1440, 1920), 98 vistas iniciales. Navegación real con Chromium, capturas completas y recortes de lectura, revisión de código y de controles. Fichas de servicios/proyectos incluidas en enlaces y pruebas funcionales; no se afirma una matriz visual exhaustiva de cada ficha. Se comprobó también el build de producción local, separado del servidor de desarrollo.

La captura inicial reutilizaba una pestaña y produjo algunos rectángulos negros al cambiar de tamaño, pese a tener imágenes decodificadas sin error. La recarga independiente sobre producción mostró las fotografías correctamente; las capturas de verificación usan documentos nuevos. No se sustituyeron imágenes para ocultar un artefacto de captura.

No se enviaron mensajes reales, no se hicieron llamadas, no se publicaron cambios ni se modificaron DNS. Los enlaces externos de entrega se interceptan en pruebas. Los números, nombres y correo se contrastaron con la configuración del proyecto; esto no acredita titularidad, disponibilidad del receptor ni entrega final.

## Informe previo a las correcciones

Los hallazgos principales se comunicaron en la conversación antes de editar la aplicación. La tabla conserva el estado observado originalmente y distingue los ajustes del material pendiente.

| Prioridad | Página / elemento | Problema observado | Impacto para el usuario | Recomendación / tratamiento |
|---|---|---|---|---|
| CRÍTICO para publicar así | Todas / configuración pública | Canonical y OG apuntan a localhost; robots contiene noindex/nofollow | Una publicación con esta configuración no presenta el dominio real ni permite indexación | Mantenerlo en local. Configurar NEXT_PUBLIC_SITE_URL y activar NEXT_PUBLIC_INDEXABLE únicamente al preparar el dominio definitivo; verificar HTTPS, sitemap y metadata allí |
| ALTO | Proyectos ES/EN / destacado móvil | A 390 y 430 px la información ocupa 496 px dentro de una tarjeta de 342/382 px; se recortan título, metadatos y flecha derecha | Oculta la prueba principal del trabajo de la empresa y un control de navegación | Corregidas las columnas con mínimos cero y contenido adaptable, sin ocultar el problema mediante overflow global |
| ALTO | Cotización / cambio al contacto | Tras Continuar en 390 px, nombre estaba a −921 px y scrollY en 1382; se veía el footer | El usuario cree que desapareció el formulario o que terminó | Añadidos foco y desplazamiento al comienzo de cada etapa, sin activar automáticamente el teclado del teléfono |
| ALTO pendiente | Cotización / privacidad | PRIVACY_POLICY y TERMS_OF_SERVICE son null; las rutas están desactivadas por diseño | Falta una explicación aprobada y accesible sobre el tratamiento de los datos | Solicitar a la empresa el texto aprobado, publicarlo y enlazarlo. No se ha redactado una política ni se ha añadido un enlace que dé 404. Esto no es un dictamen jurídico |
| ALTO pendiente de aceptación | Cotización / entrega | WhatsApp y mailto preparan el mensaje; no hay backend que confirme recepción | El visitante debe completar el envío en su aplicación; un cliente de correo ausente puede impedirlo | La interfaz ya lo explica y ofrece reabrir. Validar recepción real con Jose y Mario y correo antes de entregar; no fingir confirmación de envío |
| MEDIO | Cotización / fuente del contacto | Recomendación queda vacía en el selector al cambiar a EN | Pérdida aparente de información y resumen con idioma mezclado | Valores estables, etiquetas traducidas y compatibilidad con borradores anteriores |
| MEDIO | Cotización / accesibilidad | Descripción y consentimiento sin declaración required; el error de canal intentaba enfocar un div | El teclado y lector de pantalla no reciben orientación suficiente | Marcadores y semántica de obligatoriedad, error asociado al grupo y foco en el primer radio |
| MEDIO | Todas / idioma | Listbox sin foco inicial ni navegación con flechas, Home/End | Experiencia incompleta para teclado | Foco en idioma actual, flechas, Home/End, Escape, cierre al salir y autodenominaciones Español/English |
| MEDIO | Servicios, Proyectos / Open Graph | Heredan el título y URL del inicio | Vista previa compartida poco precisa | Título, descripción y URL propios, conservando imagen común |
| MEDIO | Nosotros, Proceso, Contacto / Open Graph | Sobrescriben el objeto OG y pierden imagen | Compartir por mensajería puede generar una vista previa incompleta | Heredar imagen/marca/idioma y definir texto y ruta específicos |
| MEDIO | Proyectos / lupa de catálogo | Se había excluido ZoomButton de la variante catalog; prueba funcional 97/98 | No permite ampliar la foto sin salir del índice | Restaurado el visor existente, fuera del enlace para no anidar controles |
| MEDIO, mejora editorial | Home/servicios/contacto / fotografía | Fotos pequeñas, varios fondos repetidos y oscurecidos; en escritorio grande se nota suavidad | Reduce la sensación premium aunque acredita trabajo auténtico | Pedir originales de las mismas obras, idealmente de 1920 px o más. Conservar los actuales hasta disponer de material aprobado; no sobreenfocar ni generar obras |
| MEDIO, no bloqueante | Home, Nosotros, footer / repetición | Se repiten calidad/confianza/atención y CTA final seguido de otro CTA en footer | En móvil prolonga la lectura y resta singularidad | Mantener ahora la estructura aprobada; siguiente mejora editorial con detalles reales de la empresa, sin inventar promesas ni métricas |
| MEDIO, no bloqueante | Cotización / carga de campos | Diez campos de proyecto visibles antes del contacto; pide teléfono y correo | Puede aumentar abandono aunque la mayoría del primer paso es opcional | Valorar con el cliente agrupar detalles opcionales. No se cambian reglas comerciales unilateralmente |
| BAJO | Contacto / icono de correo | Símbolo @ en lugar de icono del sistema | Inconsistencia de acabado | Sustituido por sobre SVG de la colección LineIcon existente, sin dependencia nueva |
| BAJO | Heroes / animación | Zoom automático infinito en escritorio | Movimiento innecesario y trabajo continuo del navegador | Entrada finita de 1.8 segundos; sin movimiento de foto en móvil y respetando reduced motion |
| BAJO | Barra móvil / zona segura | Reserva inferior fija de 64 px no contempla el área de gestos iOS | El extremo del footer podría quedar bajo la barra | Reserva añadida con env(safe-area-inset-bottom); requiere comprobación final en iPhone físico |
| BAJO, no bloqueante | Cabecera móvil / identidad | Solo isotipo AP hasta sm; nombre completo visible en footer, no en hero móvil | Reconocimiento de marca inicial menos explícito | Considerar logotipo compacto con nombre en una futura aprobación; no cambiar ahora proporciones del header |
| YA ESTÁ BIEN | Global / identidad | Carbón, marfil y naranja coherentes; bordes y grilla arquitectónica discretos | Empresa identificable, no aspecto SaaS | Conservar |
| YA ESTÁ BIEN | Home / jerarquía | Qué hacen, Houston y dos acciones comprensibles; título sin escala desmedida | Orientación comercial rápida | Conservar hero. No reintroducir timeline eliminado de portada por petición previa |
| YA ESTÁ BIEN | Servicios / catálogo | Cinco categorías reales con fotografía y acceso al detalle | Se entiende alcance general y siguiente paso | Conservar composición asimétrica; en tableta la quinta tarjeta deja espacio lateral por la rejilla de dos columnas, no es desbordamiento |
| YA ESTÁ BIEN | Proceso / secuencia | Cinco etapas, iconos coherentes y fotografías de ejecución; carril desplazable en móvil | Más comprensible que una lista vacía y evita cinco pantallas largas | Conservar; comprobar acceso a las cinco etapas con teclado/deslizamiento. El recorte de la siguiente tarjeta es intencional, no el fallo del destacado |
| YA ESTÁ BIEN | Nosotros / autenticidad | Fotografías existentes y descripción sin premios, certificaciones o estadísticas añadidas | Credibilidad más defendible que cifras inventadas | Conservar; no se afirma haber verificado externamente cada declaración de la empresa |
| YA ESTÁ BIEN | Contacto / datos | Jose Andrade: (832) 794-0720; Mario Parra: (832) 652-4660; contacto@ampargo.com; Houston y alrededores | Distintos medios de contacto y territorio comprensibles | Conservar fuente única; no publicar domicilio privado |
| YA ESTÁ BIEN | Cotización / resumen y borrador | Resumen lateral desktop y colapsable móvil; sessionStorage; instrucciones sobre adjuntar fotos tras abrir la aplicación | Reduce ruido y conserva trabajo durante la sesión | Conservar. No promete subir archivos que el formulario no admite |

## Juicio visual y recorrido comercial

La dirección visual es adecuada para una constructora real: sobria, con obras existentes y CTA visibles. No necesita otro rediseño completo. No la calificaría todavía como una presentación editorial premium impecable: pesan la resolución de los fondos, la repetición de las mismas obras y algunos textos intercambiables. No se encontraron motivos para agregar glow, video, animaciones continuas, estadísticas o imágenes artificiales.

En desktop los anchos máximos mantienen la lectura y las tarjetas quedan alineadas. En 1024 px la cabecera está más densa y el destacado es estrecho; es un punto de control específico en la verificación. En móvil, el bloque de contacto rápido ayuda a convertir y desaparece en cotización; la longitud de las páginas viene sobre todo del catálogo, bloques de confianza y footer. El contraste y el tamaño de lectura son aceptables, pero la auditoría automática no sustituye usuarios reales.

El recorrido servicio → obra real → cotización es reconocible. Las miniaturas del destacado cambian entre proyectos, no entre fotos de una sola obra; las fichas y el visor existente muestran las fotos disponibles. No se fabrica una galería abundante donde solo existe una foto.

## Verificación posterior

Build final de producción en `http://127.0.0.1:4332`, generado después de las correcciones. El servidor habitual de desarrollo sigue en el puerto 3000; no hubo despliegue público.

| Comprobación | Resultado |
|---|---|
| Compilación Next / TypeScript | Correcta, código de salida 0; 49 páginas estáticas generadas |
| ESLint | Sin errores ni advertencias en la revisión final |
| Traducciones | 400 claves por idioma, sin divergencias; referencias de proyectos verificadas |
| Variables y reparto de contactos | Ambos scripts pasan; no supone configurar un dominio ni comprobar recepción real |
| Matriz responsive posterior | 98/98 vistas, ninguna ruta con overflow horizontal ni texto recortado detectado |
| Consola / recursos | 0 errores de consola, 0 respuestas de recursos >=400 y 0 imágenes rotas en la matriz |
| Enlaces internos encontrados | 38/38 responden correctamente |
| Assets explícitos | icon.svg, apple-icon.png, OG home/quote, robots.txt y sitemap.xml: 200 |
| Privacidad / términos | 404 intencional mientras no haya textos aprobados; no enlazados como si existieran |
| Pruebas funcionales Chromium | 98/98 tras restaurar la lupa y actualizar el comprobador |
| Regresiones añadidas | 6/6: foco/posición del segundo paso, error de canal, persistencia de fuente al traducir, foco del idioma, flechas y Escape |
| Axe | 27 escenarios (13 rutas × 2 tamaños y menú abierto), 0 infracciones detectadas; no equivale a certificación de accesibilidad |
| Pruebas funcionales WebKit | 98/98; motor automatizado, no un iPhone físico |
| Rendimiento aislado | Medianas de 3 muestras por página: Inicio 86, Proyectos 85 y Cotización 90/100 |

Evidencia numérica del formulario móvil: antes de corregir, `nameTop=-921.2` y `scrollY=1382`; después, `nameTop=227.8`, `scrollY=233` y foco en `quote-stage`. La opción Recomendación pasa a Referral conservando su valor estable. El error del canal enfoca un radio y anuncia el grupo inválido.

Los originales fotográficos examinados miden como máximo 960 px de lado largo. El fondo repetido de terraza/piscina mide 960×540 y unos 102 KB; en 1920 px se amplía al doble de ancho. Las otras fotos están aproximadamente entre 23 y 140 KB. Son archivos ligeros, pero no fuentes de alta definición para grandes heroes. No se alteraron.

Se ejecutaron las herramientas locales directamente con Node porque el lanzador `npm` del perfil apuntaba a una ubicación inaccesible desde esta sesión. No se modificaron dependencias ni el entorno global. Los avisos MODULE_TYPELESS_PACKAGE_JSON de los dos scripts TypeScript no son errores de compilación; no se cambió el tipo de módulos de todo el proyecto para silenciarlos.

Las primeras pruebas revelaron un fallo real (lupa ausente) y fragilidad del comprobador: etiquetas antiguas del idioma, selección de servicio antes de completar hidratación y esperas fijas de navegación/preselección. Se actualizaron las etiquetas a la interfaz real y las esperas a condiciones verificables; no se eliminaron verificaciones para hacer pasar el resultado.

### Rendimiento móvil de laboratorio

Lighthouse sobre el build final, sin ejecutar otra batería de navegadores simultáneamente, mediana de tres muestras por ruta:

| Página | Rendimiento | Accesibilidad LH | Buenas prácticas | SEO local | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Inicio | 86 | 100 | 100 | 61 | 3.83 s | 0.000 | 179 ms |
| Proyectos | 85 | 100 | 100 | 61 | 3.97 s | 0.000 | 181 ms |
| Cotización | 90 | 98 | 100 | 58 | 3.06 s | 0.000 | 229 ms |

No afirmo que la web ya sea rápida en todos los teléfonos. La carga principal tiene margen de mejora; hay que repetir en el hosting definitivo con caché/CDN y un móvil real. No hubo saltos de layout medidos en estas muestras. La nota SEO está afectada por las restricciones del entorno local, que sigue intencionalmente sin indexar. Axe y Lighthouse miden conjuntos distintos, por eso sus resultados de accesibilidad no deben confundirse.

Se conserva también la ejecución simultánea inicial (57/61/60 de rendimiento y TBT >2 s) para no ocultar la variabilidad: no se usa como referencia comparable, porque competía con WebKit en la misma máquina. La pasada inicial de una sola muestra fue 82/84/90. Ninguna de estas cifras es una promesa de rendimiento de campo ni prueba de una mejora porcentual.

## Archivos de esta intervención

La carpeta del proyecto ya contenía cambios anteriores. Esta lista corresponde exclusivamente a esta auditoría, no a todo el diff preexistente.

Aplicación (15 archivos):

- `app/[locale]/about/page.tsx`
- `app/[locale]/contact/page.tsx`
- `app/[locale]/process/page.tsx`
- `app/[locale]/projects/page.tsx`
- `app/[locale]/services/page.tsx`
- `app/globals.css`
- `components/ProjectSpotlight.tsx`
- `components/ProjectCard.tsx`
- `components/LocaleSwitcher.tsx`
- `components/MobileContactBar.tsx`
- `components/icons/LineIcon.tsx`
- `components/quote/DeliveryChannelSelector.tsx`
- `components/quote/QuoteShell.tsx`
- `components/quote/QuoteSummary.tsx`
- `lib/quote-source.ts` (nuevo)

Pruebas y documentación (5 archivos):

- `qa/final-audit.mjs` (nuevo: capturas, recortes internos, metadata, enlaces e imágenes)
- `qa/audit-boards.mjs` (nuevo: hojas de comparación de capturas)
- `qa/audit-interactions.mjs` (nuevo: reproducción y regresiones del formulario/idioma)
- `qa/functional.mjs` (expectativas de idioma y esperas basadas en condiciones)
- `docs/AUDITORIA_FINAL_DISENO_UX.md` (este informe)

Capturas e informes generados: `qa/shots/final-before/`, `qa/shots/final-after/`, `qa/shots/interactions-before/` y `qa/shots/interactions-after/`. Son evidencia de QA, no archivos publicados del sitio. Los logs de ejecución conservan los intentos iniciales y los resultados verificados en `qa/shots/final-after/logs/`:

`final-after.log`, `final-assignment.log`, `final-axe-after.log`, `final-axe.log`, `final-before.log`, `final-boards.log`, `final-build-after.log`, `final-build-verified.log`, `final-build.log`, `final-env.log`, `final-functional-after.log`, `final-functional.log`, `final-i18n.log`, `final-interactions-after.log`, `final-interactions-before.log`, `final-lighthouse-after.log`, `final-lighthouse-before.log`, `final-lighthouse-verified.log`, `final-lint-after.log`, `final-lint-verified.log`, `final-lint.log`, `final-webkit.log` y `final-webkit-verified.log`.

## Condiciones de entrega

1. Texto de privacidad aprobado por la empresa y publicado en ambos idiomas; enlazarlo desde cotización/footer cuando exista.
2. Dominio definitivo y HTTPS, variables públicas correctas, indexación intencional y revisión de canonical/OG/sitemap en el dominio real.
3. Una solicitud real recibida y confirmada por cada destinatario/canal, acordada con el cliente. No se realizó durante esta auditoría.
4. Prueba final en Safari de iPhone y Chrome de Android reales, incluido teclado, área segura y apertura de aplicaciones. La emulación local no acredita estos dispositivos.
5. Mejores originales fotográficos como mejora de calidad; no bloquean el funcionamiento, pero limitan la puntuación visual de escritorio.

## Veredicto de entrega

**❌ NO APTO TODAVÍA PARA PRODUCCIÓN**, entendido como una entrega definitiva al cliente sobre dominio público, no como un rechazo al diseño. Los defectos visuales y de interacción principales están corregidos; faltan condiciones de lanzamiento y aceptación que no se pueden certificar en localhost.

Valoración profesional, no medición automática: diseño 8/10; consistencia 8/10; responsive 9/10; UX 8/10; profesionalismo 8/10; confianza comercial 7/10; accesibilidad 8/10; preparación para producción 6/10. El material visual de baja resolución, la repetición editorial y los pendientes de privacidad/recepción explican por qué no son notas máximas.

Yo todavía no entregaría esta web al cliente como terminada para captar solicitudes reales hasta cerrar las condiciones anteriores. Sí está preparada para una revisión de aceptación del diseño, sin otro rediseño general.
