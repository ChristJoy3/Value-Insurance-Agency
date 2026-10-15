/**
 * Every internal URL in one place. trailingSlash is on (static export), so all
 * page links end in "/" — this avoids an extra redirect hop on static hosts.
 */
export const routes = {
  home: "/",
  coverage: (slug: string) => `/coverage/${slug}/`,
  glossary: "/glossary/",
  arthur: "/about/arthur-lander/",
  privacy: "/privacy/",
  refer: "/refer/",
  newsletter: "/newsletter/",
} as const;

/** Homepage section anchors (used by nav, menu, footer). */
export const sections = {
  independent: "/#independent",
  coverage: "/#coverage",
  who: "/#who-we-help",
  about: "/#about",
  process: "/#how-it-works",
  resources: "/#resources",
  contact: "/#contact",
} as const;

export const navLinks = [
  { label: "Coverage", href: sections.coverage },
  { label: "Why independent", href: sections.independent },
  { label: "About Art", href: sections.about },
  { label: "Resources", href: sections.resources },
  { label: "Contact", href: sections.contact },
] as const;
