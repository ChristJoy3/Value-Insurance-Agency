import { carriers } from "@/data/content";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * 08 Carrier Partners — calm monochrome logo wall (full colour on hover/focus).
 * Only carriers verified by the client are listed (content.ts → carriers).
 * Until then: placeholder slots in dev review builds, nothing in production.
 */
const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1";

export function Carriers() {
  if (!carriers.length && !SHOW_PLACEHOLDERS) return null;
  const slots = carriers.length ? carriers : Array.from({ length: 8 }, () => null);

  return (
    <section aria-labelledby="carriers-title" className="py-20 md:py-28">
      <div className="shell">
        <SectionLabel n="07" title="Carrier partners" aside="Independent by design" />
        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <h2 id="carriers-title" className="text-h3">We have relationships with many insurance companies.</h2>
          {!carriers.length && (
            <p className="label text-ink-faint">[Placeholder — carrier list pending client confirmation]</p>
          )}
        </div>
        <ul className="mt-12 grid grid-cols-2 border-l border-t border-rule md:grid-cols-4">
          {slots.map((c, i) => (
            <li key={c?.name ?? i} className="flex aspect-[3/2] items-center justify-center border-b border-r border-rule p-6">
              {c ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.logo}
                  width={c.width}
                  height={c.height}
                  alt={`${c.name} logo`}
                  loading="lazy"
                  className="max-h-12 w-auto opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              ) : (
                <span className="label text-center text-ink-faint">[Carrier logo]</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
