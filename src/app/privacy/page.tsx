import { privacy } from "@/data/content";
import { routes, sections } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { AnchorLink } from "@/components/ui/AnchorLink";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Web site privacy policy for Value Insurance Agency Inc., Washington, DC.",
  path: routes.privacy,
});

/** Legal text is rendered verbatim from content.ts. */
export default function PrivacyPage() {
  const last = privacy.sections[privacy.sections.length - 1];
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]} kicker="Legal" title="Privacy Policy">
        <p className="mt-8 max-w-[52ch] text-lead text-ink-soft">{privacy.title}</p>
      </PageHero>
      <div className="shell pb-24 md:pb-32">
        <div className="max-w-[46rem] space-y-5 text-[1.0625rem] leading-[1.75] text-ink-soft">
          <p>{privacy.intro}</p>
          {privacy.sections.map((s, i) => (
            <section key={i} className="space-y-5 pt-4">
              {s.heading && <h2 className="font-serif text-h3 text-ink">{s.heading}</h2>}
              {s.paragraphs.map((p, j) =>
                s === last && j === s.paragraphs.length - 1 ? (
                  <p key={j}>
                    {p.replace(/click here\.$/, "")}
                    <a href={privacy.gaOptOutUrl} target="_blank" rel="noopener" className="pen-link pen-link-static text-ink">
                      click here
                    </a>
                    .
                  </p>
                ) : (
                  <p key={j}>{p}</p>
                ),
              )}
            </section>
          ))}
          <p className="border-t border-rule pt-6">
            Questions? <AnchorLink href={sections.contact} className="pen-link pen-link-static text-ink">Contact us</AnchorLink>.
          </p>
        </div>
      </div>
    </>
  );
}
