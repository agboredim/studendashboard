"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  BarChart,
  CheckCircle,
  Award,
  Users,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { coursesData } from "../data/coursesData";
import { Button } from "@/components/ui/button";

function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      const foundCourse = coursesData.find(
        (c) => c.id === Number.parseInt(courseId)
      );
      setCourse(foundCourse);

      // Find related courses (same category, different ID)
      if (foundCourse) {
        const related = coursesData
          .filter(
            (c) =>
              c.category === foundCourse.category && c.id !== foundCourse.id
          )
          .slice(0, 3);
        setRelatedCourses(related);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [courseId]);

  const toggleModule = (moduleId) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-blue-950 text-xl">
          Loading course details...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Course Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/courses"
          className="px-6 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-900"
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-950">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link to="/courses" className="hover:text-blue-950">
          Courses
        </Link>{" "}
        &gt; <span className="text-blue-950">{course.title}</span>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-blue-950 mb-4">
              {course.title}
            </h1>

            <p className="text-gray-600 mb-6">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({course.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">{course.duration}</span>
              </div>

              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {course.modules} modules
                </span>
              </div>

              <div className="px-3 py-1 bg-blue-100 text-blue-950 rounded-full text-sm font-semibold">
                {course.level}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <img
                src={course.instructorImage || "/placeholder.svg"}
                alt={course.instructor}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">Instructor: {course.instructor}</p>
                <p className="text-sm text-gray-500">
                  {course.instructorTitle}
                </p>
              </div>
            </div>

            <div className="md:hidden mb-6">
              <div className="text-3xl font-bold text-blue-950 mb-2">
                ${course.price}
              </div>
              <Button className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-md text-lg">
                Enroll Now
              </Button>
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-50 p-6 md:p-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                  <Play className="h-8 w-8 text-blue-950 ml-1" />
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="text-3xl font-bold text-blue-950 mb-4">
                ${course.price}
              </div>
              <Button className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-md text-lg mb-4">
                Enroll Now
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-bold text-gray-700 mb-3">
                This course includes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.duration} of on-demand video</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.resources} downloadable resources</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access on mobile and desktop</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* About This Course */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">
              About This Course
            </h2>
            <div className="prose max-w-none">
              <p className="mb-4">{course.description}</p>

              <h3 className="text-xl font-bold text-blue-950 mt-6 mb-3">
                What You'll Learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-blue-950 mt-6 mb-3">
                Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-blue-950 mt-6 mb-3">
                Who This Course is For
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {course.targetAudience.map((audience, index) => (
                  <li key={index}>{audience}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">
              Course Curriculum
            </h2>
            <div className="space-y-4">
              {course.curriculum.map((module, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleModule(index)}
                  >
                    <div className="font-medium">
                      <span className="text-blue-950">Module {index + 1}:</span>{" "}
                      {module.title}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-3">
                        {module.lessons.length} lessons
                      </span>
                      {expandedModule === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {expandedModule === index && (
                    <div className="p-4 border-t border-gray-200">
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-center">
                            <Play className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{lesson.title}</span>
                            <span className="ml-auto text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">
              Your Instructor
            </h2>
            <div className="flex items-start">
              <img
                src={course.instructorImage || "/placeholder.svg"}
                alt={course.instructor}
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{course.instructor}</h3>
                <p className="text-gray-500 mb-3">{course.instructorTitle}</p>
                <div className="flex items-center mb-3">
                  <Award className="h-5 w-5 text-blue-950 mr-2" />
                  <span>{course.instructorCourses} courses</span>
                  <Users className="h-5 w-5 text-blue-950 ml-4 mr-2" />
                  <span>
                    {course.instructorStudents.toLocaleString()} students
                  </span>
                </div>
                <p className="text-gray-700">{course.instructorBio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-950 mb-4">
              Related Courses
            </h2>
            <div className="space-y-4">
              {relatedCourses.map((relatedCourse) => (
                <Link
                  key={relatedCourse.id}
                  to={`/courses/${relatedCourse.id}`}
                  className="block"
                >
                  <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={relatedCourse.image || "/placeholder.svg"}
                      alt={relatedCourse.title}
                      className="w-20 h-20 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h3 className="font-medium text-blue-950">
                        {relatedCourse.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(relatedCourse.rating)
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({relatedCourse.reviews})
                        </span>
                      </div>
                      <div className="text-sm font-bold text-blue-950 mt-1">
                        ${relatedCourse.price}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
