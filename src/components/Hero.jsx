import { Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // Import Link
import bgImage from "@/assets/img/hero.jpg";

export function Hero() {
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
          <span className="text-xl font-bold text-white">AML Pro</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl lg:text-5xl">
          Master KYC & AML Compliance and Unlock High-Paying Opportunities
          Today!
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-white">
          The Most Innovative KYC/AML Learning Platform for Digital Compliance
          Experience
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {/* Watch the Video Button */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-48 rounded-full border-white bg-transparent px-6 py-6 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            <Play className="h-5 w-5" />
            <span>Watch the Video</span>
          </Button>

          {/* Enrol Now Button */}
          <Link to="/courses">
            <Button className="w-full sm:w-48 rounded-full bg-blue-950 px-6 py-6 text-white hover:bg-blue-900 hover:shadow-lg transition-all duration-300">
              Enrol Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
