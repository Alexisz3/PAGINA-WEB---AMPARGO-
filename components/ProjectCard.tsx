import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/projects";
import type { AppLocale } from "@/i18n/routing";

interface ProjectCardProps {
  project: Project;
  /** `eager` solo para las primeras tarjetas visibles. */
  priority?: boolean;
  sizes?: string;
}

export default async function ProjectCard({ project, priority = false, sizes }: ProjectCardProps) {
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
            priority={priority}
            loading={priority ? undefined : "lazy"}
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
          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
            {project.title[locale]}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.excerpt[locale]}</p>
          <p className="mt-3 font-mono text-xs text-muted">{project.location}</p>
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
