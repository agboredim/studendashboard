import React, { useState } from "react";
import img from "../assets/img.png";
import liveimg from "../assets/live.png";
import {
  Home,
  Book,
  HelpCircle,
  PlayCircle,
  User,
  Award,
  MessageCircle, // Use this icon instead of FaRegCommentDots
  Bell,
} from "lucide-react";

const Portal = () => {
  const totalQuestions = 30;
  const answeredQuestions = 24;
  const scorePercent = 85;

  const [navOpen, setNavOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("Dashboard");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const menuItems = [
    { icon: <Home />, label: "Dashboard" },
    { icon: <Book />, label: "Course Library" },
    { icon: <HelpCircle />, label: "My Progress" },
    { icon: <PlayCircle />, label: "Assessments" },
    { icon: <User />, label: "Discussion" },
    { icon: <Award />, label: "Certificate" }, // Fixed the Certificate icon
    { icon: <Bell />, label: "Notification" },
  ];

  const courses = [
    { title: "Cyber Security", subtitle: "Resume course", progress: 30 },
  ];

  const notifications = [
    {
      id: 1,
      title: "Live Class Starting Soon",
      message: "Your Physics class will begin in 10 minutes. Get ready!",
      time: "2 mins ago",
    },
    {
      id: 2,
      title: "Assignment Reminder",
      message:
        "Don’t forget to submit your Chemistry assignment by 5 PM today.",
      time: "1 hour ago",
    },
  ];

  const modules = [
    {
      title: "Introduction",
      pdfTitle:
        "Introduction guide - Key Concepts, Threat Types and Frameworks",
      pdfLink: "#",
      videoTitle: "What is Cybersecurity?",
    },
    {
      title: "Network Security Fundamentals",
      pdfTitle: "Network Security Guide - Protocols, Tools, and Common Attacks",
      pdfLink: "#",
      videoTitle: "Network Defense Basics",
    },
    {
      title: "Cryptography Basics",
      pdfTitle:
        "Crypto Primer - Symmetric vs Asymmetric, TLS/SSL, Hash Functions",
      pdfLink: "#",
      videoTitle: "Encryption and secure Communication",
    },
    {
      title: "Web and Application Security",
      pdfTitle: "Appsec Toolkit - OWASP Top 10, Secure Coding Practices",
      pdfLink: "#",
      videoTitle: "Securing Websites and Apps",
    },
  ];

  const currentCourses = [
    { title: "Course Progress", progress: 65 },
    { title: "Assignment Progress", progress: 45 },
    { title: "Discussion Participation", progress: 80 },
  ];

  const completedCourses = [{ title: "Compliance Training" }];

  const CourseModulesView = () => (
    <div className="p-6 max-w-7xl mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-6">{selectedCourse?.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {modules.map((module, index) => (
          <div key={index} className="shadow-lg p-6 bg-white space-y-3">
            <h3 className="text-xl font-semibold">{module.title}</h3>
            <p>
              <strong>PDF:</strong>{" "}
              <a href={module.pdfLink} className="text-blue-600 underline">
                {module.pdfTitle}
              </a>
            </p>
            <p className="font-semibold">Video</p>
            <div className="aspect-video bg-gradient-to-r from-gray-700 to-black flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <p className="mb-2">{module.videoTitle}</p>
                <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-xl">
                  ▶
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CourseProgressView = () => (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Product Management Course
      </h2>
      <div className="space-y-4">
        <ProgressBar label="Course Progress" value={65} color="bg-blue-500" />
        <ProgressBar
          label="Assignment Progress"
          value={45}
          color="bg-yellow-400"
        />
        <ProgressBar
          label="Discussion Participation"
          value={80}
          color="bg-teal-500"
        />
      </div>

      <div className="mt-10 space-y-4">
        {completedCourses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-md flex justify-between items-center"
          >
            <h3 className="font-semibold text-lg text-gray-800">
              {course.title}
            </h3>
            <button className="px-4 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const AssessmentView = () => (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Assessment</h2>

      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-semibold text-gray-800">Questions</span>
        <span className="text-lg font-bold text-gray-900">
          {totalQuestions}
        </span>
      </div>
      <hr className="border-gray-400 mb-6" />

      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-semibold text-gray-800">Answered</span>
        <span className="text-lg font-bold text-gray-900">
          {answeredQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-yellow-400 h-4 rounded-full"
          style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-semibold text-gray-800">Score</span>
        <span className="text-lg font-bold text-gray-900">{scorePercent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{ width: `${scorePercent}%` }}
        ></div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, value, color }) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
          <span>{label}</span>
          <span>{value} %</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ease-in-out ${color}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const NotificationView = () => (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className="border-l-4 border-blue-600 pl-4 bg-gray-50 p-4 rounded"
          >
            <h3 className="text-lg font-semibold">{notif.title}</h3>
            <p className="text-sm text-gray-700">{notif.message}</p>
            <span className="text-xs text-gray-500">{notif.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section>
      <div className="w-[100%] h-auto rounded-md">
        <nav className="bg-blue-950 w-full h-[10vh] rounded-t-md text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          <h3 className="text-white font-semibold text-lg sm:text-xl w-auto sm:w-[250px] py-2 px-4">
            STUDENT PORTAL
          </h3>

          <button
            className="block lg:hidden text-3xl focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
          >
            ☰
          </button>

          <ul
            className={`${
              navOpen ? "flex" : "hidden"
            } lg:flex list-none lg:static absolute top-[10vh] left-0 w-full lg:w-auto lg:bg-transparent bg-blue-700 z-50 flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 p-4 lg:p-0 font-medium`}
          >
            <li className="cursor-pointer hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300">My Courses</li>
            <li className="cursor-pointer hover:text-gray-300">Certificate</li>
            <li className="cursor-pointer hover:text-gray-300">Support</li>

            <li className="lg:hidden w-full mt-2">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-900 hover:from-blue-700 hover:to-blue-900 text-white font-semibold text-sm px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <img src={liveimg} alt="Live Icon" className="w-4 h-4" />
                JOIN LIVE CLASS
              </button>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-900 hover:from-blue-700 hover:to-blue-900 text-white font-semibold text-sm px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <img src={liveimg} alt="Live Icon" className="w-4 h-4" />
              JOIN LIVE CLASS
            </button>
            <img
              className="w-10 h-10 rounded-full bg-gray-300"
              src={img}
              alt="Profile"
            />
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-[250px] h-[165vh] bg-blue-950 p-5 shadow-md mb-12 flex-shrink-0 hidden lg:flex flex-col">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 mb-3 rounded-lg cursor-pointer transition ${
                  selectedView === item.label
                    ? "bg-indigo-200 text-blue-900"
                    : "hover:bg-indigo-100 hover:translate-x-1"
                }`}
                onClick={() => setSelectedView(item.label)}
              >
                <span className="text-white text-lg">{item.icon}</span>
                <h5 className="text-white font-medium text-base">
                  {item.label}
                </h5>
              </div>
            ))}
          </div>

          <div className="flex lg:hidden overflow-x-auto bg-blue-950 py-3 px-4 space-x-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center min-w-[70px] text-white ${
                  selectedView === item.label
                    ? "text-blue-300 font-semibold"
                    : ""
                }`}
                onClick={() => setSelectedView(item.label)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[75%] h-auto bg-transparent pt-8 px-4 sm:px-6 md:px-8">
            {selectedView === "Dashboard" && (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Welcome Back Joseph
                </h2>
                <p className="text-base sm:text-lg mb-6">
                  Continue your learning journey with one of your current
                  Courses.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.map((course, index) => (
                    <div
                      key={index}
                      className="bg-[#f1f6ff] p-5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        setSelectedCourse(course);
                        setSelectedView("Course Modules");
                      }}
                    >
                      <h4 className="text-md font-semibold text-[#1d3557] mb-1">
                        {course.title}
                      </h4>
                      <p className="text-sm text-[#555] mb-3">
                        {course.subtitle}
                      </p>
                      <div className="relative w-full h-2 bg-gray-300 rounded-full mb-2">
                        <div
                          className="absolute top-0 left-0 h-2 bg-blue-950 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-[#333] mb-3">
                        {course.progress}%
                      </div>
                      <button className="w-full bg-blue-950 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
                        Resume Course
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedView === "Dashboard" && (
              <div className="mx-auto max-w-screen-xl px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Upcoming Deadlines
                    </h3>
                    <div className="space-y-4 text-sm">
                      {[
                        { day: 25, title: "Project Plan Submission" },
                        { day: 28, title: "Case Study Analysis" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="text-center w-10">
                            <p className="text-xs text-gray-500">Apr</p>
                            <p className="text-xl font-bold text-black">
                              {item.day}
                            </p>
                          </div>
                          <div>
                            <p className="text-md font-medium text-black whitespace-pre-line">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Progress Overview
                    </h3>
                    <div className="flex items-center">
                      <div className="relative w-24 h-24 mr-6">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#001F3F"
                            strokeWidth="4"
                            strokeDasharray="60, 100"
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                          <text
                            x="18"
                            y="21"
                            textAnchor="middle"
                            className="fill-black text-[10px] font-bold"
                          >
                            60%
                          </text>
                        </svg>
                      </div>
                      <div className="text-sm text-black space-y-1">
                        <p>Enrolled</p>
                        <p>
                          <span className="font-bold">60%</span> Completion
                        </p>
                        <p>
                          <span className="font-bold">2</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                  {[
                    { title: "Upcoming Deadlines" },
                    { title: "Achievements & Certificates" },
                  ].map((section, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-bold mb-4">
                        {section.title}
                      </h3>
                      <div className="flex items-center gap-2 text-black text-md">
                        <span className="bg-gray-200 p-2 rounded-md">
                          <MessageCircle className="text-lg" />{" "}
                          {/* Updated icon */}
                        </span>
                        <p className="font-medium">Certificate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedView === "Course Modules" && selectedCourse && (
              <CourseModulesView />
            )}
            {selectedView === "My Progress" && <CourseProgressView />}
            {selectedView === "Assessments" && <AssessmentView />}
            {selectedView === "Notification" && <NotificationView />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portal;
