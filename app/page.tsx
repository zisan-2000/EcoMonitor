// app/(marketing)/page.tsx
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/landing-page/HeroSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { AccessLevelsSection } from "@/components/landing-page/AccessLevelsSection";
import { CtaSection } from "@/components/landing-page/CtaSection";
import { FooterSection } from "@/components/landing-page/FooterSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <HeroSection />
      <FeaturesSection />
      {/* <AccessLevelsSection /> */}
      <CtaSection />
      <FooterSection />
    </div>
  );
}
