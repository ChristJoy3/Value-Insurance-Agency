import { glossaryNotice } from "@/data/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { GlossarySearch } from "@/components/ui/GlossarySearch";
import { QuoteCta } from "@/components/ui/QuoteCta";

export const metadata = pageMetadata({
  title: "Insurance Glossary — Terms & Definitions",
  description:
    "Plain-language insurance glossary from Value Insurance Agency Inc., an independent agency in Washington, DC: hundreds of insurance terms and definitions, A to Z.",
  path: routes.glossary,
});

export default function GlossaryPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Insurance glossary" }]} kicker="Resources" title="Insurance Glossary">
        <p className="mt-8 max-w-[48ch] text-lead text-ink-soft">Insurance terms and definitions from Value Insurance Agency Inc.</p>
      </PageHero>
      <div className="shell pb-24 md:pb-32">
        <GlossarySearch />
        <p className="mt-16 max-w-[80ch] border-t border-rule pt-6 text-sm leading-relaxed text-ink-faint">
          <strong className="font-semibold text-ink-soft">NOTICE:</strong> {glossaryNotice}
        </p>
      </div>
      <QuoteCta />
    </>
  );
}
