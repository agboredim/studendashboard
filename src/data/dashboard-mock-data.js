// Mock user data
export const mockUser = {
  name: "Olomoshua",
  username: "olomoshua_student",
  email: "olomoshua@example.com",
  avatar: null,
};

// Mock enrollments data based on the actual course structure
export const mockEnrollments = [
  {
    id: "68138e5728058b208e6a878b",
    course: {
      title: "AML/KYC Compliance",
      instructor: "Olomoshua Omozafen",
      thumbnail: "/media/course_images/IMG-20250501-WA0082_INEicFR.jpg",
    },
    progress: 65,
    lastActivity: new Date(2025, 4, 5),
    nextLesson: "Customer Due Diligence Procedures",
  },
  {
    id: "68138e5728058b208e6a878c",
    course: {
      title: "Data Analysis For Financial Services",
      instructor: "Olomoshua Omozafen",
      thumbnail:
        "/media/course_images/choong-deng-xiang--WXQm_NTK0U-unsplash.jpg",
    },
    progress: 42,
    lastActivity: new Date(2025, 4, 7),
    nextLesson: "Statistical Analysis Methods",
  },
  {
    id: "68138e5728058b208e6a878d",
    course: {
      title: "Business Analysis & Project Management",
      instructor: "Olomoshua Omozafen",
      thumbnail: "/media/course_images/IMG-20250501-WA0084.jpg",
    },
    progress: 78,
    lastActivity: new Date(2025, 4, 8),
    nextLesson: "Stakeholder Management",
  },
  {
    id: "68138e5728058b208e6a878e",
    course: {
      title: "Cybersecurity",
      instructor: "Olomoshua Omozafen",
      thumbnail: "/media/course_images/IMG-20250501-WA0086.jpg",
    },
    progress: 25,
    lastActivity: new Date(2025, 4, 3),
    nextLesson: "Network Security Fundamentals",
  },
  {
    id: "68138e5728058b208e6a878f",
    course: {
      title: "Financial Risk Management",
      instructor: "Olomoshua Omozafen",
      thumbnail: "/placeholder.svg?height=128&width=384&text=Financial+Risk",
    },
    progress: 0,
    lastActivity: null,
    nextLesson: "Introduction to Risk Management",
  },
  {
    id: "68138e5728058b208e6a8790",
    course: {
      title: "Blockchain for Finance",
      instructor: "Olomoshua Omozafen",
      thumbnail: "/placeholder.svg?height=128&width=384&text=Blockchain",
    },
    progress: 100,
    lastActivity: new Date(2025, 3, 25),
    nextLesson: null,
  },
];

// Mock deadlines data based on course structure
export const mockDeadlines = [
  {
    id: 1,
    title: "AML Case Study Analysis",
    description: "Complete the case study analysis for Module 2",
    dueDate: new Date(2025, 4, 15), // May 15, 2025
    type: "assignment",
    courseId: "68138e5728058b208e6a878b",
    courseName: "AML/KYC Compliance",
  },
  {
    id: 2,
    title: "Financial Data Visualization Project",
    description: "Submit your data visualization project for review",
    dueDate: new Date(2025, 4, 18), // May 18, 2025
    type: "assignment",
    courseId: "68138e5728058b208e6a878c",
    courseName: "Data Analysis For Financial Services",
  },
  {
    id: 3,
    title: "Mid-term Assessment",
    description: "Online examination covering modules 1-3",
    dueDate: new Date(2025, 4, 22), // May 22, 2025
    type: "exam",
    courseId: "68138e5728058b208e6a878d",
    courseName: "Business Analysis & Project Management",
  },
];

// Mock certificates data
export const mockCertificates = [
  {
    id: 1,
    title: "Blockchain for Finance Certificate",
    issueDate: new Date(2025, 3, 25),
    courseId: "68138e5728058b208e6a8790",
    courseName: "Blockchain for Finance",
  },
];

// Mock upcoming classes data
export const mockUpcomingClasses = [
  {
    id: 1,
    title: "Advanced Compliance Techniques",
    instructor: "Olomoshua Omozafen",
    startTime: new Date(2025, 4, 14, 14, 0), // May 14, 2025, 2:00 PM
    duration: 60, // 60 minutes
    courseId: "68138e5728058b208e6a878b",
    courseName: "AML/KYC Compliance",
  },
  {
    id: 2,
    title: "Financial Data Analysis Q&A Session",
    instructor: "Olomoshua Omozafen",
    startTime: new Date(2025, 4, 16, 10, 0), // May 16, 2025, 10:00 AM
    duration: 90, // 90 minutes
    courseId: "68138e5728058b208e6a878c",
    courseName: "Data Analysis For Financial Services",
  },
];

// Mock attendance data
export const mockAttendanceData = {
  week: [
    { name: "Mon", attendanceRate: 100, attended: 2, total: 2 },
    { name: "Tue", attendanceRate: 50, attended: 1, total: 2 },
    { name: "Wed", attendanceRate: 100, attended: 1, total: 1 },
    { name: "Thu", attendanceRate: 0, attended: 0, total: 1 },
    { name: "Fri", attendanceRate: 100, attended: 2, total: 2 },
    { name: "Sat", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Sun", attendanceRate: 0, attended: 0, total: 0 },
  ],
  month: [
    { name: "Week 1", attendanceRate: 80, attended: 4, total: 5 },
    { name: "Week 2", attendanceRate: 75, attended: 3, total: 4 },
    { name: "Week 3", attendanceRate: 83, attended: 5, total: 6 },
    { name: "Week 4", attendanceRate: 67, attended: 4, total: 6 },
  ],
  year: [
    { name: "Jan", attendanceRate: 70, attended: 7, total: 10 },
    { name: "Feb", attendanceRate: 80, attended: 8, total: 10 },
    { name: "Mar", attendanceRate: 75, attended: 9, total: 12 },
    { name: "Apr", attendanceRate: 83, attended: 10, total: 12 },
    { name: "May", attendanceRate: 60, attended: 6, total: 10 },
    { name: "Jun", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Jul", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Aug", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Sep", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Oct", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Nov", attendanceRate: 0, attended: 0, total: 0 },
    { name: "Dec", attendanceRate: 0, attended: 0, total: 0 },
  ],
};

// Mock activity data based on course structure
export const mockActivityData = [
  {
    id: 1,
    type: "course_progress",
    description:
      "Completed Module 2: Stakeholder Management in Business Analysis & Project Management",
    timestamp: new Date(2025, 4, 8, 15, 30),
  },
  {
    id: 2,
    type: "assignment_submission",
    description:
      "Submitted Financial Data Visualization Project for Data Analysis course",
    timestamp: new Date(2025, 4, 7, 23, 45),
  },
  {
    id: 3,
    type: "live_class_attended",
    description:
      "Attended live class: Compliance Techniques in AML/KYC Compliance course",
    timestamp: new Date(2025, 4, 6, 14, 0),
  },
  {
    id: 4,
    type: "quiz_completion",
    description: "Scored 92% on Customer Due Diligence Quiz",
    timestamp: new Date(2025, 4, 5, 10, 15),
  },
  {
    id: 5,
    type: "video_watched",
    description: "Watched 'Introduction to Statistical Analysis Methods'",
    timestamp: new Date(2025, 4, 4, 19, 20),
  },
];

// Mock learning time data
export const mockLearningTimeData = {
  week: [
    { name: "Mon", hours: 2.5 },
    { name: "Tue", hours: 1.8 },
    { name: "Wed", hours: 3.2 },
    { name: "Thu", hours: 0.5 },
    { name: "Fri", hours: 2.0 },
    { name: "Sat", hours: 4.5 },
    { name: "Sun", hours: 1.0 },
  ],
  month: [
    { name: "Week 1", hours: 12.5 },
    { name: "Week 2", hours: 15.8 },
    { name: "Week 3", hours: 10.2 },
    { name: "Week 4", hours: 16.0 },
  ],
  year: [
    { name: "Jan", hours: 45 },
    { name: "Feb", hours: 52 },
    { name: "Mar", hours: 48 },
    { name: "Apr", hours: 55 },
    { name: "May", hours: 22 },
    { name: "Jun", hours: 0 },
    { name: "Jul", hours: 0 },
    { name: "Aug", hours: 0 },
    { name: "Sep", hours: 0 },
    { name: "Oct", hours: 0 },
    { name: "Nov", hours: 0 },
    { name: "Dec", hours: 0 },
  ],
};

// Mock stats data
export const mockStats = {
  completionRate: 52, // Based on the average progress of enrolled courses
  completionTrend: 5,
  attendanceRate: 78,
  attendanceTrend: -2,
  learningHours: 54,
  learningHoursTrend: 8,
  certificatesEarned: 1, // Based on the number of certificates
  certificatesTrend: 1,
};

// Mock progress details data based on the API response format
export const mockProgressDetails = {
  "68138e5728058b208e6a878b": {
    user_id: "681c5351c81c75870562eb80",
    course_id: "68138e5728058b208e6a878b",
    course_name: "AML/KYC Compliance",
    progress_percentage: 65,
    details: {
      videos: {
        completed: 1,
        total: 2,
      },
      course_notes: {
        opened: 1,
        total: 1,
      },
      assignments: {
        submitted: 0,
        total: 1,
      },
      blog_pdfs: {
        viewed: 0,
        total: 0,
      },
    },
  },
  "68138e5728058b208e6a878c": {
    user_id: "681c5351c81c75870562eb80",
    course_id: "68138e5728058b208e6a878c",
    course_name: "Data Analysis For Financial Services",
    progress_percentage: 42,
    details: {
      videos: {
        completed: 1,
        total: 2,
      },
      course_notes: {
        opened: 0,
        total: 1,
      },
      assignments: {
        submitted: 0,
        total: 1,
      },
      blog_pdfs: {
        viewed: 0,
        total: 0,
      },
    },
  },
  "68138e5728058b208e6a878d": {
    user_id: "681c5351c81c75870562eb80",
    course_id: "68138e5728058b208e6a878d",
    course_name: "Business Analysis & Project Management",
    progress_percentage: 78,
    details: {
      videos: {
        completed: 0,
        total: 0,
      },
      course_notes: {
        opened: 1,
        total: 1,
      },
      assignments: {
        submitted: 1,
        total: 1,
      },
      blog_pdfs: {
        viewed: 0,
        total: 0,
      },
    },
  },
  "68138e5728058b208e6a878e": {
    user_id: "681c5351c81c75870562eb80",
    course_id: "68138e5728058b208e6a878e",
    course_name: "Cybersecurity",
    progress_percentage: 25,
    details: {
      videos: {
        completed: 0,
        total: 1,
      },
      course_notes: {
        opened: 0,
        total: 0,
      },
      assignments: {
        submitted: 0,
        total: 0,
      },
      blog_pdfs: {
        viewed: 0,
        total: 0,
      },
    },
  },
};
