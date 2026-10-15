import { referPage } from "@/data/content";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { SimpleForm } from "@/components/ui/SimpleForm";

export const metadata = pageMetadata({
  title: "Refer a Friend",
  description: "Refer a business to Value Insurance Agency Inc., an independent insurance agency in Washington, DC.",
  path: routes.refer,
});

export default function ReferPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Refer a friend" }]} kicker={referPage.title} title={referPage.heading}>
        <p className="mt-8 max-w-[56ch] text-lead text-ink-soft">{referPage.text}</p>
      </PageHero>
      <div className="shell max-w-[56rem] pb-24 md:pb-32">
        <SimpleForm
          subject="Referral from the website"
          submitLabel="Send referral"
          groups={[
            {
              legend: "Your information",
              fields: [
                { name: "firstName", label: "First name", required: true, autoComplete: "given-name" },
                { name: "lastName", label: "Last name", required: true, autoComplete: "family-name" },
                { name: "email", label: "Your email address", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Your phone number", type: "tel", required: true, autoComplete: "tel" },
              ],
            },
            {
              legend: "Your friend’s information",
              fields: [
                { name: "friendFirst", label: "Friend’s first name", required: true },
                { name: "friendLast", label: "Friend’s last name", required: true },
                { name: "friendEmail", label: "Your friend’s email address", type: "email", required: true },
                { name: "friendPhone", label: "Your friend’s phone number", type: "tel", required: true },
                { name: "comments", label: "Special comments", required: true, full: true, multiline: true },
              ],
            },
          ]}
        />
      </div>
    </>
  );
}
