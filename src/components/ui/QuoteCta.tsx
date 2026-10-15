import { agency } from "@/data/content";
import { MagneticButton } from "./MagneticButton";
import { Seal } from "./Seal";
import { SignatureLine } from "./SignatureLine";

/** Closing "sealed" CTA band used on inner pages. */
export function QuoteCta({ title = "Get the right coverage, at the right price.", line }: { title?: string; line?: string }) {
  return (
    <section aria-label="Get a free quote" className="on-ink bg-ink py-20 text-paper md:py-28">
      <div className="shell grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
        <div>
          <p className="label text-paper-soft">Quotes online 24 hours a day</p>
          <h2 className="mt-5 max-w-[18ch] text-h2">{title}</h2>
          <SignatureLine className="mt-3 w-[min(360px,70vw)] text-aqua" />
          {line && <p className="mt-6 text-lead text-paper-soft">{line}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Seal tone="aqua" className="hidden size-24 md:block" />
          <MagneticButton>
            <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-aqua btn-lg">
              Get a Free Quote <span aria-hidden>→</span>
            </a>
          </MagneticButton>
          <a href={agency.phone.href} className="btn btn-line-paper btn-lg">
            Call {agency.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
