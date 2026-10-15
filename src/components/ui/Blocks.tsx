import type { Block } from "@/data/content";
import { HighlightText } from "./HighlightText";

/**
 * Renders migrated legacy copy (content.ts Block[]) as readable editorial
 * prose. Key phrases get the "review" highlight sweep.
 */
export function Blocks({ blocks, highlights = [] }: { blocks: Block[]; highlights?: readonly string[] }) {
  return (
    <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-ink-soft md:text-lg">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2 key={i} className="pt-6 font-serif text-h3 text-ink first:pt-0">
                {b.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i}>
                <HighlightText text={b.text} phrases={highlights} />
                {b.link && (
                  <>
                    {" "}
                    <a href={b.link.href} target="_blank" rel="noopener" className="pen-link pen-link-static whitespace-nowrap text-ink">
                      {b.link.label} ↗
                    </a>
                  </>
                )}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="border-t border-rule">
                {b.items.map((it, j) => (
                  <li key={j} className="grid grid-cols-[2.5rem_1fr] gap-2 border-b border-rule py-4">
                    <span className="label pt-1.5 text-ink-faint">{String(j + 1).padStart(2, "0")}</span>
                    <span>
                      {it.term && <strong className="font-semibold text-ink">{it.term} </strong>}
                      <HighlightText text={it.text} phrases={highlights} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "footnote":
            return (
              <p key={i} className="border-t border-rule pt-4 text-sm text-ink-faint">
                {b.text}{" "}
                {b.link && (
                  <a href={b.link.href} target="_blank" rel="noopener" className="pen-link pen-link-static">
                    {b.link.label} ↗
                  </a>
                )}
              </p>
            );
        }
      })}
    </div>
  );
}
