// components/CourseLibrary.js
import { useState } from "react";

const CourseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Dummy data
  const courses = [
    {
      id: 1,
      title: "Introduction to Python Programming",
      category: "programming",
      instructor: "Dr. Amelia Chen",
      duration: "6 weeks",
      difficulty: "beginner",
      enrolled: 1245,
      status: "open",
      statusText: "Open enrollment",
    },
    {
      id: 2,
      title: "Graphic Design Fundamentals",
      category: "design",
      instructor: "Prof. Marcus Wright",
      duration: "4 weeks",
      difficulty: "intermediate",
      enrolled: 892,
      status: "closing",
      statusText: "Closing soon (3 days left)",
    },
    // Add more courses as needed
  ];

  // Status color mapping
  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    closing: "bg-yellow-100 text-yellow-800",
    upcoming: "bg-red-100 text-red-800",
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="🔍 Search courses..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-wrap gap-4">
          <select
            className="p-2 border rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>

          <select
            className="p-2 border rounded-lg"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <div className="space-y-2 text-gray-600">
              <p>Category: {course.category}</p>
              <p>Instructor: {course.instructor}</p>
              <p>Duration: {course.duration}</p>
              <p>Enrolled: {course.enrolled.toLocaleString()} students</p>
            </div>

            <div
              className={`mt-4 px-3 py-1 rounded-full text-sm inline-block ${
                statusColors[course.status]
              }`}
            >
              {course.statusText}
            </div>

            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
              {course.status === "open" ? "Enroll Now" : "Notify Me"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseLibrary;
