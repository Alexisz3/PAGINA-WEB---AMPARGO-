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
| Isotipo | 24 px | Por debajo se cierra el ojal de la A |
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

## Exportación a PNG

Los archivos entregados son **SVG vectoriales**. No se han generado PNG: este
entorno no tiene un exportador con el que pudiera comprobar el resultado, y
prefiero no afirmar que existen archivos que no he verificado.

Para generarlos, con Inkscape instalado:

```bash
for size in 512 1024 2048; do
  inkscape public/brand/mark-ap.svg \
    --export-type=png --export-width=$size \
    --export-background-opacity=0 \
    --export-filename=mark-ap-$size.png
done
```

Con ImageMagick y librsvg:

```bash
magick -background none -density 600 public/brand/mark-ap.svg \
  -resize 1024x mark-ap-1024.png
```

También sirve abrir el SVG en Figma o Illustrator y exportar a 1×, 2× y 4×
con fondo transparente.

---

## Ficheros fuente

La geometría está declarada una sola vez en `qa/_build-brand.mjs`, que emite
las seis variantes. Si hay que retocar el símbolo, **modifique ese archivo y
vuelva a generarlas**: editar los SVG uno a uno acaba con variantes
desalineadas entre sí.
