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

Todo el trazo se levanta sobre **un grosor único de 12 unidades** en una
rejilla de 80 × 64. La riostra mide 15 en horizontal precisamente para que su
grosor *perpendicular* sea 12: inclinada 34,7° respecto a la vertical, hay que
dividir por el coseno. Medir en horizontal el grosor de una diagonal es el
error clásico que la deja visualmente más fina que el resto de la pieza.

El **cuenco de la P termina en y=40, exactamente donde arranca el travesaño de
la A**. Esa línea horizontal compartida es la que ata las dos letras y hace que
se lean como una sola pieza y no como dos formas vecinas.

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

La geometría está declarada una sola vez en `qa/_build-brand.mjs`, que emite
las seis variantes. Si hay que retocar el símbolo, **modifique ese archivo y
vuelva a generarlas**: editar los SVG uno a uno acaba con variantes
desalineadas entre sí.
