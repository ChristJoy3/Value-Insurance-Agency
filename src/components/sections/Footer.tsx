import Link from "next/link";
import { agency, coverages, socials } from "@/data/content";
import { routes, sections } from "@/lib/routes";
import { LogoChip } from "@/components/ui/Logo";
import { AnchorLink } from "@/components/ui/AnchorLink";

const MARQUEE = "VALUE INSURANCE AGENCY · WASHINGTON, DC · INDEPENDENT BY DESIGN · ";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-ink overflow-hidden bg-ink text-paper">
      <div className="border-y border-paper-rule py-6" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} className="whitespace-nowrap pr-8 font-serif text-[clamp(2.5rem,1.5rem+4vw,6rem)] leading-none tracking-[-0.02em] text-paper/80">
              {MARQUEE.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      <div className="shell grid gap-12 py-16 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="Home">
            <LogoChip width={180} />
          </Link>
          <address className="mt-8 not-italic text-paper-soft">
            {agency.address.street}
            <br />
            {agency.address.city}, {agency.address.region} {agency.address.postalCode}
            <br />
            <a href={agency.phone.href} className="pen-link mt-2 inline-block text-paper">Ph: {agency.phone.display}</a>
          </address>
          <p className="label mt-6 text-paper-soft">Licensed in DC • MD • VA</p>
        </div>

        <nav aria-label="Coverage" className="xl:col-span-2">
          <p className="label mb-4 text-paper-soft">Insurance types</p>
          <ul className="columns-1 gap-8 leading-9 sm:columns-2">
            {coverages.map((c) => (
              <li key={c.slug}>
                <Link href={routes.coverage(c.slug)} className="pen-link">{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <p className="label mb-4 text-paper-soft">Site links</p>
          <ul className="leading-9">
            <li><AnchorLink href={sections.about} className="pen-link">About Us</AnchorLink></li>
            <li><Link href={routes.arthur} className="pen-link">Arthur Lander’s Résumé</Link></li>
            <li><a href={agency.quoteUrl} target="_blank" rel="noopener" className="pen-link">Get a Quote ↗</a></li>
            <li><Link href={routes.glossary} className="pen-link">Insurance Glossary</Link></li>
            <li><Link href={routes.refer} className="pen-link">Refer a Friend</Link></li>
            <li><Link href={routes.newsletter} className="pen-link">Newsletter</Link></li>
            <li><AnchorLink href={sections.contact} className="pen-link">Contact</AnchorLink></li>
          </ul>
          <p className="label mb-3 mt-8 text-paper-soft">Get social</p>
          <ul className="flex gap-5">
            {socials.filter((s) => s.active).map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener" className="pen-link inline-flex min-h-11 items-center">{s.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="shell label flex flex-wrap justify-between gap-4 border-t border-paper-rule py-6 text-paper-soft">
        <span>© {year} {agency.name}</span>
        <Link href={routes.privacy} className="pen-link">Privacy Policy</Link>
      </div>
    </footer>
  );
}
