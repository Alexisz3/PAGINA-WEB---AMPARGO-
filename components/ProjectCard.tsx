import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";

interface ProjectCardProps {
  project: Project;
  /**
   * Carga inmediata para las primeras tarjetas visibles.
   *
   * Deliberadamente NO usa `preload`: en estas páginas el elemento LCP es la
   * fotografía del hero, y precargar además las tarjetas haría que tres
   * imágenes compitiesen por el ancho de banda inicial, retrasando justo la
   * que decide la métrica. Basta con no diferirlas.
   *
   * Antes se llamaba `priority`, el prop que Next 16 dejó obsoleto.
   */
  eager?: boolean;
  sizes?: string;
  /**
   * Oculta el extracto. En el índice de proyectos, repetir una descripción
   * larga bajo cada tarjeta convertía la página en una lista de texto:
   * el título y la categoría ya identifican la obra, y el detalle está
   * a un toque de distancia.
   */
  compact?: boolean;
  /**
   * Nivel del encabezado de la tarjeta.
   *
   * En portada las tarjetas cuelgan de un H2 de sección, así que h3 es
   * correcto. En el ÍNDICE de proyectos no hay sección intermedia: las
   * tarjetas cuelgan directamente del H1, y dejarlas en h3 producía un salto
   * H1→H3. Saltarse un nivel desorienta a quien navega por encabezados con
   * lector de pantalla, que es como se recorre una página larga sin verla.
   */
  headingLevel?: "h2" | "h3";
}

export default async function ProjectCard({
  project,
  eager = false,
  sizes,
  compact = false,
  headingLevel: Heading = "h3",
}: ProjectCardProps) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Projects");

  return (
    <article className="group">
      <Link href={{ pathname: "/projects/[slug]", params: { slug: project.slugs[locale] } }} className="block">
        {/*
          Proporción uniforme en rejilla, a propósito.
          Respetar la orientación nativa aquí producía filas dentadas: una foto
          vertical entre dos horizontales rompe la alineación y el resultado
          parece un error, no una decisión. El encuadre completo de cada foto
          se conserva en la página de detalle, donde sí manda la imagen.
        */}
        <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
          <Image
            src={`/images/proyectos/${project.coverPhoto.file}`}
            alt={project.title[locale]}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-3 top-3 bg-bone/95 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink">
            {t(`filter${categoryKey(project.category)}`)}
          </span>
          <span
            className={`absolute bottom-3 left-3 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider ${
              project.status === "completed" ? "bg-carbon/90 text-bone" : "bg-accent text-bone"
            }`}
          >
            {project.status === "completed" ? t("statusCompleted") : t("statusInProgress")}
          </span>
        </div>

        <div className="mt-4">
          <Heading className="font-display text-lg font-semibold leading-snug text-ink">
            {project.title[locale]}
          </Heading>
          {compact ? null : (
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.excerpt[locale]}</p>
          )}
          <p className="mt-2 font-mono text-xs text-muted">{project.location}</p>
        </div>
      </Link>
    </article>
  );
}

function categoryKey(c: Project["category"]): string {
  const map: Record<Project["category"], string> = {
    kitchens: "Kitchens",
    bathrooms: "Bathrooms",
    exteriors: "Exteriors",
    structures: "Structures",
    interiors: "Interiors",
  };
  return map[c];
}
