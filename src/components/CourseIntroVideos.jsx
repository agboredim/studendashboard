import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "../hooks/useInView";
import { useGetAllCoursesQuery } from "@/services/coursesApi";
import AwsVideoPlayer from "./AwsVideoPlayer";
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
  const { data: courses = [], error } = useGetAllCoursesQuery();

  // Handle autoplay of first video when section comes into view
  useEffect(() => {
    if (
      isInView &&
      !hasInitializedRef.current &&
      courses.length > 0 &&
      activeVideoId === null
    ) {
      const timer = setTimeout(() => {
        // Auto-play first video if it has a preview_id
        if (courses[0].preview_id) {
          setActiveVideoId(courses[0].id);
        }
        hasInitializedRef.current = true;
      }, 500); // Slightly longer delay for smooth auto-play

      return () => clearTimeout(timer);
    }
  }, [isInView, courses, activeVideoId]);

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

  // Handle video play/pause
  const handleVideoToggle = useCallback(
    (courseId) => {
      if (activeVideoId === courseId) {
        // If this video is playing, stop it
        setActiveVideoId(null);
      } else {
        // Play this video (stop any other playing video)
        setActiveVideoId(courseId);
      }
    },
    [activeVideoId]
  );

  // Initialize slide count after courses are loaded and slider is mounted
  useEffect(() => {
    if (sliderRef.current && courses.length > 0) {
      setSlideCount(courses.length);
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

  if (error) {
    return (
      <section className="py-16 text-center bg-gray-50">
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-primary/10 text-foreground rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Course Previews
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Explore our Courses
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Watch these short introductory videos to get a taste of our
            expert-led training programs.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none
                       ${
                         isPrevArrowDisabled
                           ? "cursor-not-allowed opacity-50"
                           : ""
                       }`}
            aria-label="Previous slide"
            disabled={isPrevArrowDisabled}
          >
            <ChevronLeft
              className={`h-6 w-6 ${
                isPrevArrowDisabled ? "text-gray-400" : "text-primary"
              }`}
            />
          </button>

          {/* Slider content area */}
          <div className="mx-6">
            {courses.length > 0 && (
              <Slider ref={sliderRef} {...sliderSettings}>
                {courses.map((course) => (
                  <div key={`course-${course.id}`} className="px-3 mb-4 h-full">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group flex flex-col">
                      {/* Video/Image Section */}
                      <div className="relative h-48">
                        {activeVideoId === course.id && course.preview_id ? (
                          // Show video player when active
                          <AwsVideoPlayer
                            videoUrl={course.preview_id}
                            title={`${course.name} Preview`}
                            className="h-48 w-full"
                            autoPlay={true} // Auto-play when video becomes active
                          />
                        ) : (
                          // Show image with play overlay when not active
                          <>
                            <img
                              src={
                                course.course_image?.startsWith("http")
                                  ? course.course_image
                                  : `${baseUrl}${course.course_image}`
                              }
                              alt={course.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                              }}
                            />

                            {/* Play/Pause Overlay - only show if video exists */}
                            {course.preview_id && (
                              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                  onClick={() => handleVideoToggle(course.id)}
                                  className="bg-white bg-opacity-90 text-primary p-4 rounded-full hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
                                  aria-label={
                                    activeVideoId === course.id
                                      ? "Pause video"
                                      : "Play video"
                                  }
                                >
                                  {activeVideoId === course.id ? (
                                    <Pause className="h-8 w-8" />
                                  ) : (
                                    <Play className="h-8 w-8 ml-1" />
                                  )}
                                </button>
                              </div>
                            )}

                            {/* No Video Available Overlay */}
                            {!course.preview_id && (
                              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-center text-white">
                                  <div className="text-sm opacity-75">
                                    No preview available
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Course Info Section */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-base h-14 font-bold text-foreground mb-2 line-clamp-2">
                          {course.name}
                        </h3>
                        <p className="text-foreground/80 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                          {course.preview_description || course.description}
                        </p>

                        {/* Course Level */}
                        {course.level && (
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {course.level}
                            </span>
                          </div>
                        )}

                        {/* Pricing and Actions */}
                        <div className="mt-auto space-y-3">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-red-500 line-through text-sm">
                                £1,500
                              </span>
                              <span className="text-green-600 text-xs font-medium">
                                Save £1,000!
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-primary">
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
