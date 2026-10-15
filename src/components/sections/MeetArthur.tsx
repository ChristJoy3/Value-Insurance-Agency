import Link from "next/link";
import { about, arthur } from "@/data/content";
import { routes } from "@/lib/routes";
import { yearsSince } from "@/lib/years";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { RevealImage } from "@/components/ui/RevealImage";
import { CountUp } from "@/components/ui/CountUp";
import { SignatureLine } from "@/components/ui/SignatureLine";

/**
 * 06 Meet Arthur Lander — editorial portrait slot + credentials as large mono
 * stats. Years are computed from résumé dates (build time, refreshed on the
 * client) so they never go stale.
 */
export function MeetArthur() {
  const cpa = yearsSince(arthur.cpaSince);
  const law = yearsSince(arthur.lawSince);

  return (
    <section id="about" tabIndex={-1} aria-labelledby="arthur-title" className="py-24 outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="05" title="Meet the president" aside="CPA • Attorney" />
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[5fr_7fr] md:gap-12 xl:gap-20">
          <RevealImage className="aspect-[4/5] w-full md:sticky md:top-28 md:self-start">
            {/* [PHOTO: Art Lander portrait] — replace with <img> once supplied */}
            <div className="ledger relative flex size-full flex-col justify-between border border-ink/20 bg-paper-deep p-5">
              <span className="label text-ink-faint">Fig. 01</span>
              <span className="label self-center text-center text-ink-soft">[PHOTO: Art Lander portrait]</span>
              <span className="label text-right text-ink-faint">1725 I St NW</span>
            </div>
          </RevealImage>

          <div>
            <p className="label text-ink-soft">{arthur.role}</p>
            <RevealText as="h2" id="arthur-title" type="chars" className="mt-4 text-h1">
              {arthur.name}
            </RevealText>
            <SignatureLine className="mt-3 w-[min(320px,70vw)] text-ink" />
            <p className="mt-8 max-w-[56ch] text-lead text-ink-soft">{about.agency.text.split(". Arthur Lander,")[0]}.</p>

            <dl className="mt-12 grid border-t border-rule sm:grid-cols-3">
              <div className="border-b border-rule py-6 sm:border-b-0 sm:border-r sm:pr-6">
                <dt className="label text-ink-soft">Years as a CPA*</dt>
                <dd className="mt-2 font-mono text-[clamp(3rem,2rem+3vw,5rem)] leading-none tracking-tight">
                  <CountUp initial={cpa} since={arthur.cpaSince} />
                </dd>
              </div>
              <div className="border-b border-rule py-6 sm:border-b-0 sm:border-r sm:px-6">
                <dt className="label text-ink-soft">Years practicing law</dt>
                <dd className="mt-2 font-mono text-[clamp(3rem,2rem+3vw,5rem)] leading-none tracking-tight">
                  <CountUp initial={law} since={arthur.lawSince} />
                </dd>
              </div>
              <div className="py-6 sm:pl-6">
                <dt className="label text-ink-soft">Business brokerage</dt>
                <dd className="mt-3 font-serif text-[1.375rem] leading-snug">President, Value Business Brokerage, Inc.</dd>
              </div>
            </dl>

            <p className="mt-8 max-w-[56ch] text-ink-soft">{about.agency.text.split("as well as experience in business brokerage. ")[1]}</p>

            <div className="mt-10 border-t border-rule pt-6">
              <Link href={routes.arthur} className="pen-link pen-link-static font-medium">
                Read full résumé<sup>*</sup>
              </Link>
              <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink-faint">
                * Certified to practice as a CPA in October 1981; admitted to the Virginia Bar in April 1989 and waived into the District of Columbia.
                Licensed as a CPA in Virginia, the District of Columbia, and Maryland.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
