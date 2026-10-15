import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { LegacyRedirect } from "@/components/ui/LegacyRedirect";

export default function NotFound() {
  return (
    <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "404" }]} kicker="Page not found" title="This page isn’t in the file.">
      <LegacyRedirect />
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn btn-ink">Back to home</Link>
        <AnchorLink href="/#coverage" className="btn btn-line">Browse coverage</AnchorLink>
      </div>
    </PageHero>
  );
}
