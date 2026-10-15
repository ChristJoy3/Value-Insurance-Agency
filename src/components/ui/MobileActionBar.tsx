import { agency } from "@/data/content";

/**
 * Sticky bottom bar on phones + tablets (<1280px): Quote and Call are always
 * one thumb-tap away. Respects the iOS home-indicator safe area.
 */
export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="shell grid grid-cols-[1.35fr_1fr] gap-2 py-2.5 md:flex md:justify-end">
        <a href={agency.quoteUrl} target="_blank" rel="noopener" className="btn btn-ink min-h-12!">
          Get a Free Quote
        </a>
        <a href={agency.phone.href} className="btn btn-line min-h-12!" aria-label={`Call ${agency.phone.display}`}>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" />
          </svg>
          Call
        </a>
      </div>
    </div>
  );
}
