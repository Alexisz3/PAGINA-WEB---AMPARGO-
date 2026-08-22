/**
 * Chequeo de integridad i18n. Falla (exit 1) si detecta divergencias.
 * Uso: npm run check:i18n
 *
 * Este chequeo existe porque una divergencia de traducciones no rompe el
 * build ni los tipos: se descubre en producción, con un idioma a medias.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const LOCALES = ["es-US", "en-US"];
const errors = [];
const warnings = [];

// ─── 1. Paridad de claves entre diccionarios ────────────────────────────
const messages = Object.fromEntries(
  LOCALES.map((l) => [l, JSON.parse(readFileSync(path.join("messages", `${l}.json`), "utf8"))])
);

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatten(v, key));
    else out.push(key);
  }
  return out;
}

const keySets = Object.fromEntries(LOCALES.map((l) => [l, new Set(flatten(messages[l]))]));
const [a, b] = LOCALES;
for (const k of keySets[a]) if (!keySets[b].has(k)) errors.push(`Clave "${k}" existe en ${a} pero falta en ${b}`);
for (const k of keySets[b]) if (!keySets[a].has(k)) errors.push(`Clave "${k}" existe en ${b} pero falta en ${a}`);

// ─── 2. Cadenas vacías o sin traducir ───────────────────────────────────
for (const l of LOCALES) {
  const walk = (obj, prefix = "") => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") walk(v, key);
      else if (typeof v === "string" && v.trim() === "") errors.push(`Cadena vacía en ${l}: "${key}"`);
    }
  };
  walk(messages[l]);
}

// ─── 3. Proyectos: slugs únicos, entidades con pareja, fotos existentes ──
const projectsSrc = readFileSync(path.join("content", "projects.ts"), "utf8");

const idMatches = [...projectsSrc.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
const dupIds = idMatches.filter((v, i) => idMatches.indexOf(v) !== i);
if (dupIds.length) errors.push(`IDs de proyecto duplicados: ${[...new Set(dupIds)].join(", ")}`);

const slugBlocks = [...projectsSrc.matchAll(/slugs:\s*\{\s*"es-US":\s*"([^"]+)",\s*"en-US":\s*"([^"]+)"\s*\}/g)];
if (slugBlocks.length !== idMatches.length) {
  errors.push(`Hay ${idMatches.length} proyectos pero ${slugBlocks.length} bloques de slugs: falta alguna pareja de idioma`);
}
for (const loc of [1, 2]) {
  const slugs = slugBlocks.map((m) => m[loc]);
  const dup = slugs.filter((v, i) => slugs.indexOf(v) !== i);
  if (dup.length) errors.push(`Slugs duplicados (${LOCALES[loc - 1]}): ${[...new Set(dup)].join(", ")}`);
}

const photoFiles = [...projectsSrc.matchAll(/file:\s*"([^"]+\.jpe?g)"/g)].map((m) => m[1]);
for (const f of new Set(photoFiles)) {
  if (!existsSync(path.join("public", "images", "proyectos", f))) {
    errors.push(`Foto referenciada que no existe en disco: ${f}`);
  }
}

// ─── 4. Registro de rutas: pareja por locale ────────────────────────────
const routingSrc = readFileSync(path.join("i18n", "routing.ts"), "utf8");
const pathBlock = routingSrc.slice(routingSrc.indexOf("export const pathnames"), routingSrc.indexOf("satisfies Record"));
const localized = [...pathBlock.matchAll(/\{\s*"es-US":\s*"([^"]+)",\s*"en-US":\s*"([^"]+)"\s*\}/g)];
for (const m of localized) {
  const esDyn = (m[1].match(/\[/g) ?? []).length;
  const enDyn = (m[2].match(/\[/g) ?? []).length;
  if (esDyn !== enDyn) errors.push(`Ruta con distinto número de segmentos dinámicos: ${m[1]} vs ${m[2]}`);
}

// ─── 5. Aviso: rutas legales fuera de navegación y sitemap ──────────────
const sitemapSrc = readFileSync(path.join("app", "sitemap.ts"), "utf8");
for (const legal of ["/privacy", "/terms"]) {
  if (!sitemapSrc.includes(`"${legal}"`)) {
    warnings.push(`La ruta legal ${legal} no aparece en la lista de exclusión del sitemap — revisar que siga fuera del índice`);
  }
}

// ─── Informe ────────────────────────────────────────────────────────────
console.log("=== CHEQUEO i18n ===");
console.log(`Locales: ${LOCALES.join(", ")}`);
console.log(`Claves por idioma: ${keySets[a].size}`);
console.log(`Proyectos: ${idMatches.length} · fotos referenciadas: ${new Set(photoFiles).size}`);

if (warnings.length) {
  console.log("\nAvisos:");
  warnings.forEach((w) => console.log("  ! " + w));
}

if (errors.length) {
  console.log(`\n${errors.length} ERROR(ES):`);
  errors.forEach((e) => console.log("  ✗ " + e));
  process.exit(1);
}

console.log("\nSin divergencias.");
