"use client";

import { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const projects = [
  {
    id: 1,
    title: "Gamification",
    description: "Interactive learning experiences through game-based elements",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "First Bank Nigeria",
    description: "Mobile friendly website for the multiscreen user",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Data Analytics Dashboard",
    description: "Real-time visualization of complex business metrics",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    title: "E-Commerce Platform",
    description: "Seamless shopping experience with advanced features",
    image:
      "https://images.unsplash.com/photo-1556742077-0a6b6a4a4ac4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    title: "Mobile App Development",
    description: "Cross-platform applications with intuitive user interfaces",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
  },
];

export function ProjectsCarousel() {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    dotsClass: "slick-dots !bottom-[-40px]",
  };

  const goToPrev = () => {
    sliderRef.current.slickPrev();
  };

  const goToNext = () => {
    sliderRef.current.slickNext();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-orange-500 text-center mb-12">
          Our Digital Projects
        </h2>

        <div className="relative pb-12">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <div className="mx-6">
            <Slider ref={sliderRef} {...settings}>
              {projects.map((project) => (
                <div key={project.id} className="px-2">
                  <div className="relative h-[400px] overflow-hidden rounded-lg group cursor-pointer">
                    {/* Project Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${project.image})` }}
                    >
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </div>

                    {/* Project Title and Description */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{project.title}</h3>

                      {/* Description that slides up on hover */}
                      <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                        <p className="mt-2 text-white/90">
                          {project.description}
                        </p>
                        <button className="mt-4 inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300">
                          Learn more
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -mr-4 transition-all duration-200 ease-in-out focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
