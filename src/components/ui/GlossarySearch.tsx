"use client";
/**
 * A–Z glossary with letter tabs and instant client-side search.
 * - ?q= pre-fills the search (homepage search form posts here).
 * - Letter tabs are a keyboard-navigable tablist (arrow keys, Home/End).
 * - "All" shows every term grouped by letter.
 */
import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { glossary, type GlossaryEntry } from "@/data/content";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Upper-case legacy terms → readable title case for display. */
function displayTerm(term: string) {
  return term
    .toLowerCase()
    .replace(/(^|[\s/(\-–])([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase())
    .replace(/\b(Of|And|Or|The|To|In|For|On|A|An)\b/g, (w, _1, offset: number) => (offset === 0 ? w : w.toLowerCase()))
    .replace(/\b(Adr|Cola|Ppo|Hmo|Pip|Llc|Erisa|Fdic|Naic|Iso|Cpcu|Cpi|Ltd|Std|Dui|Dwi|Gap|Bop|Epli|Vin|Ira|Pos)\b/g, (w) => w.toUpperCase());
}

function Definition({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((para, i) => (
        <p key={i} className="mt-3 first:mt-0">
          {para.split("\n").map((line, j) => (
            <span key={j} className={j ? "mt-1.5 block" : undefined}>
              {line}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

export function GlossarySearch() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string>("A");
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const available = useMemo(() => new Set(glossary.map((g) => g.letter)), []);

  // Hydrate from ?q= or #letter after mount (static export: no server search params)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const hash = window.location.hash.replace("#", "").toUpperCase();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
    if (q) setQuery(q);
    else if (hash.length === 1 && available.has(hash)) setLetter(hash);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [available]);

  const results: GlossaryEntry[] = useMemo(() => {
    if (!deferred) return glossary.filter((g) => g.letter === letter);
    return glossary.filter((g) => g.term.toLowerCase().includes(deferred) || g.definition.toLowerCase().includes(deferred));
  }, [deferred, letter]);

  // term-name matches first when searching
  const sorted = deferred
    ? [...results].sort((a, b) => Number(!a.term.toLowerCase().includes(deferred)) - Number(!b.term.toLowerCase().includes(deferred)))
    : results;

  const selectLetter = (l: string) => {
    setQuery("");
    setLetter(l);
    history.replaceState(null, "", `#${l.toLowerCase()}`);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const enabled = LETTERS.map((l, idx) => (available.has(l) ? idx : -1)).filter((x) => x >= 0);
    const pos = enabled.indexOf(i);
    let nextIdx: number | undefined;
    if (e.key === "ArrowRight") nextIdx = enabled[(pos + 1) % enabled.length];
    if (e.key === "ArrowLeft") nextIdx = enabled[(pos - 1 + enabled.length) % enabled.length];
    if (e.key === "Home") nextIdx = enabled[0];
    if (e.key === "End") nextIdx = enabled[enabled.length - 1];
    if (nextIdx === undefined) return;
    e.preventDefault();
    selectLetter(LETTERS[nextIdx]);
    tabRefs.current[nextIdx]?.focus();
  };

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 bg-paper px-4 pb-4 pt-2 shadow-[0_1px_0_var(--color-rule)] md:top-[4.5rem] md:-mx-10 md:px-10">
        <label htmlFor="glossary-search" className="label text-ink-soft">
          Search {glossary.length} terms
        </label>
        <div className="flex items-end gap-3">
          <input
            id="glossary-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “deductible” or “liability”"
            className="field flex-1 font-serif text-[1.5rem]! md:text-[2rem]!"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="label min-h-11 px-3 text-ink-soft">
              Clear
            </button>
          )}
        </div>
        <div role="tablist" aria-label="Glossary letters" className="mt-4 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]" data-lenis-prevent>
          {LETTERS.map((l, i) => {
            const has = available.has(l);
            const selected = !deferred && letter === l;
            return (
              <button
                key={l}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="glossary-results"
                tabIndex={selected || (deferred && i === 0) ? 0 : -1}
                disabled={!has}
                onClick={() => selectLetter(l)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex size-11 shrink-0 items-center justify-center rounded-full font-mono text-sm transition-colors ${
                  selected ? "bg-ink text-paper" : has ? "hover:bg-paper-deep" : "text-ink-faint/50 line-through"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <div id="glossary-results" role="tabpanel" aria-live="polite" className="mt-10">
        <p className="label mb-6 text-ink-faint">
          {deferred ? `${sorted.length} result${sorted.length === 1 ? "" : "s"} for “${query.trim()}”` : `${letter} · ${sorted.length} terms`}
        </p>
        {sorted.length === 0 ? (
          <p className="text-lead text-ink-soft">No terms match. Try a shorter word, or call us at 202-999-2131 and we’ll explain it.</p>
        ) : (
          <dl className="border-t border-rule">
            {sorted.map((g) => (
              <div key={g.id} id={g.id} className="grid gap-2 border-b border-rule py-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10">
                <dt className="font-serif text-[1.375rem] leading-snug">{displayTerm(g.term)}</dt>
                <dd className="text-ink-soft">
                  <Definition text={g.definition} />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
