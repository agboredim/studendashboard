import { useState, useRef, useCallback } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInView } from "../hooks/useInView";
import { useGetAllCoursesQuery } from "@/services/coursesApi";
import AddToCartButton from "./AddToCartButton";
import { useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";

export function EventsCarousel() {
  const sliderRef = useRef(null);
  const [sectionRef] = useInView({ threshold: 0.3 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  // Events data from WorkshopEvents page
  const events = [
    {
      id: 1,
      title: "AML/KYC Compliance Workshop",
      date: "2025-06-15",
      time: "4:00 PM - 6:00 PM EST",
      location: "Virtual Event",
      description:
        "Master complex regulatory frameworks, implement robust risk assessment methodologies, and harness cutting-edge compliance technologies to protect your organization.",
      image: "/assets/illustrations/compliance-workshop.svg",
    },
    {
      id: 2,
      title: "Business Analysis/Project Management Workshop",
      date: "2025-06-15",
      time: "4:00 PM - 6:00 PM EST",
      location: "Virtual Event",
      description:
        "Develop critical skills in requirements gathering, process optimization, and stakeholder management to effectively bridge technical and business objectives.",
      image: "/assets/illustrations/data-masterclass.svg",
    },
    {
      id: 3,
      title: "Data Analytics Workshop",
      date: "2025-06-15",
      time: "4:00 PM - 6:00 PM EST",
      location: "Virtual Event",
      description:
        "Transform complex datasets into strategic insights using advanced analytical techniques and powerful visualization tools that drive informed business decisions.",
      image: "/assets/illustrations/career-growth.svg",
    },
    {
      id: 4,
      title: "Cybersecurity Workshop",
      date: "2025-06-15",
      time: "4:00 PM - 6:00 PM EST",
      location: "Virtual Event",
      description:
        "Build expertise in proactive threat detection, comprehensive vulnerability assessment, and implementation of enterprise-grade security protocols to safeguard critical assets.",
      image: "/assets/illustrations/cyber-security.svg",
    },
  ];

  // Mapping from event title to backend course name
  const eventToCourseName = {
    "AML/KYC Compliance Workshop": "AML/KYC Compliance",
    "Cybersecurity Workshop": "Cybersecurity",
    "Business Analysis/Project Management Workshop":
      "Business Analysis & Project Management",
    "Data Analytics Workshop": "Data Analysis",
  };

  const instructorMap = {
    "AML/KYC Compliance Workshop": "LUMI OTOLORIN",
    "Data Analytics Workshop": "TOBI OLADIPUPO",
    "Business Analysis/Project Management Workshop": "WUNMI NWOGU",
    "Cybersecurity Workshop": "DR. JAMES BROWN",
  };

  const { data: allCourses = [] } = useGetAllCoursesQuery();

  // For each event, find the matching course
  const eventsWithCourse = events.map((event) => {
    const backendName = eventToCourseName[event.title];
    const matchedCourse = allCourses.find(
      (course) =>
        course.name.trim().toLowerCase() === backendName.trim().toLowerCase()
    );
    return { ...event, course: matchedCourse };
  });

  const handleBeforeChange = useCallback(() => {
    // Additional logic before slide change if needed
  }, []);

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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
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

  const isPrevArrowDisabled = currentSlide === 0;
  const isNextArrowDisabled =
    currentSlide >= events.length - sliderSettings.slidesToShow;

  return (
    <section ref={sectionRef} className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-primary/10 text-foreground rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Upcoming Events
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Join Our Events
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
            Participate in our workshops, seminars, and masterclasses to enhance
            your skills and network with industry professionals.
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
            <Slider ref={sliderRef} {...sliderSettings}>
              {eventsWithCourse.map((event) => {
                // Check if user is enrolled in this event's course
                const isEnrolled =
                  isAuthenticated &&
                  event.course &&
                  user?.course?.some(
                    (enrolledCourse) =>
                      String(enrolledCourse?.id ?? enrolledCourse) ===
                      String(event.course.id)
                  );
                return (
                  <div key={event.id} className="px-3 h-full">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full">
                      <div className="relative h-48 bg-gray-50">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {event.course ? (
                            isEnrolled ? (
                              <div className="text-center w-full px-4">
                                <div className="bg-green-100 border border-green-400 text-green-700 p-2 rounded-lg mb-2 text-xs flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 inline mr-1" />
                                  Already enrolled
                                </div>
                                <Button
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2"
                                  onClick={() => navigate("/portal")}
                                >
                                  Go to Dashboard &rarr;
                                </Button>
                              </div>
                            ) : (
                              <AddToCartButton course={event.course} />
                            )
                          ) : (
                            <AddToCartButton disabled />
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg h-14 font-bold text-foreground mb-3">
                          {event.title}
                        </h3>
                        <p className="text-foreground/70 text-base mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-primary">
                            INSTRUCTOR:{" "}
                          </span>
                          <span className="text-xs text-foreground font-bold">
                            {instructorMap[event.title]}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-foreground/70">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(event.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-foreground/70">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-xs text-foreground/70">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
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
            to="/events"
            className="inline-block px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors duration-300 font-medium"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
