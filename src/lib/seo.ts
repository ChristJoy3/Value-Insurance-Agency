/**
 * SEO helpers: canonical URLs + JSON-LD builders.
 * Only real facts from content.ts — no invented ratings, prices or reviews.
 */
import type { Metadata } from "next";
import { agency, arthur, type Coverage } from "@/data/content";

export const SITE_URL = agency.siteUrl;

export const abs = (path: string) => new URL(path, SITE_URL).toString();

/** Per-page metadata with canonical + Open Graph filled in consistently. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: agency.name, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const AGENCY_ID = `${SITE_URL}/#agency`;
const PERSON_ID = `${SITE_URL}/#arthur-lander`;

export function agencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "@id": AGENCY_ID,
    name: agency.name,
    url: SITE_URL,
    logo: abs("/logo.png"),
    image: abs("/logo.png"),
    telephone: agency.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: agency.address.street,
      addressLocality: agency.address.city,
      addressRegion: agency.address.region,
      postalCode: agency.address.postalCode,
      addressCountry: agency.address.country,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Washington, DC" },
      { "@type": "State", name: "Maryland" },
      { "@type": "State", name: "Virginia" },
    ],
    founder: { "@id": PERSON_ID },
    sameAs: ["https://www.linkedin.com/company/value-insurance-agency-inc-", "https://www.facebook.com/ValueInsurance"],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: arthur.name,
    jobTitle: "President",
    worksFor: { "@id": AGENCY_ID },
    alumniOf: { "@type": "CollegeOrUniversity", name: "George Mason University School of Law" },
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Certified Public Accountant" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "Attorney — admitted to the Virginia Bar, 1989" },
    ],
    memberOf: [
      { "@type": "Organization", name: "Alexandria Bar Association" },
      { "@type": "Organization", name: "Arlington Bar Association" },
    ],
    url: abs("/about/arthur-lander/"),
  };
}

export function serviceJsonLd(c: Coverage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.title,
    serviceType: c.name,
    description: c.seo.description,
    provider: { "@id": AGENCY_ID },
    areaServed: ["Washington, DC", "Maryland", "Virginia"],
    url: abs(`/coverage/${c.slug}/`),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}
