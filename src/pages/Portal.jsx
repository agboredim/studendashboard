import React, { useState } from 'react';
import { FaHome, FaBook, FaQuestionCircle, FaPlayCircle, FaMale, FaCertificate, FaRegCommentDots } from 'react-icons/fa';

const Portal = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('Dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard' },
    { icon: <FaBook />, label: 'Course Library' },
    { icon: <FaQuestionCircle />, label: 'My Progress' },
    { icon: <FaPlayCircle />, label: 'Assessments' },
    { icon: <FaMale />, label: 'Discussion' },
    { icon: <FaCertificate />, label: 'Certificate' },
  ];

  const courses = [
    { title: "Business Analysis/Project Management", subtitle: "Resivcourse", progress: 30 },
    { title: "AML/KYC Compliance", subtitle: "On-demand", progress: 30 },
    { title: "Cyber Security", subtitle: "Resume course", progress: 30 },
    { title: "Data Analysis", subtitle: "Next module", progress: 29 }
  ];

  const modules = [
    {
      title: "Introduction",
      pdfTitle: "Introduction guide - Key Concepts, Threat Types and Frameworks",
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
      pdfTitle: "Crypto Primer - Symmetric vs Asymmetric, TLS/SSL, Hash Functions",
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
    { title: "Business Analysis", progress: 50 },
    { title: "AML/KYC Compliance", progress: 50 },
    { title: "Data Analysis", progress: 50 },
    { title: "Cyber Security", progress: 50 },
  ];

  const completedCourses = [
    { title: "Compliance Training" },
  ];

  const CourseModulesView = () => (
    <div className="p-6 max-w-7xl mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-6">{selectedCourse?.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {modules.map((module, index) => (
          <div key={index} className="shadow-lg p-6 bg-white space-y-3">
            <h3 className="text-xl font-semibold">{module.title}</h3>
            <p><strong>PDF:</strong> <a href={module.pdfLink} className="text-blue-600 underline">{module.pdfTitle}</a></p>
            <p className="font-semibold">Video</p>
            <div className="aspect-video bg-gradient-to-r from-gray-700 to-black flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <p className="mb-2">{module.videoTitle}</p>
                <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-xl">▶</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CourseProgressView = () => (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Current Courses</h2>
      <div className="space-y-6">
        {currentCourses.map((course, index) => (
          <div key={index}>
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Progress</p>
            <div className="relative h-3 bg-gray-300 rounded-full">
              <div className="absolute top-0 left-0 h-3 bg-blue-900 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <button className="mt-2 px-4 py-1 bg-blue-900 text-white text-sm rounded">Resume</button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Completed Courses</h2>
      <div className="space-y-4">
        {completedCourses.map((course, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <button className="px-4 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500">View</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full h-auto bg-white flex justify-center pt-2">
      <div className="w-[90%] h-auto rounded-md">
        {/* Nav */}
        <nav className="bg-blue-950 w-full h-[10vh] rounded-t-md text-white flex items-center justify-between px-8 pl-0 relative">
          <h3 className="bg-blue-950 text-center font-semibold rounded-tl-md py-5 px-8 text-white h-[10vh] w-[250px]">STUDENT PORTAL</h3>
          <ul className={`list-none flex gap-8 font-medium ${navOpen ? 'flex-col absolute top-[70px] left-0 right-0 bg-blue-700 p-4 z-[1000]' : 'hidden lg:flex'}`}>
            <li className="cursor-pointer hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300">My Courses</li>
            <li className="cursor-pointer hover:text-gray-300">Certificate</li>
            <li className="cursor-pointer hover:text-gray-300">Support</li>
          </ul>
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <button className="block lg:hidden text-2xl" onClick={() => setNavOpen(!navOpen)}>☰</button>
        </nav>

        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar for desktop */}
          <div className="w-[250px] h-[165vh] bg-blue-950 p-5 shadow-md mb-12 flex-shrink-0 hidden lg:flex flex-col">
            {menuItems.map((item, index) => (
              <div key={index}
                className={`flex items-center gap-4 p-3 mb-3 rounded-lg cursor-pointer transition ${selectedView === item.label ? 'bg-indigo-200 text-blue-900' : 'hover:bg-indigo-100 hover:translate-x-1'}`}
                onClick={() => setSelectedView(item.label)}
              >
                <span className="text-white text-lg">{item.icon}</span>
                <h5 className="text-white font-medium text-base">{item.label}</h5>
              </div>
            ))}
          </div>

          {/* Mobile Horizontal Menu */}
          <div className="flex lg:hidden overflow-x-auto bg-blue-950 py-3 px-4 space-x-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center min-w-[70px] text-white ${selectedView === item.label ? 'text-blue-300 font-semibold' : ''}`}
                onClick={() => setSelectedView(item.label)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1 text-center">{item.label}</span>
              </div>
            ))}
          </div>

          
          <div className="w-full lg:w-[75%] h-auto bg-transparent pt-8 pl-8">
            {selectedView === 'Dashboard' && (
              <>
                <h2 className="text-3xl ml-10 font-bold">Welcome Back</h2>
                <p className="text-lg ml-10 mb-6">Continue your learning journey with one of your current Courses.</p>

                <div className="grid grid-cols-[repeat(auto-fit,_minmax(240px,_1fr))] gap-5 px-10">
                  {courses.map((course, index) => (
                    <div key={index}
                      className="bg-[#f1f6ff] p-5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                      onClick={() => { setSelectedCourse(course); setSelectedView('Course Modules'); }}
                    >
                      <h4 className="text-md font-semibold text-[#1d3557] mb-1">{course.title}</h4>
                      <p className="text-sm text-[#555] mb-3">{course.subtitle}</p>
                      <div className="relative w-full h-2 bg-gray-300 rounded-full mb-2">
                        <div className="absolute top-0 left-0 h-2 bg-blue-950 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <div className="text-xs text-right text-[#333] mb-3">{course.progress}%</div>
                      <button className="w-full bg-blue-950 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">Resume Course</button>
                    </div>
                  ))}
                </div>
              </>
            )}


{selectedView === 'Dashboard' && (
  <div className="mx-auto max-w-screen-xl ml-10 px-4 py-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Upcoming Deadlines */}
      <div>
        <h3 className="text-xl font-bold mb-4">Upcoming Deadlines</h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-4">
            <div className="text-center w-10">
              <p className="text-xs text-gray-500">Apr</p>
              <p className="text-xl font-bold text-black">25</p>
            </div>
            <div>
              <p className="text-md font-medium text-black">
                Project Plan<br />Submission
              </p>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-start gap-4">
            <div className="text-center w-10">
              <p className="text-xs text-gray-500">Apr</p>
              <p className="text-xl font-bold text-black">28</p>
            </div>
            <div>
              <p className="text-md font-medium text-black">
                Case Study<br />Analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className='ml-10'>
        <h3 className="text-xl font-bold mb-4">Progress Overview</h3>
        <div className="flex items-center">
          <div className="relative w-24 h-24 mr-6">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="4" />
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
              <text x="18" y="21" textAnchor="middle" className="fill-black text-[10px] font-bold">
                60%
              </text>
            </svg>
          </div>
          <div className="text-sm text-black space-y-1">
            <p>Enrolled</p>
            <p><span className="font-bold">60%</span> Completion</p>
            <p><span className="font-bold">2</span></p>
          </div>
        </div>
      </div>
    </div>

    {/* Certificate Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
      <div>
        <h3 className="text-xl font-bold mb-4">Upcoming Deadlines</h3>
        <div className="flex items-center gap-2 text-black text-md">
          <span className="bg-gray-200 p-2 rounded-md">
            <FaRegCommentDots className="text-lg" />
          </span>
          <p className="font-medium">Certificate</p>
        </div>
      </div>

      <div className='ml-10'>
        <h3 className="text-xl font-bold mb-4">Achievements & Certificates</h3>
        <div className="flex items-center gap-2 text-black text-md">
          <span className="bg-gray-200 p-2 rounded-md">
            <FaRegCommentDots className="text-lg" />
          </span>
          <p className="font-medium">Certificate</p>
        </div>
      </div>
    </div>
  </div>
)}


            {selectedView === 'Course Modules' && selectedCourse && <CourseModulesView />}
            {selectedView === 'My Progress' && <CourseProgressView />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portal;
