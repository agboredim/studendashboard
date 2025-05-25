import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "../hooks/useInView";
import { useGetAllCoursesQuery } from "@/services/coursesApi";
import Spinner from "./Spinner";

export function CourseIntroVideos() {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const sliderRef = useRef(null);
  const [sectionRef, isInView] = useInView({ threshold: 0.3 });
  const hasInitializedRef = useRef(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Fetch courses using RTK Query
  const { data: courses = [], isLoading, error } = useGetAllCoursesQuery();

  // Handle autoplay of first video when section comes into view
  // Added a check for activeVideoId to prevent restarting if already playing
  useEffect(() => {
    if (
      isInView &&
      !hasInitializedRef.current &&
      courses.length > 0 &&
      activeVideoId === null
    ) {
      const timer = setTimeout(() => {
        setActiveVideoId(courses[0].id);
        hasInitializedRef.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isInView, courses, activeVideoId]);

  // Function to toggle video play state
  const toggleVideo = useCallback((courseId) => {
    setActiveVideoId((prevId) => (prevId === courseId ? null : courseId));
  }, []);

  // Stop video when slider changes
  const handleBeforeChange = useCallback(() => {
    setActiveVideoId(null);
  }, []);

  // Update current slide index
  const handleAfterChange = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const goToPrev = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  }, []);

  const goToNext = useCallback(() => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  }, []);

  // Initialize slide count after courses are loaded and slider is mounted
  useEffect(() => {
    if (sliderRef.current && courses.length > 0) {
      setSlideCount(courses.length);
      // Initial check for disabling arrows
      const settings = sliderRef.current.props.settings;
      if (settings && typeof settings.slidesToShow === "number") {
        const initialSlidesToShow = Array.isArray(settings.slidesToShow)
          ? settings.slidesToShow[0].settings.slidesToShow // Handle responsive array if needed, simple check assumes object structure
          : settings.slidesToShow;

        // If total slides are less than or equal to slides shown, disable arrows initially
        if (courses.length <= initialSlidesToShow) {
        }
      } else {
        // Fallback or handle cases where settings.slidesToShow is not immediately available
        if (courses.length <= 3) {
          // Assume default slidesToShow is 3 if settings not ready
          // Disable arrows initially
        }
      }
    }
  }, [courses]);

  // Calculate if next arrow should be disabled
  const isNextArrowDisabled = useMemo(() => {
    if (!sliderRef.current || slideCount === 0) return true;

    // Get the current number of slides shown based on window width and responsive settings
    const currentSettings = sliderRef.current.props.settings;
    let effectiveSlidesToShow = 3;

    if (currentSettings && Array.isArray(currentSettings.responsive)) {
      const windowWidth = window.innerWidth;
      for (const breakpoint of currentSettings.responsive) {
        if (windowWidth <= breakpoint.breakpoint) {
          if (
            breakpoint.settings &&
            typeof breakpoint.settings.slidesToShow === "number"
          ) {
            effectiveSlidesToShow = breakpoint.settings.slidesToShow;
          }
          break;
        }
      }
    } else if (
      currentSettings &&
      typeof currentSettings.slidesToShow === "number"
    ) {
      effectiveSlidesToShow = currentSettings.slidesToShow;
    }

    const lastPossibleStartingIndex = Math.max(
      0,
      slideCount - effectiveSlidesToShow
    );
    return currentSlide >= lastPossibleStartingIndex;
  }, [currentSlide, slideCount]);

  const isPrevArrowDisabled = currentSlide === 0;

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // Use custom arrows
    autoplay: false,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // if (isLoading) return <Spinner />;

  if (error) {
    return (
      <section className="py-16 text-center bg-gray-50">
        {" "}
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Error Loading Course Previews
            </h2>
            <p className="mb-4">
              Failed to load course preview videos. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Handle case where no courses are returned
  if (courses.length === 0) {
    return (
      <section className="py-16 text-center bg-gray-50">
        {" "}
        {/* Keep neutral background */}
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore our Courses
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-8">
            Watch these short introductory videos to get a taste of our
            expert-led training programs.
          </p>
          <div className="p-6 rounded-lg bg-white shadow-md">
            <p className="text-foreground/80">
              No course previews available at the moment.
            </p>
            <Link
              to="/courses"
              className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300 font-medium"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      {" "}
      {/* Keeping a light neutral background */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Using primary color with low opacity background */}
          <span className="inline-block px-6 py-2 bg-primary/10 text-foreground rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Course Previews
          </span>
          {/* Using primary color for the main heading */}
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore our Courses
          </h2>
          {/* Using foreground color with opacity for paragraph text */}
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Watch these short introductory videos to get a taste of our
            expert-led training programs.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            // Styling for the arrow button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none
                       ${
                         isPrevArrowDisabled
                           ? "cursor-not-allowed opacity-50"
                           : ""
                       }`}
            aria-label="Previous slide"
            disabled={isPrevArrowDisabled}
          >
            {/* Color of the arrow icon based on disabled state */}
            <ChevronLeft
              className={`h-6 w-6 ${
                isPrevArrowDisabled ? "text-gray-400" : "text-primary"
              }`}
            />
          </button>

          {/* Slider content area */}
          {/* Added mx-6 to prevent arrows from overlapping content */}
          <div className="mx-6">
            {/* Render the Slider only if courses exist */}
            {courses.length > 0 && (
              <Slider ref={sliderRef} {...sliderSettings}>
                {courses.map((course, index) => (
                  <div key={`course-${course.id}`} className="px-3 h-full">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group min-h-[400px] flex flex-col">
                      <div className="relative h-48">
                        <img
                          src={`${baseUrl}${course.course_image}`}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Play
                                className={`h-8 w-8 ${
                                  activeVideoId === course.id
                                    ? "text-primary"
                                    : "text-white"
                                }`}
                              />
                              <span className="text-white font-medium">
                                Preview
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-gray-400 line-through">
                                £1,500
                              </span>
                              <span className="text-white font-bold">£500</span>
                              <span className="text-green-400 text-sm">
                                Save £1,000!
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 h-14">
                          {course.name}
                        </h3>
                        <p className="text-foreground/80 text-sm mb-4 line-clamp-2 flex-grow">
                          {course.preview_description}
                        </p>

                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-foreground font-bold">
                            £{course.price}
                          </span>
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-sm text-primary hover:text-primary/80 font-medium"
                          >
                            View Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -mr-4 transition-all duration-200 ease-in-out focus:outline-none
                       ${
                         isNextArrowDisabled
                           ? "cursor-not-allowed opacity-50"
                           : ""
                       }`}
            aria-label="Next slide"
            disabled={isNextArrowDisabled}
          >
            <ChevronRight
              className={`h-6 w-6 ${
                isNextArrowDisabled ? "text-gray-400" : "text-primary"
              }`}
            />
          </button>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300 font-medium"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
