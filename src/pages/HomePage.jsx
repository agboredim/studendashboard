import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { CompanyLogosCarousel } from "@/components/CompanyLogosCarousel";
import PartnerShowcase from "@/components/PartnerShowcase";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { PromoSection } from "@/components/PromoSection";
import { StatsSection } from "@/components/StatsSection";
import { PlatformFeatures } from "@/components/PlatformFeatures";

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBanner />
      <CompanyLogosCarousel />
      <StatsSection />
      <ProjectsCarousel />
      <PromoSection />
      <PartnerShowcase />
      <PlatformFeatures />
    </>
  );
}

export default HomePage;
