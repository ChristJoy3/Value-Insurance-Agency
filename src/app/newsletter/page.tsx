import Link from "next/link";
import { newsletterPage } from "@/data/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { SimpleForm } from "@/components/ui/SimpleForm";

export const metadata = pageMetadata({
  title: "Newsletter Signup",
  description: "Join the Value Insurance Agency Inc. mailing list for the latest events, news and offers.",
  path: routes.newsletter,
});

export default function NewsletterPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} kicker="Newsletter" title={newsletterPage.title}>
        <p className="mt-8 max-w-[56ch] text-lead text-ink-soft">{newsletterPage.heading}</p>
      </PageHero>
      <div className="shell max-w-[56rem] pb-24 md:pb-32">
        <p className="mb-12 max-w-[60ch] text-ink-soft">{newsletterPage.text}</p>
        <SimpleForm
          subject="Newsletter signup"
          submitLabel="Join the list"
          groups={[
            {
              fields: [
                { name: "firstName", label: "First name", required: true, autoComplete: "given-name" },
                { name: "lastName", label: "Last name", required: true, autoComplete: "family-name" },
                { name: "email", label: "E-mail address", type: "email", required: true, autoComplete: "email", full: true },
              ],
            },
          ]}
        />
        <p className="mt-12 max-w-[64ch] border-t border-rule pt-6 text-sm leading-relaxed text-ink-faint">
          {newsletterPage.privacyNote.split("Privacy Policy")[0]}
          <Link href={routes.privacy} className="pen-link pen-link-static text-ink-soft">Privacy Policy</Link>
          {newsletterPage.privacyNote.split("Privacy Policy").slice(1).join("Privacy Policy")}
        </p>
      </div>
    </>
  );
}
