import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { CompanyLogosCarousel } from "@/components/CompanyLogosCarousel";
// import PartnerShowcase from "@/components/PartnerShowcase";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { StatsSection } from "@/components/StatsSection";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { CourseIntroVideos } from "@/components/CourseIntroVideos";
import { WhyChooseUs } from "@/components/WhyChooseUs";

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBanner />
      {/* <CompanyLogosCarousel /> */}
      <StatsSection />
      <WhyChooseUs />
      <ProjectsCarousel />
      <CourseIntroVideos />
      <PlatformFeatures />
    </>
  );
}

export default HomePage;
