import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, BarChart, Filter } from "lucide-react";
import { coursesData } from "../data/coursesData";
import axios from "axios";
import { toast } from "react-toastify";

function CoursesPage({ url }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    const response = await axios.get(`${url}/courses/courses/`);
    if (response.data.success) {
      setFilter(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const filteredCourses = coursesData.filter((course) => {
    const matchesFilter =
      filter === "all" || course.level.toLowerCase() === filter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-950 mb-4">
          Titans Training Courses
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Enhance your KYC & AML compliance skills with our industry-leading
          courses designed by experts with decades of experience.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-gray-700">Filter by:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-blue-950 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
                  {course.level}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-950 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">
                      {course.modules} modules
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <img
                    src={course.instructorImage || "/placeholder.svg"}
                    alt={course.instructor}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span className="text-sm text-gray-700">
                    {course.instructor}
                  </span>
                </div>

                <div className="flex items-center mb-4">
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

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-blue-950">
                    ${course.price}
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-4 py-2 bg-blue-950 text-white rounded-md hover:bg-blue-900 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600">
              No courses found matching your criteria. Please try a different
              search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
