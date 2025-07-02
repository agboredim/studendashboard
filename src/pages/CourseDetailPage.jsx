import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import Spinner from "../components/Spinner";
import AddToCartButton from "../components/AddToCartButton";
import AwsVideoPlayer from "../components/AwsVideoPlayer";

const baseUrl = import.meta.env.VITE_BASE_URL;

function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // const [expandedModule, setExpandedModule] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  // const [videoStarted, setVideoStarted] = useState(false);

  // Auth state
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseByIdQuery(courseId);

  const { data: allCourses = [], isLoading: isAllCoursesLoading } =
    useGetAllCoursesQuery();

  // Check if user is enrolled in this course
  const isEnrolled =
    isAuthenticated &&
    user?.course?.some(
      (enrolledCourse) =>
        String(enrolledCourse?.id ?? enrolledCourse) === String(courseId)
    );

  useEffect(() => {
    if (course && allCourses.length > 0) {
      const related = allCourses
        .filter((c) => c.category === course.category && c.id !== course.id)
        .slice(0, 3);
      setRelatedCourses(related);
    }
  }, [course, allCourses]);

  // const toggleModule = (moduleId) => {
  //     if (expandedModule === moduleId) {
  //       setExpandedModule(null);
  //     } else {
  //       setExpandedModule(moduleId);
  //     }
  // };

  if (isCourseLoading || isAllCoursesLoading) {
    return <Spinner />;
  }

  if (courseError || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        {/* Kept error styling distinct but simple */}
        <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            {courseError ? "Error Loading Course" : "Course Not Found"}
          </h2>
          <p className="mb-6">
            {courseError
              ? courseError.status === "FETCH_ERROR"
                ? "Network error. Please check your connection."
                : courseError.data?.message || "Failed to load course details."
              : "The course you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/courses"
            // Using primary color for the button
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-foreground/70 mb-6">
        {/* Using primary color for breadcrumb links on hover */}
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link to="/courses" className="hover:text-primary">
          Courses
        </Link>{" "}
        {/* Using primary color for the current page name */}
        &gt; <span className="text-primary">{course.name}</span>
      </div>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-2/3 p-6 md:p-8">
            {/* Using primary color for main heading */}
            <h1 className="text-3xl font-bold text-primary mb-4">
              {course.name}
            </h1>

            {/* Using foreground color for description */}
            <p className="text-foreground/80 mb-6">
              {course.preview_description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                {/* Using a foreground-like color for icons and text */}
                <Clock className="h-4 w-4 text-foreground/60 mr-1" />
                <span className="text-sm text-foreground/70">
                  {course?.estimated_time}
                </span>
              </div>

              <div className="flex items-center">
                {/* Using a foreground-like color for icons and text */}
                <BarChart className="h-4 w-4 text-foreground/60 mr-1" />
                <span className="text-sm text-foreground/70">
                  {course?.curriculum?.length} modules
                </span>
              </div>

              {/* Using primary color for level badge background and text */}
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                {course.level}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <img
                src={`${baseUrl}${course.instructor.profile_picture}`}
                alt={course?.instructor?.first_name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium text-foreground">
                  Instructor: {course?.instructor?.first_name}{" "}
                  {course?.instructor?.last_name}
                </p>
                <p className="text-sm text-foreground/70">
                  {course?.instructor?.title}
                </p>
                <div className="flex items-center mt-2">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  <span className="text-foreground">
                    {course?.instructor?.courses_taken} courses
                  </span>
                  <Users className="h-5 w-5 text-primary ml-4 mr-2" />
                  <span className="text-foreground">
                    {course?.instructor?.students?.toLocaleString()} students
                  </span>
                </div>
                {course?.instructor?.bio && (
                  <p className="text-foreground/80 mt-2">
                    {course?.instructor?.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="md:hidden mb-6">
              {/* Price Display for Mobile */}
              <div className="mb-4">
                <span className="text-red-500 line-through block">£1,500</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">£500</span>
                  <span className="text-green-600 font-semibold">
                    Save £1,000!
                  </span>
                </div>
              </div>
              {isEnrolled ? (
                <div className="text-center">
                  <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-4">
                    <CheckCircle className="h-5 w-5 inline mr-2" />
                    You're already enrolled in this course
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/portal")}
                  >
                    Continue Learning →
                  </Button>
                </div>
              ) : (
                <AddToCartButton course={course} />
              )}
            </div>
          </div>

          <div className="md:w-1/3 bg-gray-50 p-6 md:p-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <div className="mx-auto max-w-4xl">
                {course.preview_id ? (
                  <AwsVideoPlayer
                    videoUrl={course.preview_id}
                    title={`${course.name} Preview`}
                    className="h-48"
                  />
                ) : (
                  <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No preview available</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              {/* Price Display for Desktop */}
              <div className="mb-6">
                <span className="text-red-500 line-through block">£1,500</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">£500</span>
                  <span className="text-green-600 font-semibold">
                    Save £1,000!
                  </span>
                </div>
              </div>
              {isEnrolled ? (
                <div className="text-center">
                  <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg mb-4">
                    <CheckCircle className="h-5 w-5 inline mr-2" />
                    You're already enrolled in this course
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/portal")}
                  >
                    Continue Learning →
                  </Button>
                </div>
              ) : (
                <AddToCartButton course={course} />
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-bold text-foreground/90 mb-3">
                This course includes:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.estimated_time} of on-demand video</span>{" "}
                  {/* Using default text color, adjust if needed */}
                </li>
                <li className="flex items-start">
                  {/* Keeping green for success/inclusion icon */}
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{course.resources} downloadable resources</span>{" "}
                  {/* Using default text color, adjust if needed */}
                </li>
                <li className="flex items-start">
                  {/* Keeping green for success/inclusion icon */}
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>12 months access</span>{" "}
                  {/* Using default text color, adjust if needed */}
                </li>
                {/* <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access on mobile and desktop</span>
                  </li> */}
                <li className="flex items-start">
                  {/* Keeping green for success/inclusion icon */}
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Certificate of completion</span>{" "}
                  {/* Using default text color, adjust if needed */}
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
            {/* Using primary color for heading */}
            <h2 className="text-2xl font-bold text-primary mb-4">
              About This Course
            </h2>
            {/* Prose class uses default text colors, might need customization in tailwind.config.js prose plugin */}
            <div className="prose max-w-none">
              <p className="mb-4">{course.description}</p>

              {/* Using primary color for subheading */}
              <h3 className="text-xl font-bold text-primary mt-6 mb-3">
                What You'll Learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(course.learning_outcomes)
                  .filter(([, value]) => value && value !== "")
                  .map(([key, value]) => (
                    <li key={key} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
              </ul>

              {course?.required_materials &&
                Object.keys(course.required_materials).length > 0 && (
                  <>
                    {/* Using primary color for subheading */}
                    <h3 className="text-xl font-bold text-primary mt-6 mb-3">
                      Requirements
                    </h3>
                    {/* Using default text color for list items, adjust if needed */}
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(course.required_materials)
                        .filter(([, value]) => value && value !== "")
                        .map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                    </ul>
                  </>
                )}

              {course?.target_audience &&
                Object.keys(course.target_audience).length > 0 && (
                  <>
                    {/* Using primary color for subheading */}
                    <h3 className="text-xl font-bold text-primary mt-6 mb-3">
                      Who This Course is For
                    </h3>
                    {/* Using default text color for list items, adjust if needed */}
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(course.target_audience)
                        .filter(([, value]) => value && value !== "")
                        .map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                    </ul>
                  </>
                )}
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Using primary color for heading */}
            <h2 className="text-2xl font-bold text-primary mb-4">
              Course Curriculum
            </h2>
            <div className="space-y-4">
              {course?.curriculum?.map((module, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden" // Border color might need adjustment
                >
                  {/* onClick={() => toggleModule(index)} */}
                  {/* Background and text color using foreground/light shade */}
                  <div className="flex justify-between items-center p-4 bg-foreground/5 cursor-pointer">
                    <div className="font-medium">
                      {/* Using primary color for "Module X:" part */}
                      <span className="text-primary">
                        Module {index + 1}:
                      </span>{" "}
                      {/* Using foreground color for module title */}
                      <span className="text-foreground">{module?.title}</span>
                    </div>
                    <div className="flex items-center">
                      {/* Using a foreground-like color for lesson count text */}
                      <span className="text-sm text-foreground/70 mr-3">
                        {module?.lessons?.length} lessons
                      </span>
                      {/* {expandedModule === index ? (
                          <ChevronUp className="h-5 w-5 text-foreground/60" /> // Using foreground for icon
                        ) : (
                          <ChevronDown className="h-5 w-5 text-foreground/60" /> // Using foreground for icon
                        )} */}
                    </div>
                  </div>

                  {/* {expandedModule === index && (
                      <div className="p-4 border-t border-gray-200">
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center">
                              <Play className="h-4 w-4 text-foreground/50 mr-2" /> // Using subtle foreground for icon
                              <span className="text-foreground/90">{lesson.title}</span> // Using foreground for text
                              <span className="ml-auto text-sm text-foreground/70"> // Using foreground-like for duration
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
        </div>

        {/* Related Courses */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Using primary color for heading */}
            <h2 className="text-xl font-bold text-primary mb-4">
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
                    {/* Hover background using a light shade of foreground */}
                    <div className="flex items-start hover:bg-foreground/5 p-2 rounded-lg transition-colors">
                      <img
                        src={relatedCourse.image || "/placeholder.svg"}
                        alt={relatedCourse.title}
                        className="w-20 h-20 object-cover rounded-md mr-3"
                      />
                      <div>
                        {/* Using primary color for related course title */}
                        <h3 className="font-medium text-primary">
                          {relatedCourse.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  // Using secondary color for filled stars
                                  i < Math.floor(relatedCourse.rating)
                                    ? "text-secondary fill-current"
                                    : // Using subtle foreground for empty stars
                                      "text-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          {/* Using foreground-like color for review count */}
                          <span className="text-xs text-foreground/70 ml-1">
                            ({relatedCourse.reviews})
                          </span>
                        </div>
                        {/* Using primary color for related course price */}
                        <div className="text-sm font-bold text-primary mt-1">
                          ${relatedCourse.price}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-foreground/70 text-center py-4">
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
