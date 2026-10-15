import { agency, home } from "@/data/content";
import { RevealText } from "@/components/ui/RevealText";
import { SignatureLine } from "@/components/ui/SignatureLine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Seal } from "@/components/ui/Seal";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { HeroIntro } from "./HeroIntro";

/**
 * 01 Hero — draft (ruled ledger + column rules) → review (highlight sweep on
 * "worked long and hard") → signed (flourish under the headline) → sealed
 * (seal stamps beside the quote CTA).
 */
export function Hero() {
  return (
    <HeroIntro>
      <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 md:pt-28">
        {/* draft layer: ledger rules + neoclassical column rules */}
        <div aria-hidden className="hero-ledger ledger absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden className="hero-columns columns-rules shell absolute inset-0 -z-10 bg-origin-content" />

        <div className="shell flex flex-1 flex-col">
          <div className="hero-meta label flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-ink-soft">
            <span>Washington, DC</span>
            <span className="hidden md:inline">Independent insurance agency / 01</span>
            <span>Licensed in DC • MD • VA</span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
            <p className="hero-eyebrow label mb-6 text-ink-soft md:mb-8">{home.eyebrow}</p>
            <RevealText as="h1" id="hero-title" type="chars" afterPreloader animateOnMobile={false} delay={0.1} className="max-w-[14ch] text-display">
              Protect the business you have <mark className="hl bg-transparent text-inherit">worked long and hard</mark> to grow.
            </RevealText>
            <SignatureLine afterPreloader delay={1.1} className="mt-4 w-[min(520px,80vw)] text-ink md:mt-6" />

            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,34rem)_1fr] md:items-end">
              <p className="hero-copy text-lead text-ink-soft">
                We are an independent agency with the customer in mind. We have relationships with many insurance companies, so we find the right coverage, with the best company, at the best price for you.
              </p>
              <div className="hero-ctas flex flex-wrap items-center gap-4 md:justify-end">
                <Seal afterPreloader delay={1.6} className="hidden size-24 xl:block" />
                <MagneticButton>
                  <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-ink btn-lg">
                    Get a Free Quote
                    <span aria-hidden>→</span>
                  </a>
                </MagneticButton>
                <a href={agency.phone.href} className="btn btn-line btn-lg">
                  Call {agency.phone.display}
                </a>
              </div>
            </div>
          </div>

          <div className="hero-foot label flex items-center justify-between border-t border-rule py-5 text-ink-faint">
            <AnchorLink href="/#independent" className="pen-link flex items-center gap-3 text-ink-soft">
              <span aria-hidden className="inline-block h-6 w-px bg-current" /> Scroll to review the fine print
            </AnchorLink>
            <span className="hidden md:inline">Quotes online 24 hours a day</span>
          </div>
        </div>
      </section>
    </HeroIntro>
  );
}
