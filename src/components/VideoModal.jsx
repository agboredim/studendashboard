import { useState } from "react";
import { Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { VideoModal } from "./VideoModal";
import bgImage from "@/assets/img/hero.jpg";

export function Hero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "brightness(0.5)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-2 rounded-md bg-white/10 p-2 backdrop-blur-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-blue-950">
            <Shield className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-white">Career Titans</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
          Accelerate your career with expert-led training in Business Analysis
          Cybersecurity, Data Analytics, and Compliance.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white">
          Join thousands of learners building the future through our powerful,
          easy-to-use online platform
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {/* Watch the Video Button */}
          <button
            onClick={openVideoModal}
            className="flex items-center justify-center gap-2 w-full rounded-full border bg-transparent px-6 py-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            <Play className="h-5 w-5" />
            <span>Watch the Video</span>
          </button>

          {/* Enrol Now Button */}
          <Link to="/courses">
            <Button className="w-full sm:w-48 rounded-full bg-blue-950 px-6 py-6 text-white hover:bg-blue-900 hover:shadow-lg transition-all duration-300">
              Enrol Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoId="o31acanvx8"
      />
    </section>
  );
}
