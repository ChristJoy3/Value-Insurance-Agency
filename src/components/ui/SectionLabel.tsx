import { DrawLine } from "./DrawLine";

/**
 * Document-style section marker: "02 — Why independent ............ DC • MD • VA"
 * with a hairline that draws across (the "draft" stage).
 */
export function SectionLabel({ n, title, aside = "DC • MD • VA", tone = "ink" }: { n: string; title: string; aside?: string; tone?: "ink" | "paper" }) {
  return (
    <div className={tone === "paper" ? "text-paper" : "text-ink"}>
      <div className="label flex items-center justify-between gap-4 pb-3">
        <span>
          <span className={tone === "paper" ? "text-paper-soft" : "text-ink-faint"}>{n} —</span> {title}
        </span>
        <span className={`hidden sm:inline ${tone === "paper" ? "text-paper-soft" : "text-ink-faint"}`}>{aside}</span>
      </div>
      <DrawLine className="opacity-30!" />
    </div>
  );
}
