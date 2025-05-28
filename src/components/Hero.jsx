import { useState } from "react";
import { Play, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import bgImage from "@/assets/img/hero.png";

export function Hero() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: "brightness(0.4)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-2 rounded-md bg-white/10 p-2 backdrop-blur-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-primary">
            <Shield className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold text-primary">TITANS CAREERS</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
          Accelerate your career with expert-led training in Business Analysis,
          Cybersecurity, Data Analytics, and Compliance.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white">
          Get job-ready with Titans Careers. Learn global skills today and stand
          out wherever you go.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/courses" className="relative group overflow-hidden">
            <Button className="w-full sm:w-auto px-8 py-6 bg-secondary text-foreground hover:bg-transparent hover:text-secondary hover:border border-secondary border rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform transition-all duration-300">
              Enrol Now
            </Button>
          </Link>

          <button
            onClick={() => setShowVideoModal(true)}
            className="group flex items-center gap-3 px-6 py-3 text-white hover:text-secondary transition-colors duration-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
              <Play className="h-4 w-4" />
            </span>
            <span className="text-lg">Watch Our Story</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 z-50 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
              <div className="wistia_responsive_padding">
                <div className="wistia_responsive_wrapper">
                  <wistia-player
                    media-id="o31acanvx8"
                    aspect="1.7777777777777777"
                    autoplay="true"
                    className="w-full h-full"
                  ></wistia-player>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Wistia scripts */}
      <script src="https://fast.wistia.com/player.js" async></script>
      <script
        src="https://fast.wistia.com/embed/o31acanvx8.js"
        async
        type="module"
      ></script>
    </section>
  );
}
