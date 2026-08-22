import type { AppLocale } from "@/i18n/routing";

export type ProjectCategory = "kitchens" | "bathrooms" | "exteriors" | "structures" | "interiors";
export type ProjectStatus = "completed" | "in_progress";

export interface ProjectPhoto {
  file: string;
  orientation: "vertical" | "horizontal";
}

export interface Project {
  /** Estable e independiente del idioma — no cambia aunque cambien los slugs. */
  id: string;
  slugs: Record<AppLocale, string>;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Título y extracto por locale. */
  title: Record<AppLocale, string>;
  excerpt: Record<AppLocale, string>;
  location: string;
  coverPhoto: ProjectPhoto;
  gallery: ProjectPhoto[];
  /** Featured en portada solo si aporta variedad de categoría. */
  featuredOnHome: boolean;
}

/**
 * Fuente de verdad de proyectos publicables.
 *
 * Solo se incluyen fotos ya revisadas visualmente (ver AUDITORIA_Y_PLAN_AMPARGO.md
 * §10): sin rostros identificables sin consentimiento, sin incoherencias de
 * ubicación, sin desenfoques. Las leyendas describen exactamente lo que se ve;
 * no se afirma nombre de cliente, año ni dirección exacta porque el cliente
 * no los ha confirmado (pendiente, documentado en la auditoría).
 */
export const PROJECTS: Project[] = [
  {
    id: "patio-pool-lake",
    slugs: { "es-US": "terraza-piscina-lago", "en-US": "lakeside-patio-pool" },
    category: "exteriors",
    status: "in_progress",
    title: {
      "es-US": "Terraza y piscina en construcción",
      "en-US": "Lakeside patio & pool under construction",
    },
    excerpt: {
      "es-US": "Diseño y construcción de terraza con piscina y área de estar al aire libre.",
      "en-US": "Design and construction of a patio with pool and outdoor living area.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "exterior-lujo-01.jpeg", orientation: "horizontal" },
    gallery: [{ file: "exterior-lujo-01.jpeg", orientation: "horizontal" }],
    featuredOnHome: true,
  },
  {
    id: "carport-gable-frame",
    slugs: { "es-US": "construccion-de-cochera", "en-US": "carport-construction" },
    category: "structures",
    status: "in_progress",
    title: { "es-US": "Construcción de cochera", "en-US": "Carport construction" },
    excerpt: {
      "es-US": "Estructura de cochera en madera con cubierta y soporte reforzado.",
      "en-US": "Wood-framed carport structure with roofing and reinforced support.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "estructura-02.jpeg", orientation: "horizontal" },
    gallery: [
      { file: "estructura-02.jpeg", orientation: "horizontal" },
      { file: "estructura-09.jpeg", orientation: "vertical" },
      { file: "estructura-10-gable.jpeg", orientation: "vertical" },
      { file: "estructura-08.jpeg", orientation: "horizontal" },
    ],
    featuredOnHome: false,
  },
  {
    id: "quartz-kitchen",
    slugs: { "es-US": "renovacion-de-cocina", "en-US": "kitchen-renovation" },
    category: "kitchens",
    status: "completed",
    title: { "es-US": "Renovación de cocina", "en-US": "Kitchen renovation" },
    excerpt: {
      "es-US": "Actualización completa de cocina con nuevos gabinetes, encimera y salpicadero.",
      "en-US": "Full kitchen update with new cabinets, countertop, and backsplash.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "cocina-cuarzo-05.jpeg", orientation: "horizontal" },
    gallery: [
      { file: "cocina-cuarzo-05.jpeg", orientation: "horizontal" },
      { file: "cocina-cuarzo-06.jpeg", orientation: "horizontal" },
      { file: "cocina-cuarzo-04.jpeg", orientation: "vertical" },
    ],
    featuredOnHome: true,
  },
  {
    id: "granite-kitchen",
    slugs: { "es-US": "cocina-encimera-granito", "en-US": "granite-countertop-kitchen" },
    category: "kitchens",
    status: "completed",
    title: { "es-US": "Cocina con encimera de granito", "en-US": "Granite countertop kitchen" },
    excerpt: {
      "es-US": "Cocina terminada con encimera de granito e iluminación bajo gabinete.",
      "en-US": "Finished kitchen with granite countertop and under-cabinet lighting.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "cocina-granito-01.jpeg", orientation: "horizontal" },
    gallery: [{ file: "cocina-granito-01.jpeg", orientation: "horizontal" }],
    featuredOnHome: false,
  },
  {
    id: "marble-mosaic-bath",
    slugs: { "es-US": "remodelacion-de-bano", "en-US": "bathroom-remodel" },
    category: "bathrooms",
    status: "in_progress",
    title: { "es-US": "Remodelación de baño", "en-US": "Bathroom remodel" },
    excerpt: {
      "es-US": "Conversión de baño con ducha amplia y acabados en tonos grises.",
      "en-US": "Bathroom conversion with a spacious shower and gray-toned finishes.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "bano-01.jpeg", orientation: "vertical" },
    gallery: [
      { file: "bano-01.jpeg", orientation: "vertical" },
      { file: "bano-03.jpeg", orientation: "horizontal" },
      { file: "plomeria-01.jpeg", orientation: "horizontal" },
    ],
    featuredOnHome: true,
  },
  {
    id: "exterior-repairs",
    slugs: { "es-US": "reparaciones-exteriores", "en-US": "exterior-repairs" },
    category: "exteriors",
    status: "completed",
    title: { "es-US": "Reparaciones exteriores", "en-US": "Exterior repairs" },
    excerpt: {
      "es-US": "Reparación de pared de ladrillo y mejoras en paisajismo y drenaje.",
      "en-US": "Brick wall repair with landscaping and drainage improvements.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "exterior-jardin-01.jpeg", orientation: "vertical" },
    gallery: [{ file: "exterior-jardin-01.jpeg", orientation: "vertical" }],
    featuredOnHome: false,
  },
  {
    id: "open-concept-interior",
    slugs: { "es-US": "interior-concepto-abierto", "en-US": "open-concept-interior" },
    category: "interiors",
    status: "completed",
    title: { "es-US": "Interior de concepto abierto", "en-US": "Open-concept interior" },
    excerpt: {
      "es-US": "Interior terminado y amueblado con piso de madera y cielorraso de lambrín.",
      "en-US": "Finished, furnished interior with wood flooring and a shiplap ceiling.",
    },
    location: "Houston, TX",
    coverPhoto: { file: "interior-01.jpeg", orientation: "vertical" },
    gallery: [{ file: "interior-01.jpeg", orientation: "vertical" }],
    featuredOnHome: false,
  },
];

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featuredOnHome);
}

export function getProjectBySlug(locale: AppLocale, slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slugs[locale] === slug);
}

export function getProjectsByCategory(category: ProjectCategory | "all"): Project[] {
  if (category === "all") return PROJECTS;
  return PROJECTS.filter((p) => p.category === category);
}
