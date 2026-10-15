import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { agency } from "@/data/content";
import { SITE_URL, agencyJsonLd } from "@/lib/seo";
import { PRELOADED_KEY } from "@/lib/preloader";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/ui/Navbar";
import { MobileActionBar } from "@/components/ui/MobileActionBar";
import { Cursor } from "@/components/ui/Cursor";
import { PreloadMark } from "@/components/ui/PreloadMark";
import { JsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/sections/Footer";

/* Monumental high-contrast serif for headlines */
const fraunces = Fraunces({ subsets: ["latin"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
/* Clean grotesk for body */
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
/* Mono for labels, numbers and "document" details */
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Business Insurance in Washington, DC | Value Insurance Agency Inc.",
    template: "%s | Value Insurance Agency Inc.",
  },
  description:
    "Independent insurance agent in Washington, DC. Value Insurance Agency Inc. compares many carriers to find business insurance — general liability, workers compensation, commercial auto and more — for DC, Maryland and Virginia businesses.",
  keywords: [
    "business insurance Washington DC",
    "independent insurance agent DC",
    "workers compensation insurance DC",
    "general liability insurance Maryland Virginia",
    "taxi and limousine insurance DC",
    "professional liability insurance DC",
  ],
  applicationName: agency.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: agency.name,
    locale: "en_US",
    url: "/",
    title: "Business Insurance in Washington, DC | Value Insurance Agency Inc.",
    description: "The fine print, made clear. An independent agency led by a CPA and attorney, serving DC, Maryland and Virginia businesses.",
    images: [{ url: "/logo.png", width: 392, height: 74, alt: "Value Insurance Agency Inc." }],
  },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint: skip the homepage preloader for deep links, repeat visits and reduced motion. */
const preloadScript = `try{if(location.hash.length>1||sessionStorage.getItem('${PRELOADED_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-preloaded','')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <head>
        <Script id="via-preload" strategy="beforeInteractive">
          {preloadScript}
        </Script>
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <JsonLd data={agencyJsonLd()} />
      </head>
      <body>
        <SmoothScroll>
          <Navbar />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
          <Cursor />
          <PreloadMark />
        </SmoothScroll>
      </body>
    </html>
  );
}
