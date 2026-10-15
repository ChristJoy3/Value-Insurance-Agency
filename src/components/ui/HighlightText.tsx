import { Fragment } from "react";
import { HighlightSweep } from "./HighlightSweep";

/**
 * Renders `text` with every phrase in `phrases` wrapped in a HighlightSweep.
 * Phrases must appear verbatim in the text (validated against content.ts).
 */
export function HighlightText({ text, phrases = [] }: { text: string; phrases?: readonly string[] }) {
  const hits = phrases.filter((p) => p && text.includes(p));
  if (!hits.length) return <>{text}</>;
  const pattern = new RegExp(`(${hits.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return (
    <>
      {text.split(pattern).map((part, i) =>
        hits.includes(part) ? <HighlightSweep key={i}>{part}</HighlightSweep> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
