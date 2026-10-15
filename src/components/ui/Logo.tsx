/**
 * The client's logo, used exactly as supplied (public/logo.png): never
 * recoloured, cropped further or redrawn — only scaled proportionally.
 * It is black-on-transparent, so on dark backgrounds wrap it in <LogoChip>.
 */
type Props = { className?: string; width?: number; priority?: boolean };

export const LOGO = { src: "/logo.png", width: 392, height: 74 } as const;

export function Logo({ className = "", width = 168, priority = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export; file is pre-sized
    <img
      src={LOGO.src}
      width={width}
      height={Math.round((width * LOGO.height) / LOGO.width)}
      alt="Value Insurance Agency Inc."
      className={`h-auto select-none ${className}`}
      style={{ width, maxWidth: "100%" }}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
    />
  );
}

/** Paper "card" behind the logo for contrast on ink sections. */
export function LogoChip({ width = 168, className = "" }: { width?: number; className?: string }) {
  return (
    <span className={`inline-block rounded-[2px] bg-paper px-4 py-3 ${className}`}>
      <Logo width={width} />
    </span>
  );
}
