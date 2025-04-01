import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { CompanyLogosCarousel } from "@/components/CompanyLogosCarousel";
import PartnerShowcase from "@/components/PartnerShowcase";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { PromoSection } from "@/components/PromoSection";
import { StatsSection } from "@/components/StatsSection";

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
    </>
  );
}

export default HomePage;
