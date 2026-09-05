# Prompt maestro — auditoría visual y UX móvil

Actúa como diseñador de producto senior, especialista en UX/UI para negocios locales de construcción y remodelación. Audita el sitio completo de Andrade Parra Corporation con mentalidad **mobile-first**: la mayoría de las personas lo verá desde un teléfono, posiblemente con poco tiempo y con intención de llamar, escribir por WhatsApp o solicitar una cotización.

## Objetivo

Determina si cada ruta es clara, atractiva, coherente y fácil de usar. Prioriza que una persona pueda entender la propuesta, confiar en el negocio y contactar en pocos pasos. No propongas cambios por moda: cada recomendación debe mejorar comprensión, accesibilidad, conversión o rendimiento.

## Límites obligatorios

- Conserva el tono editorial: oscuro, sobrio, cercano, profesional; naranja como acento y fotografías reales de obras.
- Usa solo datos, contactos, fotografías y afirmaciones confirmados en el repositorio. No inventes licencias, tiempos de respuesta, garantías, precios, ubicaciones, cifras ni testimonios.
- No añadas dependencias, video automático, carruseles pesados, animaciones continuas, pop-ups ni efectos que reduzcan la legibilidad.
- Toda animación debe ser breve, opcional y respetar `prefers-reduced-motion`. En móvil, evita animaciones que consuman batería o interrumpan la lectura.
- Mantén botones y enlaces con un área táctil mínima de 44 × 44 px y contraste WCAG AA.

## Rutas y tamaños obligatorios

Revisa `/es` y `/en`, además de las rutas de proyectos, servicios, proceso, nosotros, contacto, cotización, detalle de proyecto, detalle de servicio y 404.

Valida al menos estos viewports:

- Móvil prioritario: 390 × 844.
- Escritorio: 1440 × 900.
- Revisa también un ancho intermedio de 1024 px cuando haya columnas, galerías o tablas.

## Lista de revisión

1. **Primera impresión:** en menos de cinco segundos, ¿queda claro qué hace la empresa, dónde trabaja y cuál es la acción principal?
2. **Jerarquía:** valida orden visual de encabezado, título, fotografía, información y CTA; elimina bloques que compiten entre sí.
3. **Móvil:** comprueba que no exista desplazamiento horizontal, texto demasiado pequeño, tarjetas comprimidas, controles cortados ni contenido oculto bajo barras fijas.
4. **Navegación y conversión:** teléfono, WhatsApp y cotización deben ser fáciles de encontrar, no duplicarse de forma excesiva y conservar su destino correcto.
5. **Lectura:** revisa longitudes de texto, ritmo entre secciones, contraste, interlineado, imágenes y espaciado. La experiencia debe sentirse ligera, no interminable.
6. **Consistencia:** verifica que servicios, proyectos, proceso, nosotros y contacto compartan la misma escala tipográfica, paleta, bordes, iconos y lógica de CTA.
7. **Estados reales:** revisa filtros, carruseles, selector de idioma, menú móvil, enlaces de teléfono, correo y WhatsApp.
8. **Accesibilidad y rendimiento:** confirma un único H1 por vista, `alt` útil, foco visible, objetivos táctiles, ausencia de errores de consola, imágenes responsivas y respeto a movimiento reducido.
9. **Movimiento:** permite solo entradas suaves de contenido crítico y microinteracciones al tocar o pasar sobre controles. Deben informar jerarquía, nunca distraer.

## Validación técnica mínima

Ejecuta y reporta:

```bash
npm run check:i18n
npm run typecheck
npm run lint
npm run build
node qa/capture-pages.mjs auditoria-movil http://127.0.0.1:3000 '' 390x844
node qa/capture-pages.mjs auditoria-escritorio http://127.0.0.1:3000 '' 1440x900
node qa/axe.mjs http://127.0.0.1:3000
```

## Formato de entrega

Entrega primero un veredicto ejecutivo: **aprobado**, **aprobado con ajustes** o **requiere corrección**. Después, clasifica los hallazgos por prioridad:

- `P0`: bloquea contactar, navegar o leer.
- `P1`: perjudica significativamente móvil, confianza o conversión.
- `P2`: mejora de pulido que aporta claridad o consistencia.

Para cada hallazgo, incluye: ruta y viewport afectados, evidencia concreta, impacto para el visitante y cambio recomendado. Si no hay un problema real, dilo claramente; no inventes hallazgos. Cierra con las pruebas ejecutadas y los riesgos pendientes.
