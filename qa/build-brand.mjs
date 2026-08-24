/**
 * Genera las variantes del logotipo desde UNA sola definición de geometría.
 *
 * Copiar los trazados a mano entre seis archivos garantiza que tarde o
 * temprano una variante quede desalineada respecto a las demás. Aquí la
 * geometría se declara una vez y cada variante solo elige colores y encuadre.
 *
 * Uso: node qa/_build-brand.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../public/brand", import.meta.url));

/* ─── Paleta ─────────────────────────────────────────────────────────── */
export const NAVY = "#1B2A4A";
export const BRICK = "#B8452F";
const IVORY = "#F2EFE8";
export const STEEL = "#5A6472";
const BLACK = "#000000";

/* ─── Geometría del monograma (rejilla 80 x 64, bbox x 2..76, y 6..58) ──
 *
 * Todo el trazo se construye sobre UN grosor de 12 unidades. La versión
 * anterior mezclaba 12, 16, 9, 9 y 10: a tamaño grande se notaba como un
 * dibujo desigual, sin que fuera evidente por qué.
 *
 * La riostra mide 15 en horizontal, no 12, precisamente para que su grosor
 * PERPENDICULAR sí sea 12: inclinada 34,7° respecto a la vertical, hay que
 * dividir por el coseno (12 / 0,822 ≈ 15). Medir en horizontal una diagonal
 * es el error clásico que la deja visualmente más fina que el resto.
 *
 * Y hay una alineación que antes no existía: el cuenco de la P termina en
 * y=40, exactamente donde empieza el travesaño de la A. Esa línea horizontal
 * compartida es la que ata las dos letras y hace que se lean como una pieza
 * y no como dos formas vecinas.
 */
const BRACE = "M38 6 L38 21 L17 58 L2 58 Z";        // riostra izquierda de la A
const STEM = "M38 6 H50 V58 H38 Z";                 // montante compartido A/P
const BAR = "M27 40 H38 V52 H20 Z";                 // travesaño de la A (acento)
const BOWL = "M50 6 H76 V40 H50 V28 H64 V18 H50 Z"; // cuenco de la P

const MARK_W = 74; // 76 - 2
const MARK_H = 52; // 58 - 6

/**
 * Emite el monograma con el color y encuadre pedidos.
 * `accent` a null funde el travesaño con el resto: versiones monocromas.
 */
export function mark({ body, accent, transform = "" }) {
  const t = transform ? ` transform="${transform}"` : "";
  return `<g${t}>
    <path d="${BRACE}" fill="${body}"/>
    <path d="${STEM}" fill="${body}"/>
    <path d="${BAR}" fill="${accent ?? body}"/>
    <path d="${BOWL}" fill="${body}"/>
  </g>`;
}

/** Coloca el monograma con una altura dada y su esquina superior izquierda en (x,y). */
export function place(height, x, y) {
  const s = height / MARK_H;
  return `translate(${(x - 2 * s).toFixed(3)} ${(y - 6 * s).toFixed(3)}) scale(${s.toFixed(5)})`;
}

/*
 * Tipografía del wordmark.
 *
 * Space Grotesk es la tipográfica de titulares del sitio; se declara con una
 * cascada de reserva real para que el archivo no dependa de una fuente remota
 * y siga siendo legible en Illustrator o Inkscape sin ella instalada.
 * El SÍMBOLO nunca depende de tipografía: es trazado puro.
 */
const FONT = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif";

/*
 * Alternativas tipográficas para que el cliente elija.
 *
 * El símbolo NO cambia entre ellas: solo la voz del nombre. Es la decisión
 * reversible por excelencia — cambiar una constante y regenerar.
 *
 * `weight` varía porque cada familia tiene un peso distinto a igual número:
 * la serif de referencia necesita 600 donde la grotesca pide 700, o se ve
 * pesada. Y `tracking` sube en las serifs porque en versalitas necesitan más
 * aire entre letras que una sans geométrica.
 */
export const TYPE_OPTIONS = {
  grotesque: {
    label: "Space Grotesk — actual",
    family: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    google: "Space+Grotesk:wght@500;700",
    nameWeight: 700,
    nameTracking: "0.01em",
    corpWeight: 500,
  },
  serif: {
    label: "Source Serif 4 — profesional contemporánea",
    family: "'Source Serif 4', Georgia, 'Times New Roman', serif",
    google: "Source+Serif+4:wght@500;600;700",
    nameWeight: 600,
    nameTracking: "0.02em",
    corpWeight: 500,
  },
  engraved: {
    label: "Cinzel — capitular grabada, cercana a la referencia",
    family: "'Cinzel', 'Trajan Pro', Georgia, serif",
    google: "Cinzel:wght@500;700",
    nameWeight: 700,
    nameTracking: "0.04em",
    corpWeight: 500,
  },
};

function wordmark({ x, nameY, descY, nameSize, descSize, nameColor, corpColor, descColor, anchor = "start" }) {
  return `<text x="${x}" y="${nameY}" font-family="${FONT}" font-size="${nameSize}" font-weight="700" letter-spacing="0.01em" fill="${nameColor}" text-anchor="${anchor}">ANDRADE PARRA <tspan font-weight="500" fill="${corpColor}">CORPORATION</tspan></text>
  <text x="${x}" y="${descY}" font-family="${FONT}" font-size="${descSize}" font-weight="500" letter-spacing="0.24em" fill="${descColor}" text-anchor="${anchor}">GENERAL REMODELING</text>`;
}

/**
 * Filete de bandera: cantón azul en su proporción real (2/5) y resto en rojo.
 *
 * Es el guiño estadounidense reducido a lo mínimo reconocible. Sin estrellas y
 * sin franjas dibujadas: en EE. UU. ese emblema en la papelería de un
 * contratista se lee como acreditación oficial, y esta empresa no tiene
 * licencia ni seguro confirmados por escrito.
 */
export function flagRule(x, y, width, height = 3) {
  const canton = width * 0.38;
  return `<g>
    <rect x="${x}" y="${y}" width="${canton.toFixed(2)}" height="${height}" fill="${NAVY}"/>
    <rect x="${(x + canton).toFixed(2)}" y="${y}" width="${(width - canton).toFixed(2)}" height="${height}" fill="${BRICK}"/>
  </g>`;
}

function doc({ w, h, title, desc, body, note }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t d">
  <title id="t">${title}</title>
  <desc id="d">${desc}</desc>
${note ? `  <!--\n    ${note}\n  -->\n` : ""}${body}
</svg>
`;
}

const DESC_MARK =
  "Monograma A P: la pata derecha de la A es el mismo montante del que nace el cuenco de la P; el travesaño de la A actua de tirante.";

/* ─── 1. Isotipo ─────────────────────────────────────────────────────── */
writeFileSync(
  `${OUT}/mark-ap.svg`,
  doc({
    w: 80,
    h: 64,
    title: "Andrade Parra Corporation",
    desc: DESC_MARK,
    note:
      "Isotipo AP. La A lleva travesano a proposito: sin el, el conjunto se leia \"/P\".\n    El rojo va solo en el travesano, rodeado de azul, para que el simbolo no se\n    fragmente en dos objetos sueltos.",
    body: `  ${mark({ body: NAVY, accent: BRICK })}`,
  })
);

/* ─── 2. Favicon: teselado macizo, legible en pestañas claras y oscuras ── */
writeFileSync(
  `${OUT}/favicon.svg`,
  doc({
    w: 64,
    h: 64,
    title: "Andrade Parra Corporation",
    desc: DESC_MARK,
    note:
      "Favicon. Va sobre tesela azul maciza y no suelto: en una pestana el fondo\n    del navegador cambia con el tema del sistema, y un monograma sin tesela\n    desaparece contra uno de los dos.",
    body: `  <rect width="64" height="64" rx="10" fill="${NAVY}"/>
  ${mark({ body: IVORY, accent: BRICK, transform: place(36, 6, 14) })}`,
  })
);

/* ─── 3. Horizontal (principal) ──────────────────────────────────────── */
const H_MARK_H = 46;
const H_TEXT_X = 8 + (H_MARK_H * MARK_W) / MARK_H + 22;
writeFileSync(
  `${OUT}/logo-horizontal.svg`,
  doc({
    w: 470,
    h: 76,
    title: "Andrade Parra Corporation — General Remodeling",
    desc: `${DESC_MARK} A su derecha, el nombre completo sobre el descriptor General Remodeling.`,
    body: `  ${mark({ body: NAVY, accent: BRICK, transform: place(H_MARK_H, 8, 12) })}
  ${wordmark({
    x: H_TEXT_X,
    nameY: 40,
    descY: 60,
    nameSize: 25,
    descSize: 11,
    nameColor: NAVY,
    corpColor: NAVY,
    descColor: STEEL,
  })}`,
  })
);

/* ─── 4. Apilado ─────────────────────────────────────────────────────── */
/*
 * El nombre va en TRES niveles, no en una línea centrada.
 *
 * Con "ANDRADE PARRA CORPORATION" en una sola línea a 24 px el texto medía
 * 338 px y se salía de una caja de 320. Ensanchar la caja habría resuelto el
 * desborde y empeorado el logotipo: la gracia de una versión apilada es
 * caber en un espacio estrecho. Partirlo da además la jerarquía correcta —
 * "Andrade Parra" domina, "Corporation" es secundario y el descriptor cierra.
 */
writeFileSync(
  `${OUT}/logo-stacked.svg`,
  doc({
    w: 320,
    h: 190,
    title: "Andrade Parra Corporation — General Remodeling",
    desc: `${DESC_MARK} Debajo, el nombre en tres niveles: Andrade Parra, Corporation y el descriptor General Remodeling, centrados, sobre un filete azul y rojo.`,
    body: `  ${mark({ body: NAVY, accent: BRICK, transform: place(52, 123, 12) })}
  <text x="160" y="112" font-family="${FONT}" font-size="27" font-weight="700" letter-spacing="0.01em" fill="${NAVY}" text-anchor="middle">ANDRADE PARRA</text>
  <text x="160" y="136" font-family="${FONT}" font-size="15" font-weight="500" letter-spacing="0.16em" fill="${NAVY}" text-anchor="middle">CORPORATION</text>
${flagRule(80, 148, 160)}
  <text x="160" y="174" font-family="${FONT}" font-size="11" font-weight="500" letter-spacing="0.24em" fill="${STEEL}" text-anchor="middle">GENERAL REMODELING</text>`,
  })
);

/* ─── 5. Versión blanca, para fondos oscuros ─────────────────────────── */
writeFileSync(
  `${OUT}/logo-light.svg`,
  doc({
    w: 470,
    h: 76,
    title: "Andrade Parra Corporation — General Remodeling",
    desc: `${DESC_MARK} Version en blanco marfil para fondos oscuros.`,
    note:
      "El travesano conserva el rojo: sobre carbon mantiene 4,6:1 y es la unica\n    nota de color que sobrevive a la inversion sin ensuciar el conjunto.",
    body: `  ${mark({ body: IVORY, accent: BRICK, transform: place(H_MARK_H, 8, 12) })}
  ${wordmark({
    x: H_TEXT_X,
    nameY: 40,
    descY: 60,
    nameSize: 25,
    descSize: 11,
    nameColor: IVORY,
    corpColor: IVORY,
    descColor: "#A9B0BC",
  })}`,
  })
);

/* ─── 6. Monocromo negro, para fax, sellos y una tinta ───────────────── */
writeFileSync(
  `${OUT}/logo-monochrome.svg`,
  doc({
    w: 470,
    h: 76,
    title: "Andrade Parra Corporation — General Remodeling",
    desc: `${DESC_MARK} Version monocroma negra a una sola tinta.`,
    note:
      "Sin acento: a una tinta el travesano se funde con el resto del monograma,\n    que es justo lo que debe ocurrir. La forma aguanta sin depender del color.",
    body: `  ${mark({ body: BLACK, accent: null, transform: place(H_MARK_H, 8, 12) })}
  ${wordmark({
    x: H_TEXT_X,
    nameY: 40,
    descY: 60,
    nameSize: 25,
    descSize: 11,
    nameColor: BLACK,
    corpColor: BLACK,
    descColor: BLACK,
  })}`,
  })
);

console.log("6 SVG generados en public/brand/");
