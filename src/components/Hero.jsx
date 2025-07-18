import { useState, useRef, useEffect } from "react";
import { Play, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AwsVideoPlayer from "./AwsVideoPlayer";
import bgImage from "@/assets/img/hero.png";

export function Hero() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef(null);

  // Handle when video player is ready
  const handleVideoReady = () => {
    // Auto-play when video is ready and modal is open
    if (showVideoModal && videoRef.current) {
      setTimeout(() => {
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.play();
        }
      }, 50);
    }
  };

  // Auto-play video when modal opens
  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      // Try multiple times with increasing delays to ensure video is ready
      const tryPlayVideo = (attempt = 1) => {
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.play();
        } else if (attempt < 5) {
          // Retry up to 5 times with increasing delays
          setTimeout(() => tryPlayVideo(attempt + 1), attempt * 100);
        }
      };

      // Start trying to play after a small initial delay
      setTimeout(() => tryPlayVideo(), 100);
    }
  }, [showVideoModal]);

  // Handle modal close
  const handleCloseModal = () => {
    // Pause video when closing modal
    if (videoRef.current && videoRef.current.pause) {
      videoRef.current.pause();
    }
    setShowVideoModal(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showVideoModal) {
        handleCloseModal();
      }
    };

    if (showVideoModal) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [showVideoModal]);

  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      {/* Blurred placeholder while image loads */}
      <div
        className={`absolute inset-0 bg-no-repeat bg-cover transition-all duration-700 ${
          imageLoaded ? "" : "blur-lg scale-105 bg-gray-900"
        }`}
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: imageLoaded ? "brightness(0.4)" : "brightness(0.3)",
        }}
      >
        {/* Hidden img tag to track load event */}
        <img
          src={bgImage}
          alt="Hero background"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleCloseModal} // Close modal when clicking backdrop
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking video
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 z-50 text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Video container */}
            <div className="relative w-full">
              <div className="aspect-w-16 aspect-h-9 w-full rounded-lg overflow-hidden shadow-2xl">
                <AwsVideoPlayer
                  ref={videoRef}
                  videoUrl="https://titanscareers.s3.eu-north-1.amazonaws.com/media/titanscareers.com.mp4"
                  title="Titans Careers Story"
                  className="w-full h-full min-h-[400px] md:min-h-[500px]"
                  onLoadedData={handleVideoReady}
                />
              </div>
            </div>

            {/* Video title */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-semibold">Our Story</h3>
              <p className="text-white/80 text-sm mt-1">
                Discover how Titans Careers is transforming professional
                development
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
