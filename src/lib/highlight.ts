/**
 * The .hl highlight's final size lives in CSS (so it shows without JS).
 * These helpers read it back so JS can sweep from 0% → final, whatever the
 * variant (marker band on paper, thin underline on ink).
 */
export function hlSizes(el: Element) {
  const to = getComputedStyle(el).backgroundSize || "100% 0.42em";
  const from = to.replace(/^\S+/, "0%");
  return { from, to };
}
