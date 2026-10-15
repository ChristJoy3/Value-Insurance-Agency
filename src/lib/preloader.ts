/**
 * Tiny signal so the hero intro waits for the preloader to finish.
 * Pages without a preloader never subscribe, so nothing waits on them.
 */
let done = false;
const listeners = new Set<() => void>();

export const PRELOADED_KEY = "via-preloaded";

export function markPreloaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Runs `fn` once the preloader is gone (immediately if it already is). Returns an unsubscribe. */
export function whenPreloaderDone(fn: () => void): () => void {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
