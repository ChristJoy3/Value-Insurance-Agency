import { whoWeHelp, home } from "@/data/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { DrawLine } from "@/components/ui/DrawLine";

/**
 * 05 Who We Help — the legacy site's own promise, marked up phrase by phrase,
 * then three calm ledger cards (copy from the site only).
 */
export function WhoWeHelp() {
  return (
    <section id="who-we-help" tabIndex={-1} aria-labelledby="who-title" className="bg-paper-deep py-24 outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="04" title="Who we help" />
        <h2 id="who-title" className="sr-only">Who we help</h2>

        <RevealText as="p" className="mt-12 max-w-[22ch] font-serif text-h2 md:mt-16">
          Whether you have the <mark className="hl bg-transparent text-inherit">ideal</mark>{" "}
          <span className="whitespace-nowrap">
            <mark className="hl bg-transparent text-inherit">history</mark>,
          </span>{" "}
          preferred companies desire, or a <mark className="hl bg-transparent text-inherit">not so perfect</mark>{" "}
          <span className="whitespace-nowrap">
            <mark className="hl bg-transparent text-inherit">history</mark>…
          </span>
        </RevealText>
        <RevealText as="p" delay={0.2} className="mt-6 max-w-[40ch] text-lead text-ink-soft">
          …we find the right coverage, with the best company, at the best price for you.
        </RevealText>

        <ul className="mt-16 grid gap-px md:mt-24 md:grid-cols-3">
          {whoWeHelp.cards.map((card, i) => (
            <li key={card.label} className="relative bg-paper p-6 md:p-8 xl:p-10">
              <div className="label flex justify-between text-ink-faint">
                <span>Case {String(i + 1).padStart(2, "0")}</span>
                <span>DC • MD • VA</span>
              </div>
              <DrawLine delay={i * 0.12} className="my-6 opacity-40!" />
              <h3 className="text-h3">{card.label}</h3>
              <p className="mt-4 text-ink-soft">{card.text}</p>
              {/* ledger ruling at the foot of each card */}
              <div aria-hidden className="ledger mt-8 h-20 opacity-70" />
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-[60ch] text-ink-soft">{home.personalTouch}</p>
      </div>
    </section>
  );
}
