import { agency, socials, home } from "@/data/content";
import { RevealText } from "@/components/ui/RevealText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Seal } from "@/components/ui/Seal";
import { SignatureLine } from "@/components/ui/SignatureLine";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "@/components/ui/ContactForm";

/** 10 Quote / Contact — the "sealed" finale on ink. */
export function QuoteContact() {
  const activeSocials = socials.filter((s) => s.active);
  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="on-ink bg-ink py-24 text-paper outline-none md:py-32">
      <div className="shell">
        <SectionLabel n="09" title="Get a free quote" aside="Online 24 hours a day" tone="paper" />

        <RevealText as="h2" id="contact-title" type="chars" className="mt-12 max-w-[13ch] text-display md:mt-16">
          The right insurance, at the <mark className="hl bg-transparent text-inherit">right</mark>{" "}
          <span className="whitespace-nowrap">
            <mark className="hl bg-transparent text-inherit">price</mark>.
          </span>
        </RevealText>
        <SignatureLine className="mt-4 w-[min(480px,80vw)] text-aqua" />

        <div className="mt-12 flex flex-wrap items-center gap-5 md:mt-16">
          <Seal tone="aqua" className="size-24 md:size-28" />
          <MagneticButton>
            <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-aqua btn-lg">
              Get a Free Quote <span aria-hidden>→</span>
            </a>
          </MagneticButton>
          <a href={agency.phone.href} className="btn btn-line-paper btn-lg">
            Call {agency.phone.display}
          </a>
        </div>
        <p className="mt-6 max-w-[56ch] text-paper-soft">{home.intro.split(". ").slice(2).join(". ")}</p>

        <div className="mt-20 grid gap-16 border-t border-paper-rule pt-12 md:mt-28 xl:grid-cols-[1fr_1.5fr] xl:gap-24">
          <address className="not-italic">
            <dl className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <dt className="label text-paper-soft">Office</dt>
                <dd className="mt-2 text-lead">
                  {agency.address.street}
                  <br />
                  {agency.address.city}, {agency.address.region} {agency.address.postalCode}
                  <a href={agency.mapsDirectionsUrl} target="_blank" rel="noopener" className="pen-link pen-link-static mt-3 block w-fit text-base">
                    Get directions ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-paper-soft">Phone</dt>
                <dd className="mt-2 text-lead">
                  <a href={agency.phone.href} className="pen-link">{agency.phone.display}</a>
                </dd>
              </div>
              <div>
                <dt className="label text-paper-soft">Email</dt>
                <dd className="mt-2">{agency.email}</dd>
              </div>
              <div>
                <dt className="label text-paper-soft">Hours</dt>
                <dd className="mt-2">{agency.hours}</dd>
              </div>
              <div>
                <dt className="label text-paper-soft">Licensed in</dt>
                <dd className="mt-2">{agency.licensedIn.join(" • ")}</dd>
              </div>
              {activeSocials.length > 0 && (
                <div>
                  <dt className="label text-paper-soft">Follow</dt>
                  <dd className="mt-2 flex gap-5">
                    {activeSocials.map((s) => (
                      <a key={s.name} href={s.href} target="_blank" rel="noopener" className="pen-link inline-flex min-h-11 items-center">
                        {s.name} ↗
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </address>
          <div>
            <h3 className="text-h3">Contact us via the web</h3>
            <p className="mt-3 mb-10 max-w-[56ch] text-paper-soft">Fill out the form as completely as possible and we’ll respond shortly.</p>
            <ContactForm tone="ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
