# Pulido visual y criterio de entrega

Fecha: 4 de septiembre de 2026. Trabajo local sobre el proyecto Next.js existente; sin despliegue ni cambios de dominio.

## Conclusión sincera

No recomiendo otro rediseño general. La identidad carbón, marfil y naranja y el lenguaje arquitectónico son adecuados. Sí eran necesarios cambios de composición móvil, reducción de información repetida y simplificación del formulario. Se implementaron en esta pasada.

Mi valoración visual actual es aproximadamente **8,5/10**, una opinión profesional, no una medición automática. No lo llamaría 10/10: las fotos disponibles y la evidencia de proyectos terminados siguen limitando la presentación. Tampoco equivale a una aprobación para producción.

## Referencias examinadas

- [studioMET](https://www.studiomet.com/): revisión visual y del DOM. Referencia para dar protagonismo a la arquitectura y reducir competencia entre navegación, texto y fotografía. No se copiaron imágenes ni contenido comercial.
- [Frankel Design Build](https://www.frankeldesignbuild.com/): revisión visual y del DOM de navegación, servicios y contacto. Referencia comparativa, no plantilla para reproducir sus menús, premios o afirmaciones.
- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): fundamento para mostrar primero las opciones esenciales y revelar las secundarias cuando se necesitan. Aplicado a los detalles opcionales de cotización; no se eliminaron campos.

## Cambios aplicados

1. **Portada móvil:** fotografía separada del bloque de lectura, con proporción horizontal; deja de ampliarse para cubrir toda una pantalla vertical. En escritorio se conserva la composición sobre fotografía. Título más contenido, botones claros y marca visible en la cabecera móvil.
2. **Servicios en inicio:** cinco destinos visibles con fotografías sin el oscurecimiento anterior. Lista compacta en celular y cinco columnas en escritorio. Los enlaces siguen llevando al detalle de cada servicio.
3. **Servicios:** el servicio principal ocupa una fila completa en tablet y vuelve a su posición vertical en escritorio amplio. Esto elimina el desequilibrio de cinco tarjetas en dos columnas. Se corrigió el padding de los extremos del bloque de confianza.
4. **Proyectos:** catálogo de tres columnas en escritorio para ampliar las fotos. Se retiró la repetición de categoría, estado y ubicación del destacado. Las miniaturas aclaran que cambian entre proyectos, no entre fotos de una misma obra.
5. **Proceso:** los cinco pasos son visibles en una lista vertical en móvil. No dependen de descubrir un carrusel. La evidencia fotográfica aclara que corresponde a distintas obras; la foto del exterior en construcción ya no se presenta como «Resultado» terminado.
6. **Cotización:** servicio y descripción aparecen primero. Ubicación, fechas, medidas, presupuesto y demás información adicional siguen disponibles en un desplegable opcional. El resumen muestra los datos realmente escritos, incluida la descripción y el contacto, sin filas vacías que parezcan tareas pendientes.
7. **Validación:** una superficie no positiva genera un error; si el campo está plegado, se abre antes de recibir el foco.
8. **Menos repetición:** pie de página sin otra promoción y otro botón de cotización; conserva navegación y canales de contacto. El bloque de valores del inicio utiliza una lista más ligera en móvil.
9. **Movimiento:** entradas breves y desplazamiento sutil de flechas al interactuar, sin bucles ni nuevas librerías. Se mantiene el respeto a `prefers-reduced-motion`.
10. **Assets:** `demolicion-01.jpeg`, ya utilizada por Proceso, estaba ignorada por Git. Se retiró únicamente esa exclusión. Las exclusiones por privacidad permanecen intactas. La prueba de integridad ahora recorre todas las páginas, componentes y contenido.

## Verificación de esta pasada

- Compilación de producción: correcta; TypeScript correcto y 49 páginas estáticas generadas.
- ESLint: correcto.
- Integridad: 406 claves por idioma, 7 proyectos y 14 fotos referenciadas disponibles para incluir en la entrega.
- Validación de configuración: 16/16 casos. Pruebas de reparto de contactos: correctas. Estas pruebas locales de Node muestran un aviso existente de autodetección de módulos, no un fallo de la aplicación.
- Navegador y DOM: **63 combinaciones de página y ancho, sin desbordamiento horizontal**. Español: siete páginas a 390, 430, 768, 1024, 1280, 1440 y 1920 px. Inglés: siete páginas a 390 y 1440 px. Se comprobó adicionalmente la portada a 320 px. El navegador reserva espacio para su barra de desplazamiento.
- Capturas revisadas de portada, servicios, proceso y cotización, con tamaños móviles y de escritorio según el caso. Una captura larga de servicios presentó artefactos de unión; se contrastó con el DOM, que contiene cinco servicios y un solo footer. Esa captura no se trató como un defecto real del sitio.
- Interacciones verificadas: campos obligatorios y foco, avance a contacto, resumen con datos, error de superficie plegada, cambio de idioma conservando ruta, cierre del menú por Escape y retorno de foco, siguiente proyecto y filtro de cocinas.
- Versión compilada servida temporalmente en puerto 4333: portada móvil, cotización ES/EN móvil, servicios a 768 px y proyectos a 1440 px. Sin desbordamiento ni errores registrados en la consola consultada. No se enviaron solicitudes reales.
- No se repitieron Lighthouse, axe ni Safari/WebKit en esta pasada. Los resultados de la auditoría anterior no se presentan como mediciones de este nuevo diseño.

## Qué cambiaría después, y qué conservaría

| Prioridad | Recomendación | Motivo |
| --- | --- | --- |
| Alta | Conseguir originales de trabajos terminados y varias vistas por proyecto | Una foto real, nítida y bien encuadrada aporta más confianza que otro efecto visual. No sustituir obras reales por renders generados. |
| Alta | Completar los casos de proyecto con alcance y resultados confirmados por la empresa | Muchos proyectos solo tienen una fotografía; no simular una galería, fechas, dimensiones o resultados que no se conocen. |
| Media | Validar el recorrido con propietarios reales desde un teléfono | El DOM no determina si una persona comprende y completa el recorrido sin dudas. |
| Conservar | Paleta, estilo arquitectónico, servicios y contacto directo | Funcionan como sistema y no justifican reiniciar la web. |
| Evitar | Más tarjetas promocionales, estadísticas inventadas, videos automáticos y animaciones continuas | Añadirían ruido y peso sin resolver la falta de evidencia visual. |

## Pendientes de lanzamiento

Continúan los pendientes de la auditoría anterior: privacidad aprobada, dominio/HTTPS e indexación configurados, recepción real de solicitudes confirmada y comprobación en teléfonos físicos. No se inventaron textos legales ni se certificó entrega de WhatsApp/correo. `demolicion-01.jpeg` debe incluirse junto con los cambios al preparar el commit o paquete de despliegue; quitar una exclusión no constituye un commit.

## Archivos modificados en esta pasada

- `.gitignore`
- `app/globals.css`
- `app/[locale]/services/page.tsx`
- `app/[locale]/projects/page.tsx`
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/ProjectSpotlight.tsx`
- `components/ProcessTimeline.tsx`
- `components/home/HomeHero.tsx`
- `components/home/ServiceCards.tsx`
- `components/home/ValueProps.tsx`
- `components/quote/QuoteShell.tsx`
- `components/quote/QuoteSummary.tsx`
- `messages/es-US.json`
- `messages/en-US.json`
- `qa/check-i18n.mjs`
- `qa/audit-interactions.mjs`
- `docs/PULIDO_FINAL_Y_CRITERIO_DISENO.md`

La fotografía desexcluida no fue retocada ni reemplazada. No se crearon commits, no se instalaron dependencias y se conservaron los demás cambios existentes del usuario.
