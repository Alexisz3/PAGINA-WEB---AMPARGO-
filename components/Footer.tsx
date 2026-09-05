import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StaticPathname, AppLocale } from "@/i18n/routing";
import { SERVICES } from "@/content/services";
import { SERVICE_AREA } from "@/content/company";
import { WHATSAPP_CONTACTS, BUSINESS_EMAIL, BUSINESS, BRAND } from "@/lib/site";
import BrandLogo from "./BrandLogo";
import ArrowRight from "./icons/ArrowRight";
import LineIcon from "./icons/LineIcon";

const COMPANY_LINKS: {
  href: StaticPathname;
  key: "about" | "projects" | "process" | "contact";
}[] = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/process", key: "process" },
  { href: "/contact", key: "contact" },
];

const NAV_LINK_CLASS =
  "group flex min-h-[48px] items-center justify-between gap-4 border-b border-bone/10 text-sm text-bone/78 transition-colors hover:border-accent-ink/55 hover:text-bone";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Contact");
  const locale = (await getLocale()) as AppLocale;
  const year = new Date().getFullYear();
  const services = SERVICES.filter((service) => service.published);

  return (
    <footer className="border-t-4 border-accent bg-carbon text-bone">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-12 lg:gap-0 lg:py-14">
          <section className="col-span-2 lg:col-span-4 lg:pr-14" aria-labelledby="footer-brand">
            <h2 id="footer-brand" className="sr-only">
              {BRAND.name}
            </h2>
            <Link href="/" aria-label={BRAND.name} className="inline-flex min-h-[48px] items-center">
              <BrandLogo variant="horizontal" size={34} decorative className="text-bone" />
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-base leading-relaxed text-bone/75">
              {t("tagline")}
            </p>
          </section>

          <nav
            aria-label={t("servicesHeading")}
            className="border-t border-bone/15 pt-6 lg:col-span-3 lg:border-l lg:border-t-0 lg:px-9 lg:pt-0"
          >
            <div className="flex items-center justify-between gap-4 border-b border-bone/20 pb-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">
                {t("servicesHeading")}
              </h2>
              <span className="font-mono text-[0.65rem] text-bone/55" aria-hidden="true">
                01
              </span>
            </div>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={{
                      pathname: "/services/[slug]",
                      params: { slug: service.slugs[locale] },
                    }}
                    className={NAV_LINK_CLASS}
                  >
                    <span>{service.title[locale]}</span>
                    <ArrowRight className="hidden h-3.5 w-3.5 flex-none text-accent-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            aria-label={t("companyHeading")}
            className="border-l border-t border-bone/15 pl-6 pt-6 lg:col-span-2 lg:border-t-0 lg:px-9 lg:pt-0"
          >
            <div className="flex items-center justify-between gap-4 border-b border-bone/20 pb-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink">
                {t("companyHeading")}
              </h2>
              <span className="font-mono text-[0.65rem] text-bone/55" aria-hidden="true">
                02
              </span>
            </div>
            <ul>
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={NAV_LINK_CLASS}>
                    <span>{tn(link.key)}</span>
                    <ArrowRight className="hidden h-3.5 w-3.5 flex-none text-accent-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section
            className="col-span-2 border-t border-bone/15 pt-6 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"
            aria-labelledby="footer-contact"
          >
            <div className="flex items-center justify-between gap-4 border-b border-bone/20 pb-4">
              <h2
                id="footer-contact"
                className="font-mono text-xs uppercase tracking-[0.14em] text-accent-ink"
              >
                {t("contactHeading")}
              </h2>
              <span className="font-mono text-[0.65rem] text-bone/55" aria-hidden="true">
                03
              </span>
            </div>

            <ul>
              {WHATSAPP_CONTACTS.map((contact) => (
                <li
                  key={contact.phone}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-bone/10 py-2"
                >
                  <div>
                    <p className="text-xs text-bone/70">
                      {contact.name}
                    </p>
                    <a
                      href={`tel:+${contact.phone}`}
                      className="mt-1 inline-flex min-h-[44px] items-center font-mono text-base text-bone transition-colors hover:text-accent-ink"
                    >
                      {contact.phoneDisplay}
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${contact.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${tc("whatsappLabel")}: ${contact.name}`}
                    className="flex h-11 w-11 items-center justify-center border border-bone/20 text-bone transition-colors hover:border-accent-ink hover:bg-accent-ink hover:text-carbon"
                  >
                    <LineIcon name="whatsapp" className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>

            {BUSINESS_EMAIL ? (
              <div className="border-b border-bone/10 py-2">
                <p className="text-xs text-bone/70">
                  {tc("emailLabel")}
                </p>
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="mt-1 inline-flex min-h-[44px] max-w-full items-center break-all text-sm text-bone/82 transition-colors hover:text-accent-ink"
                >
                  {BUSINESS_EMAIL}
                </a>
              </div>
            ) : null}

            {SERVICE_AREA.hasPublicOffice ? (
              <address className="flex gap-3 py-4 not-italic text-sm leading-relaxed text-bone/62">
                <LineIcon name="location" className="mt-0.5 h-5 w-5 flex-none text-accent-ink" />
                <span>
                  {BUSINESS.streetAddress}
                  <br />
                  {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
                </span>
              </address>
            ) : (
              <Link
                href="/contact"
                className="flex min-h-[52px] items-center gap-3 py-3 text-sm text-bone/62 transition-colors hover:text-bone"
              >
                <LineIcon name="location" className="h-5 w-5 flex-none text-accent-ink" />
                <span>{tc("address")}</span>
              </Link>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-bone/15 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-bone/65">
            &copy; {year} {BRAND.name}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
