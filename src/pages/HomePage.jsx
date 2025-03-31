import { FeaturesBanner } from "@/components/FeaturesBanner";
import { Hero } from "@/components/Hero";
import { LearningTopicsCarousel } from "@/components/LearningTopicsCarousel";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { StatsSection } from "@/components/StatsSection";

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBanner />
      <LearningTopicsCarousel />
      <StatsSection />
      <ProjectsCarousel />
    </>
  );
}

export default HomePage;
