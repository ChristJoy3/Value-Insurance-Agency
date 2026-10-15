import Link from "next/link";
import { glossary, referPage, newsletterPage } from "@/data/content";
import { routes } from "@/lib/routes";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";

/** 09 Resources — glossary search preview, Refer a Friend, Newsletter. */
export function Resources() {
  const letters = new Set(glossary.map((g) => g.letter)).size;
  return (
    <section id="resources" tabIndex={-1} aria-labelledby="resources-title" className="bg-paper-deep py-24 outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="08" title="Resources" aside="Read the fine print" />
        <RevealText as="h2" id="resources-title" className="mt-10 max-w-[20ch] text-h2">
          Insurance, in <mark className="hl bg-transparent text-inherit">plain</mark>{" "}
          <span className="whitespace-nowrap">
            <mark className="hl bg-transparent text-inherit">words</mark>.
          </span>
        </RevealText>

        <div className="mt-14 grid gap-px md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
          <div className="bg-paper p-6 md:col-span-2 md:p-8 xl:col-span-1 xl:p-10">
            <p className="label text-ink-faint">Insurance glossary · {glossary.length} terms · {letters} letters</p>
            <h3 className="mt-4 text-h3">Look up a term</h3>
            {/* plain GET form: works without JS, glossary page reads ?q= */}
            <form action={routes.glossary} method="get" role="search" className="mt-8 flex items-end gap-3">
              <label htmlFor="glossary-q" className="sr-only">Search the insurance glossary</label>
              <input id="glossary-q" name="q" type="search" placeholder="e.g. actual cash value" className="field flex-1" autoComplete="off" />
              <button type="submit" className="btn btn-ink min-h-12!">Search</button>
            </form>
            <ul className="mt-6 flex flex-wrap gap-2">
              {["Adjuster", "Deductible", "Umbrella", "Liability"].map((t) => (
                <li key={t}>
                  <Link href={`${routes.glossary}?q=${encodeURIComponent(t)}`} className="label inline-flex min-h-11 items-center rounded-full border border-rule px-4 hover:border-ink">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href={routes.refer} className="group flex flex-col justify-between bg-paper p-6 md:p-8 xl:p-10">
            <div>
              <p className="label text-ink-faint">Refer a friend</p>
              <h3 className="mt-4 text-h3">We love referrals!</h3>
              <p className="mt-4 text-ink-soft">{referPage.text.split(". Thank you")[0]}.</p>
            </div>
            <span className="pen-link pen-link-static mt-8 self-start font-medium">Send a referral →</span>
          </Link>

          <Link href={routes.newsletter} className="group flex flex-col justify-between bg-paper p-6 md:p-8 xl:p-10">
            <div>
              <p className="label text-ink-faint">Newsletter</p>
              <h3 className="mt-4 text-h3">Join our mailing list</h3>
              <p className="mt-4 text-ink-soft">{newsletterPage.heading}</p>
            </div>
            <span className="pen-link pen-link-static mt-8 self-start font-medium">Sign up →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
