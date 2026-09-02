# Andrade Parra Corporation — Manual de marca

**General Remodeling** · Houston, Texas

---

## Escritura del nombre

| | Correcto |
|---|---|
| Nombre | `Andrade Parra Corporation` |
| Descriptor | `General Remodeling` |
| Sigla | `AP` |

**El nombre no se traduce.** Ni en la versión en español, ni en metadatos, ni
en datos estructurados. En el cuerpo de una página en español sí puede
hablarse de «remodelación general» como descripción del servicio, pero el
descriptor **dentro del logotipo** permanece siempre en inglés y exacto.

Formas incorrectas que han circulado y no deben usarse jamás: *Ampargo*,
*Andrade Parra Coppration*, *Andrade Parra Copporation*, *Andrade Parra
Cooperation*, *General Remodelimg*, *General Remodelings*, *APC Corporation*.

La sigla `AP` vive en el isotipo, el favicon y la variante compacta. **Nunca
sustituye al nombre completo** en la versión principal del logotipo.

---

## Concepto: «El ensamble»

Un único montante vertical hace de pata derecha de la **A** y de asta de la
**P**: dos apellidos sostenidos por una misma estructura. El travesaño de la A
es la pieza que ata la riostra al montante, igual que un tirante ata una
escuadra de armadura.

La idea nace del oficio: remodelar es unir obra nueva a una estructura que ya
existe, y esa unión —el ensamble— es donde se ve si el trabajo está bien hecho.

Se descartaron dos rutas alternativas: una escuadra de carpintero (incumplía la
prohibición de herramientas) y un umbral con un lateral desplazado (el
desplazamiento se perdía por completo a tamaño de favicon).

### Construcción

La versión actual es «**ensamble redondeado**»: el mismo concepto, ejecutado
con **trazo** de uniones y remates redondos en lugar de polígonos macizos de
esquina viva. Suaviza el gesto sin tocar la idea.

Ese cambio de relleno a trazo cambia lo que significan las coordenadas. Antes
describían el **contorno** de la pieza; ahora describen su **eje**. El borde
visible cae siempre a la mitad del grosor a cada lado del eje, y cada remate
redondo añade otra mitad de grosor **más allá** del extremo, en la dirección
del trazo.

De ahí se sigue algo que conviene decir explícitamente porque estuvo
documentado al revés: **ya no hay corrección por coseno**. La versión maciza
dibujaba la riostra 15 unidades de ancho en horizontal para que su grosor
perpendicular fuese 12, porque en un polígono medir en horizontal una diagonal
la deja más fina que el resto. Un trazo no tiene ese problema: su grosor es
perpendicular por definición, esté inclinado o no. Aquella cuenta resolvía un
problema que ha dejado de existir; si aparece de nuevo en el archivo, sobra.

Todos los valores están en la rejilla de **80 × 64**:

| Constante | Valor | Qué es |
|---|---|---|
| `W` | 9 | Grosor único de todo el trazo |
| `TOP` / `BASE` | 10 / 54 | Altura de mayúscula y línea de base (44 de alto) |
| `STEM_X` | 46 | Eje del montante compartido A/P |
| `FOOT_X` | 11 | Pie de la riostra |
| `BOWL_TOP` / `BOWL_BOT` | 15 / 38 | Ejes de los tramos recto superior e inferior del cuenco |
| `BOWL_X` | 56 | Eje del tramo recto antes del arco |
| `BOWL_R` | 11,5 | Radio del arco |
| `BAR_Y` | 42,5 | Eje del travesaño |
| `BAR_X` | 20 | Extremo libre del travesaño |

Tres decisiones que no son arbitrarias:

1. **La A va en un solo subtrazado** (`M11 54 L46 10 V54`). Riostra y montante
   comparten el vértice y se resuelven con una *unión* redondeada. Dibujarlos
   como dos trazos independientes deja dos remates superpuestos en el ápice y
   un pico doble que a tamaño grande se lee como un error de dibujo.

2. **El arco del cuenco es un semicírculo exacto**: `BOWL_R` es justo la mitad
   de `BOWL_BOT − BOWL_TOP`. Cualquier otro radio obliga a un arco elíptico,
   que se deforma al escalar y delata el dibujo. El cuenco mide 23 sobre una
   altura de mayúscula de 44 —algo más de la mitad—, que es la proporción en
   la que una P se lee como P; más grande empieza a leerse como D.

3. **El borde superior del travesaño cae exactamente en `BOWL_BOT`**, el eje
   donde el cuenco de la P cierra (`BAR_Y = BOWL_BOT + W/2`). Esa línea
   horizontal compartida es la que ata las dos letras y hace que se lean como
   una pieza y no como dos formas vecinas. Es la misma alineación que tenía la
   versión maciza —allí era `y = 40`— traducida a ejes.

El travesaño se dibuja **antes** que la A, de modo que la riostra pasa por
encima: la diagonal queda continua y el rojo se ve solo en el vano, que es
donde el tirante realmente trabaja. Su extremo derecho muere en el borde
izquierdo del montante en vez de cruzarlo; metido dentro, dejaría una mancha
roja en medio del azul.

#### El tamaño favicon manda

Los valores de arriba **no se eligieron a ojo**: se fijaron midiendo las
contraformas sobre el píxel real. El símbolo se rasteriza al tamaño de
destino y se cuentan los huecos de fondo encerrados por trazo — si un ojal
desaparece, el dibujo está mal por bien que se vea grande.

Medido sobre fondo claro, isotipo suelto:

| Tamaño | Ojal del cuenco (P) | Ojal de la A |
|---|---|---|
| 64 px | 12 × 13 px | 11 × 13 px |
| 32 px | 5 × 6 px | 4 × 5 px |
| 24 px | 4 × 4 px | 3 × 4 px |
| 20 px | 3 × 4 px | 3 × 4 px |
| 16 px | 2 × 3 px | 1 × 2 px |

Ese es el motivo del mínimo de 24 px para el isotipo suelto y de que el
favicon vaya sobre tesela: a 16 px sueltos el ojal de la A baja a 1 px y deja
de leerse.

La primera versión de esta geometría llevaba `W = 10`, `STEM_X = 43` y
`BOWL_X = 54`, y a 20 px el ojal de la A se quedaba en 2 × 3 px. Abrir el
ángulo de la riostra (montante más a la derecha) y adelgazar el trazo un punto
lo llevó a 3 × 4 sin tocar el concepto. Se deja anotado para que nadie
«redondee» esos tres números a valores más bonitos.

Para reproducir la medición: `npm run check:brand`. Falla si a 20 px queda
alguna contraforma por debajo de 3 px en su lado corto, de modo que un retoque
que cierre un ojal no llega a producción sin que salte.

En la cabecera del sitio se usa el isotipo **solo**, sin texto. El nombre
completo no se pierde: lo llevan el `aria-label` del enlace, el hero, el pie y
el `<title>` de cada página.

---

## Paleta

| Uso | Nombre | HEX | RGB | CMYK aprox. |
|---|---|---|---|---|
| Principal | Azul marino | `#1B2A4A` | 27, 42, 74 | 89 / 74 / 34 / 21 |
| Acento | Rojo ladrillo | `#B8452F` | 184, 69, 47 | 20 / 84 / 91 / 9 |
| Fondo claro | Marfil cálido | `#F2EFE8` | 242, 239, 232 | 4 / 4 / 8 / 0 |
| Neutro | Gris acero | `#5A6472` | 90, 100, 114 | 65 / 52 / 40 / 12 |
| Fondo oscuro | Carbón | `#121412` | 18, 20, 18 | 74 / 66 / 70 / 84 |

Los valores CMYK son **aproximaciones para orientar a imprenta**, no perfiles
calibrados. Antes de tirar papelería, pida una prueba de color impresa.

**Máximo dos colores principales y un neutro por pieza.** El rojo es acento:
si ocupa más superficie que el azul, la pieza está mal.

### Contrastes medidos

| Combinación | Ratio | Uso |
|---|---|---|
| Azul marino sobre marfil | 12,4 : 1 | Texto y logotipo |
| Rojo ladrillo sobre marfil | 4,7 : 1 | Acento, texto normal |
| Rojo ladrillo sobre carbón | 4,6 : 1 | Acento sobre oscuro |
| Marfil sobre azul marino | 12,4 : 1 | Logotipo invertido |

**Nunca** rojo ladrillo sobre azul marino: 2,7 : 1, ilegible.

---

## Tipografía

| Papel | Familia | Peso |
|---|---|---|
| Nombre | Space Grotesk | 700 |
| «Corporation» | Space Grotesk | 500 |
| Descriptor | Space Grotesk | 500, interletrado 0,24 em |
| Reserva | Helvetica Neue, Arial, sans-serif | — |

El descriptor va siempre en versalitas con interletrado amplio. El nombre
lleva interletrado ligeramente negativo (−0,01 em) para compactar la mancha.

**El símbolo no depende de ninguna tipografía**: es trazado vectorial puro.
Solo los bloqueos con texto usan fuente, y siempre con cascada de reserva
declarada dentro del propio SVG.

---

## Variantes

| Archivo | Uso |
|---|---|
| `logo-horizontal.svg` | Principal. Cabeceras, papelería, firmas |
| `logo-stacked.svg` | Espacios estrechos o cuadrados; el nombre va en tres niveles |
| `logo-light.svg` | Fondos oscuros |
| `logo-monochrome.svg` | Una sola tinta: sellos, fax, grabado, serigrafía |
| `mark-ap.svg` | Isotipo suelto, a partir de 24 px |
| `favicon.svg` | Pestaña de navegador y accesos directos |

En la web, el componente `components/BrandLogo.tsx` compone el símbolo en línea
con texto HTML real. Es deliberado: el nombre así se lee, se selecciona y lo
anuncia un lector de pantalla, cosa que un nombre convertido en trazado no
permite. Los SVG de esta carpeta son para uso **externo**.

---

## Área de seguridad

Alrededor del logotipo debe quedar libre, como mínimo, **la altura del
montante vertical del isotipo** (el asta de la P). Nada invade ese margen: ni
texto, ni filetes, ni el borde de la pieza.

## Tamaños mínimos

| Pieza | Mínimo | Motivo |
|---|---|---|
| Logotipo horizontal | 150 px / 40 mm de ancho | Por debajo, el descriptor deja de leerse |
| Logotipo apilado | 110 px / 30 mm de ancho | Ídem |
| Isotipo | 24 px | Por debajo el ojal de la A baja de 3 px y se cierra |
| Favicon | 16 px | Va sobre tesela azul maciza |

Si el descriptor no se lee, **use el isotipo suelto**. Nunca lo comprima ni lo
reduzca hasta volverlo ilegible.

---

## Fondos permitidos

- Marfil `#F2EFE8`, blanco y grises muy claros → versión a color o monocroma
- Carbón `#121412` y azul marino → versión blanca (`logo-light.svg`)
- Fotografía → **solo** sobre zonas de tono uniforme y suficiente contraste,
  con la versión blanca y respetando el área de seguridad

## Usos incorrectos

- Recolorear el símbolo fuera de la paleta
- Poner rojo sobre azul marino
- Deformar, estirar o cambiar la proporción del isotipo
- Rotar el logotipo
- Añadir sombra, bisel, degradado, contorno o efecto 3D
- Reordenar o separar los elementos del monograma
- Traducir el nombre o el descriptor
- Sustituir el nombre completo por «AP» en la versión principal
- Añadir «LLC», «Inc.», «Licensed and Insured» o cualquier condición legal que
  no esté verificada documentalmente
- Encerrar el logotipo en una caja que invada el área de seguridad

---

## PNG con transparencia

En `public/brand/png/` hay 14 archivos PNG con canal alfa, listos para usar
donde no se admita SVG: redes sociales, Google Business Profile, plantillas de
Word, presentaciones o firmas de correo.

| Archivo | Tamaños |
|---|---|
| `mark-ap-*.png` | 256, 512, 1024, 2048 |
| `logo-horizontal-*.png` | 1024, 2048 |
| `logo-stacked-*.png` | 1024, 2048 |
| `logo-light-*.png` | 1024, 2048 (fondos oscuros) |
| `logo-monochrome-*.png` | 1024, 2048 |
| `favicon-*.png` | 180 (iOS), 512 (Android) |

Para regenerarlos: `npm run export:brand`.

Cada PNG se **rasteriza directamente desde el vector al tamaño final**, no se
obtiene ampliando uno más pequeño: escalar un mapa de bits emborrona los
bordes, sobre todo en las diagonales de la riostra.

Si necesita otro tamaño, edite la lista de anchos en
`qa/export-brand-png.mjs`. **Para impresión, use siempre el SVG**: un PNG
tiene resolución fija y a gran formato se pixela.

---

## Ficheros fuente

La geometría está declarada una sola vez en `qa/build-brand.mjs`, que emite
las seis variantes **y además reescribe `app/icon.svg`**, que es de donde Next
saca el icono del sitio. Si hay que retocar el símbolo, **modifique ese
archivo y ejecute `npm run build:brand`**: editar los SVG uno a uno acaba con
variantes desalineadas entre sí.

Hay una única copia consciente de la geometría fuera de ese archivo:
`components/BrandLogo.tsx`, que pinta el símbolo en línea en la web. Ambos
llevan un comentario que remite al otro. **Se tocan juntos o no se tocan.**
Tras cambiar el símbolo hay que ejecutar también `npm run export:brand` para
rehacer los PNG.
