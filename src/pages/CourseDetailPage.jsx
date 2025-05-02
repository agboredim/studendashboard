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
import {
  useGetCourseByIdQuery,
  useGetAllCoursesQuery,
} from "../services/coursesApi";
import { Button } from "@/components/ui/button";
import Spinner from "../components/Spinner";
import AddToCartButton from "../components/AddToCartButton";
import WistiaVideo from "../components/WistiaVideo"; // Ensure this is the correct path to the WistiaVideo component

const baseUrl = import.meta.env.VITE_BASE_URL;

function CourseDetailPage() {
  const { courseId } = useParams();
  // const [expandedModule, setExpandedModule] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  // const [videoStarted, setVideoStarted] = useState(false);

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(courseId);

  const { data: allCourses = [], isLoading: isAllCoursesLoading } =
    useGetAllCoursesQuery();

  useEffect(() => {
    if (course && allCourses.length > 0) {
      const related = allCourses
        .filter((c) => c.category === course.category && c.id !== course.id)
        .slice(0, 3);
      setRelatedCourses(related);
    }
  }, [course, allCourses]);

  // const toggleModule = (moduleId) => {
  //   if (expandedModule === moduleId) {
  //     setExpandedModule(null);
  //   } else {
  //     setExpandedModule(moduleId);
  //   }
  // };

  if (isCourseLoading || isAllCoursesLoading) {
    return <Spinner />;
  }

  if (courseError || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {courseError ? "Error Loading Course" : "Course Not Found"}
        </h2>
        <p className="text-gray-600 mb-6">
          {courseError
            ? courseError.status === "FETCH_ERROR"
              ? "Network error. Please check your connection."
              : courseError.data?.message || "Failed to load course details."
            : "The course you're looking for doesn't exist or has been removed."}
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
        &gt; <span className="text-blue-950">{course.name}</span>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-blue-950 mb-4">
              {course.name}
            </h1>

            <p className="text-gray-600 mb-6">{course.preview_description}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* <div className="flex items-center">
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
              </div> */}

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {course?.estimated_time}
                </span>
              </div>

              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {course?.curriculum?.length} modules
                </span>
              </div>

              <div className="px-3 py-1 bg-blue-100 text-blue-950 rounded-full text-sm font-semibold">
                {course.level}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <img
                src={`${baseUrl}${course.instructor.profile_picture}`}
                alt={course?.instructor?.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">
                  Instructor: {course?.instructor?.first_name}{" "}
                  {course?.instructor?.last_name}
                </p>
                <p className="text-sm text-gray-500">
                  {course?.instructor?.title}
                </p>
              </div>
            </div>

            <div className="md:hidden mb-6">
              <div className="text-3xl font-bold text-blue-950 mb-2">
                £{course.price}
              </div>
              <Button className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white rounded-md text-lg">
                Enroll Now
              </Button>
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-50 p-6 md:p-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <div className="mx-auto max-w-4xl">
                <WistiaVideo videoId={`${course.preview_id}`} />
              </div>
            </div>

            <div className="hidden md:block">
              <div className="text-3xl font-bold text-blue-950 mb-4">
                £{course.price}
              </div>
              <AddToCartButton course={course} />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-bold text-gray-700 mb-3">
                This course includes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.estimated_time} of on-demand video</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.resources} downloadable resources</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Full lifetime access</span>
                </li>
                {/* <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access on mobile and desktop</span>
                </li> */}
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
                {Object.entries(course.learning_outcomes).map(
                  ([key, value]) => (
                    <li key={key} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  )
                )}
              </ul>

              {course?.required_materials &&
                Object.keys(course.required_materials).length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-blue-950 mt-6 mb-3">
                      Requirements
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(course.required_materials).map(
                        ([key, value]) => (
                          <li key={key}>{value}</li>
                        )
                      )}
                    </ul>
                  </>
                )}

              {course?.target_audience &&
                Object.keys(course.target_audience).length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-blue-950 mt-6 mb-3">
                      Who This Course is For
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(course.target_audience).map(
                        ([key, value]) => (
                          <li key={key}>{value}</li>
                        )
                      )}
                    </ul>
                  </>
                )}
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-4">
              Course Curriculum
            </h2>
            <div className="space-y-4">
              {course?.curriculum?.map((module, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* onClick={() => toggleModule(index)} */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                    <div className="font-medium">
                      <span className="text-blue-950">Module {index + 1}:</span>{" "}
                      {module?.title}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-3">
                        {module?.lessons?.length} lessons
                      </span>
                      {/* {expandedModule === index ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )} */}
                    </div>
                  </div>

                  {/* {expandedModule === index && (
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
                  )} */}
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
                src={`${baseUrl}${course.instructor.profile_picture}`}
                alt={course?.instructor?.first_name}
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">
                  {course?.instructor?.first_name}{" "}
                  {course?.instructor?.last_name}
                </h3>
                <p className="text-gray-500 mb-3">
                  {course?.instructor?.title}
                </p>
                <div className="flex items-center mb-3">
                  <Award className="h-5 w-5 text-blue-950 mr-2" />
                  <span>{course?.instructor?.courses_taken} courses</span>
                  <Users className="h-5 w-5 text-blue-950 ml-4 mr-2" />
                  <span>
                    {course?.instructor?.students?.toLocaleString()} students
                  </span>
                </div>
                <p className="text-gray-700">{course?.instructor?.bio}</p>
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
              {relatedCourses.length > 0 ? (
                relatedCourses.map((relatedCourse) => (
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
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No related courses found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;
