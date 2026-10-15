/**
 * Dynamic year calculations (never hard-code "37 years").
 * Dates come from Arthur Lander's résumé (src/data/content.ts → arthur).
 */
export type YearMonth = { year: number; month: number };

/** Whole years elapsed since a year/month, as of `now`. */
export function yearsSince({ year, month }: YearMonth, now: Date = new Date()): number {
  let years = now.getFullYear() - year;
  if (now.getMonth() + 1 < month) years -= 1;
  return Math.max(0, years);
}
