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

/*
 * El favicon se escribe DOS veces: en public/brand/ para uso externo y en
 * app/icon.svg, que es de donde Next saca el icono del sitio. Antes app/icon.svg
 * era una copia pegada a mano; al retocar el símbolo quedaba con la geometría
 * vieja y el sitio servía un icono que ya no coincidía con el logotipo. Con
 * dos escrituras desde la misma fuente eso no puede volver a pasar.
 */
const APP_ICON = fileURLToPath(new URL("../app/icon.svg", import.meta.url));

/* ─── Paleta ─────────────────────────────────────────────────────────── */
export const NAVY = "#1B2A4A";
/*
 * Fase 5 — rebranding de color: rojo ladrillo → naranja. Mismo valor que
 * `--color-accent-ink` en app/globals.css (la variante viva del token,
 * pensada para verse bien como marca visible, no solo como texto).
 */
export const ACCENT = "#F0692A";
const IVORY = "#F2EFE8";
export const STEEL = "#5A6472";
const BLACK = "#000000";

/* ─── Geometría del monograma — «ensamble redondeado» ────────────────────
 *
 * El concepto no cambia: UN montante vertical hace de pata derecha de la A y
 * de asta de la P, y el travesaño de la A ata la riostra a ese montante. Lo
 * que cambia es la ejecución: donde antes había cuatro polígonos macizos con
 * esquinas vivas, ahora hay TRAZO de grosor único con uniones y remates
 * redondeados. Suaviza el gesto sin tocar la idea.
 *
 * Consecuencia de método: al pasar de relleno a trazo, la geometría deja de
 * describir el CONTORNO de la pieza y pasa a describir su EJE. Todas las
 * constantes de abajo son ejes; el borde visible cae siempre a W/2 del eje, y
 * los remates redondos añaden otro W/2 más allá de cada extremo. Por eso ya
 * no hace falta el cálculo del coseno que compensaba el grosor de la
 * diagonal: un trazo tiene el mismo grosor perpendicular en toda su longitud
 * por definición, esté inclinado o no. Ese era el sentido de aquella cuenta y
 * ha dejado de existir.
 *
 * La prueba que manda es el tamaño favicon: si a 20 px las contraformas se
 * cierran, el símbolo está mal por bonito que se vea grande. Los valores de
 * abajo se fijaron midiendo esas contraformas, no a ojo.
 */

/** Grosor único de TODO el trazo. */
const W = 9;

/** Altura de mayúscula y línea de base, en ejes. */
const TOP = 10;
const BASE = 54;

/** Eje del montante compartido A/P, y pie de la riostra. */
const STEM_X = 46;
const FOOT_X = 11;

/*
 * Cuenco de la P. Alto 23 sobre una altura de mayúscula de 44: algo más de la
 * mitad, que es la proporción en la que una P se lee como P. Más grande
 * empieza a leerse como D.
 *
 * El radio es exactamente la mitad del alto, de modo que el arco es un
 * semicírculo perfecto y no un óvalo: cualquier otro radio obliga a un arco
 * elíptico que se deforma al escalar y delata el dibujo.
 */
const BOWL_TOP = 15;
const BOWL_BOT = 38;
const BOWL_X = 56;
const BOWL_R = (BOWL_BOT - BOWL_TOP) / 2;

/*
 * Travesaño de la A. Su BORDE SUPERIOR cae en `BOWL_BOT`, el eje donde el
 * cuenco de la P cierra: esa línea horizontal compartida es la que ata las dos
 * letras y hace que se lean como una pieza y no como dos formas vecinas. Es la
 * misma alineación que tenía la versión maciza (allí era y=40), traducida a
 * ejes.
 *
 * El extremo derecho muere en el borde izquierdo del montante en vez de
 * cruzarlo: al ir en acento, meterlo dentro del montante dejaría una mancha
 * roja dentro del azul. El extremo izquierdo pasa POR DEBAJO de la riostra
 * —se dibuja antes— para que la diagonal quede continua y el rojo solo se vea
 * en el vano, que es donde el travesaño realmente trabaja.
 */
const BAR_Y = BOWL_BOT + W / 2;
const BAR_X = 20;

/**
 * La A completa en un solo subtrazado: riostra y montante comparten el vértice
 * y se resuelven con una UNIÓN redondeada, no con dos remates superpuestos.
 * Dos trazos independientes dejan un pico doble en el ápice que a tamaño
 * grande se ve como un error de dibujo.
 */
const BRACE = `M${FOOT_X} ${BASE} L${STEM_X} ${TOP} V${BASE}`;
const BAR = `M${BAR_X} ${BAR_Y} H${STEM_X - W / 2}`;
const BOWL = `M${STEM_X} ${BOWL_TOP} H${BOWL_X} A${BOWL_R} ${BOWL_R} 0 0 1 ${BOWL_X} ${BOWL_BOT} H${STEM_X}`;

/*
 * Caja real de la pieza, calculada y no medida a ojo.
 *
 * Con trazo redondeado los extremos sobresalen W/2 en la DIRECCIÓN del trazo,
 * además de los W/2 perpendiculares. En la vertical y la horizontal eso es
 * trivial; en la diagonal hay que proyectar, y es justo donde un cálculo a
 * ojo deja el símbolo descentrado dentro de su propio encuadre.
 */
const footLen = Math.hypot(STEM_X - FOOT_X, BASE - TOP);
const ux = (FOOT_X - STEM_X) / footLen;
const uy = (BASE - TOP) / footLen;
const footTipX = FOOT_X + ux * (W / 2);
const footTipY = BASE + uy * (W / 2);

export const MARK_X = footTipX - Math.abs(uy) * (W / 2);
export const MARK_Y = TOP - W / 2;
const MARK_W = BOWL_X + BOWL_R + W / 2 - MARK_X;
const MARK_H = Math.max(BASE + W / 2, footTipY + Math.abs(ux) * (W / 2)) - MARK_Y;

/**
 * Emite el monograma con el color y encuadre pedidos.
 * `accent` a null funde el travesaño con el resto: versiones monocromas.
 *
 * El travesaño va PRIMERO para que la riostra pase por encima; ver la nota de
 * `BAR_X`. `stroke-linecap` y `stroke-linejoin` redondos son lo que convierte
 * esta geometría de ejes en la pieza visible: sin ellos el dibujo sale con
 * remates a escuadra y vuelve a ser la versión anterior.
 */
export function mark({ body, accent, transform = "" }) {
  const t = transform ? ` transform="${transform}"` : "";
  return `<g${t} fill="none" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round">
    <path d="${BAR}" stroke="${accent ?? body}"/>
    <path d="${BRACE}" stroke="${body}"/>
    <path d="${BOWL}" stroke="${body}"/>
  </g>`;
}

/** Coloca el monograma con una altura dada y su esquina superior izquierda en (x,y). */
export function place(height, x, y) {
  const s = height / MARK_H;
  return `translate(${(x - MARK_X * s).toFixed(3)} ${(y - MARK_Y * s).toFixed(3)}) scale(${s.toFixed(5)})`;
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
    <rect x="${(x + canton).toFixed(2)}" y="${y}" width="${(width - canton).toFixed(2)}" height="${height}" fill="${ACCENT}"/>
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
    body: `  ${mark({ body: NAVY, accent: ACCENT })}`,
  })
);

/* ─── 2. Favicon: teselado macizo, legible en pestañas claras y oscuras ── */
/*
 * El centrado se CALCULA a partir de la caja real del símbolo, no se escribe
 * a mano. Con la versión maciza el valor estaba fijado a ojo y al cambiar la
 * geometría el monograma quedaba descentrado dentro de la tesela sin que
 * nada fallara: en un favicon de 16 px, 4 unidades de más a un lado se ven.
 */
const FAV_H = 36;
const FAV_W = (FAV_H * MARK_W) / MARK_H;
const FAV_X = (64 - FAV_W) / 2;
const FAV_Y = (64 - FAV_H) / 2;

const favicon = doc({
    w: 64,
    h: 64,
    title: "Andrade Parra Corporation",
    desc: DESC_MARK,
    note:
      "Favicon. Va sobre tesela azul maciza y no suelto: en una pestana el fondo\n    del navegador cambia con el tema del sistema, y un monograma sin tesela\n    desaparece contra uno de los dos.",
    body: `  <rect width="64" height="64" rx="10" fill="${NAVY}"/>
  ${mark({ body: IVORY, accent: ACCENT, transform: place(FAV_H, FAV_X, FAV_Y) })}`,
  });
writeFileSync(`${OUT}/favicon.svg`, favicon);
writeFileSync(APP_ICON, favicon);

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
    body: `  ${mark({ body: NAVY, accent: ACCENT, transform: place(H_MARK_H, 8, 12) })}
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
    body: `  ${mark({ body: NAVY, accent: ACCENT, transform: place(52, 123, 12) })}
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
    body: `  ${mark({ body: IVORY, accent: ACCENT, transform: place(H_MARK_H, 8, 12) })}
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

console.log("6 SVG en public/brand/ · app/icon.svg regenerado");
