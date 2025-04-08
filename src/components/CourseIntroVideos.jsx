"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import { coursesData } from "../data/coursesData";

export function CourseIntroVideos() {
  const [activeVideo, setActiveVideo] = useState(null);

  // Function to handle video click and open modal
  const openVideoModal = (courseId) => {
    setActiveVideo(courseId);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setActiveVideo(null);
    // Restore body scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-6 py-2 bg-blue-100 text-blue-950 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Course Previews
          </span>
          <h2 className="text-4xl font-bold text-blue-950 mb-4">
            Explore Our Compliance Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Watch these short introductory videos to get a taste of our
            expert-led KYC & AML compliance training programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              {/* Video Thumbnail */}
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => openVideoModal(course.id)}
              >
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={`${course.title} preview`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white bg-opacity-80 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 text-blue-950 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <span className="text-white text-sm font-medium">
                    {course.duration} preview
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-blue-950 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-blue-950 font-bold">
                    ${course.price}
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
          ))}
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

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Using the Wistia iframe for the video */}
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={coursesData.find((c) => c.id === activeVideo)?.videoUrl}
                title={`${
                  coursesData.find((c) => c.id === activeVideo)?.title
                } Preview`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 bg-white">
              <h3 className="text-xl font-bold text-blue-950 mb-2">
                {coursesData.find((c) => c.id === activeVideo)?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {
                  coursesData.find((c) => c.id === activeVideo)
                    ?.shortDescription
                }
              </p>
              <Link
                to={`/courses/${activeVideo}`}
                className="inline-block px-6 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors duration-300"
                onClick={closeVideoModal}
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
