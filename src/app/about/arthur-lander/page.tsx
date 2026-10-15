import Link from "next/link";
import { about, arthur } from "@/data/content";
import { routes, sections } from "@/lib/routes";
import { yearsSince } from "@/lib/years";
import { pageMetadata, personJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { CountUp } from "@/components/ui/CountUp";
import { DrawLine } from "@/components/ui/DrawLine";
import { QuoteCta } from "@/components/ui/QuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Arthur Lander, CPA & Attorney — Résumé",
  description:
    "Résumé of Arthur Lander, President of Value Insurance Agency Inc.: Certified Public Accountant since 1981, attorney admitted to the Virginia Bar in 1989, business brokerage experience.",
  path: routes.arthur,
});

export default function ArthurPage() {
  const sections_ = [
    { label: "Licensing", text: arthur.licensing },
    { label: "Expert witness", text: arthur.expertWitness },
    { label: "Education & bar", text: arthur.education },
    { label: "Memberships", text: arthur.memberships },
    { label: "Community", text: arthur.community },
  ];
  return (
    <>
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/#about" },
            { name: "Arthur Lander", path: routes.arthur },
          ]),
        ]}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: sections.about }, { label: "Résumé" }]}
        kicker={`${arthur.role} · ${arthur.credentials}`}
        title={`${arthur.name}’s Résumé`}
        aside={
          <dl className="grid grid-cols-2 gap-8 font-mono">
            <div>
              <dt className="label text-ink-soft">Years as a CPA</dt>
              <dd className="mt-1 text-[clamp(2.5rem,2rem+2vw,4rem)] leading-none">
                <CountUp initial={yearsSince(arthur.cpaSince)} since={arthur.cpaSince} />
              </dd>
            </div>
            <div>
              <dt className="label text-ink-soft">Years in law</dt>
              <dd className="mt-1 text-[clamp(2.5rem,2rem+2vw,4rem)] leading-none">
                <CountUp initial={yearsSince(arthur.lawSince)} since={arthur.lawSince} />
              </dd>
            </div>
          </dl>
        }
      />

      <div className="shell grid gap-16 pb-24 md:pb-32 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-24">
        <div>
          <h2 className="label text-ink-faint">Experience</h2>
          <ol className="mt-6">
            {arthur.experience.map((e) => (
              <li key={e.organization} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[10rem_1fr] md:gap-10">
                <p className="label pt-2 text-ink-soft">{e.period ?? "Current"}</p>
                <div>
                  <h3 className="text-h3">{e.organization}</h3>
                  <p className="mt-3 max-w-[62ch] text-lg leading-relaxed text-ink-soft">{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <DrawLine className="opacity-20!" />

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {sections_.map((s) => (
              <section key={s.label}>
                <h2 className="label text-ink-faint">{s.label}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{s.text}</p>
              </section>
            ))}
          </div>
        </div>

        <aside className="xl:pt-12">
          <div className="sticky top-28 border border-rule p-6">
            {/* [PHOTO: Art Lander portrait] */}
            <div className="ledger flex aspect-[4/5] items-center justify-center bg-paper-deep">
              <span className="label px-4 text-center text-ink-soft">[PHOTO: Art Lander portrait]</span>
            </div>
            <p className="mt-6 text-ink-soft">{about.agency.text}</p>
            <Link href={sections.about} className="pen-link pen-link-static mt-6 inline-block font-medium">
              ← Back to About Value Insurance Agency Inc.
            </Link>
          </div>
        </aside>
      </div>
      <QuoteCta />
    </>
  );
}
