import { useState, useRef, useEffect, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
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
  useEffect(() => {
    if (isInView && !hasInitializedRef.current && courses.length > 0) {
      const timer = setTimeout(() => {
        setActiveVideoId(courses[0].id);
        hasInitializedRef.current = true;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInView, courses]);

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

  // Initialize slide count after slider is mounted
  useEffect(() => {
    if (sliderRef.current && courses.length > 0) {
      setSlideCount(courses.length);
    }
  }, [courses]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
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

  if (isLoading) return <Spinner />;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-blue-100 text-blue-950 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Course Previews
          </span>
          <h2 className="text-4xl font-bold text-blue-950 mb-4">
            Explore our Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Watch these short introductory videos to get a taste of our
            expert-led training programs.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md -ml-4 transition-all duration-200 ease-in-out focus:outline-none"
            aria-label="Previous slide"
            disabled={currentSlide === 0}
          >
            <ChevronLeft
              className={`h-6 w-6 ${
                currentSlide === 0 ? "text-gray-400" : "text-blue-950"
              }`}
            />
          </button>

          <div className="mx-6">
            <Slider ref={sliderRef} {...sliderSettings}>
              {courses.map((course, index) => (
                <div key={`course-${course.id}`} className="px-3 h-full">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                    {/* Video Container */}
                    <div className="relative h-52 overflow-hidden">
                      {activeVideoId === course.id ? (
                        // Key is important to force remount when active video changes
                        <iframe
                          key={`video-${course.id}-active-${index}`}
                          className="w-full h-full"
                          src={`https://fast.wistia.net/embed/iframe/${course.preview_id}?time=0&autoPlay=true`}
                          title={`${course.name} Preview`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          {/* Thumbnail with frame at 2 seconds */}
                          <img
                            src={`${baseUrl}${course.course_image}`}
                            alt={`${course.name} preview`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div
                            className="absolute inset-0 bg-opacit flex items-center justify-center cursor-pointer"
                            onClick={() => toggleVideo(course.id)}
                          >
                            <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                              <Play className="h-6 w-6 text-blue-950 ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <span className="text-white text-sm font-medium">
                          {course.estimated_time} preview
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-blue-950 mb-2 line-clamp-2 h-14">
                        {course.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {course.preview_description}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-blue-950 font-bold">
                          £{course.price}
                        </span>
                        <Link
                          to={`/courses/${course.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Course
                        </Link>
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
            disabled={currentSlide >= slideCount - sliderSettings.slidesToShow}
          >
            <ChevronRight
              className={`h-6 w-6 ${
                currentSlide === slideCount - sliderSettings.slidesToShow
                  ? "text-gray-400"
                  : "text-blue-950"
              }`}
            />
          </button>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="inline-block px-8 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors duration-300 font-medium"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
