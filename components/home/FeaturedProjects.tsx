import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProjects } from "@/content/projects";
import ProjectCarousel from "../ProjectCarousel";
import ArrowRight from "../icons/ArrowRight";

export default async function FeaturedProjects() {
  const t = await getTranslations("Home");
  const projects = getFeaturedProjects();

  // `lg:-mt-16` recupera el hueco muerto que deja la banda de servicios: esa
  // banda sube visualmente con -translate-y-24 pero conserva su espacio de
  // layout, lo que abría ~100px de vacío antes de esta sección.
  return (
    <section className="bg-paper py-16 lg:-mt-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <span className="eyebrow text-accent">{t("featuredEyebrow")}</span>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl text-balance font-display font-semibold leading-tight text-ink [font-size:clamp(1.625rem,3.4vw,2.75rem)]">
            {t("featuredHeading")}
          </h2>
          {/* En móvil el enlace va debajo del carrusel, donde cae natural tras
              explorar; en escritorio acompaña al titular. */}
          <Link
            href="/projects"
            className="hidden min-h-[44px] items-center gap-2 rounded-full border border-line px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent lg:inline-flex"
          >
            {t("featuredCta")}
            <ArrowRight />
          </Link>
        </div>

        <div className="mt-8">
          <ProjectCarousel projects={projects} />
        </div>

        <Link
          href="/projects"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 border-b border-line text-sm text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          {t("featuredCta")}
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
