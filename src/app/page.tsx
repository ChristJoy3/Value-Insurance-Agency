import { Preloader } from "@/components/ui/Preloader";
import { Hero } from "@/components/sections/Hero";
import { IndependentVsCaptive } from "@/components/sections/IndependentVsCaptive";
import { CoverageIndex } from "@/components/sections/CoverageIndex";
import { WhoWeHelp } from "@/components/sections/WhoWeHelp";
import { MeetArthur } from "@/components/sections/MeetArthur";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Carriers } from "@/components/sections/Carriers";
import { Resources } from "@/components/sections/Resources";
import { QuoteContact } from "@/components/sections/QuoteContact";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <JsonLd data={personJsonLd()} />
      <Hero />
      <IndependentVsCaptive />
      <CoverageIndex />
      <WhoWeHelp />
      <MeetArthur />
      <HowItWorks />
      <Carriers />
      <Resources />
      <QuoteContact />
    </>
  );
}
