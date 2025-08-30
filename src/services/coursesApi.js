import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectAccessToken } from "../store/slices/authSlice"; // ✅ Correct import

// Base API URL
export const baseUrl =
  import.meta.env.VITE_BASE_URL || "https://api.titanscareers.com";

// Helper: filter upcoming classes based on start date
const filterUpcoming = (data) => {
  if (!Array.isArray(data)) return [];
  const now = new Date();
  return data.filter((cls) => {
    const dateValue =
      cls.start_time || cls.date || cls.startDate || cls.start || null;
    const start = dateValue ? new Date(dateValue) : null;
    return start instanceof Date && !isNaN(start) && start > now;
  });
};

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      try {
        const token = selectAccessToken(getState());
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.error("Error preparing headers:", err);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Course",
    "Assignment",
    "Order",
    "Library",
    "Certificate",
    "Progress",
    "Profile",
    "LiveClass",
  ],
  endpoints: (builder) => ({
    // 📚 Courses
    getAllCourses: builder.query({
      query: () => "/courses/courses",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    getCourseById: builder.query({
      query: (id) => `/courses/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    getCoursesByCategory: builder.query({
      query: (category) => `/courses/courses?category=${category}`,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "CATEGORY" },
            ]
          : [{ type: "Course", id: "CATEGORY" }],
    }),

    searchCourses: builder.query({
      query: (searchTerm) => `/courses/courses?search=${searchTerm}`,
      providesTags: [{ type: "Course", id: "SEARCH" }],
    }),

    // 📝 Assignments
    getAllAssignments: builder.query({
      query: () => "/courses/assignments/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Assignment", id })),
              { type: "Assignment", id: "LIST" },
            ]
          : [{ type: "Assignment", id: "LIST" }],
    }),

    getAssignmentById: builder.query({
      query: (id) => `/courses/assignments/${id}/`,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),

    // ✅ Get assignments for a student in a specific course (with submitted flag)
    getAssignmentsForStudentCourse: builder.query({
      async queryFn({ userId, courseId }, _queryApi, _extraOptions, baseQuery) {
        // 1️⃣ Fetch student details (enrolled courses + submissions)
        const studentRes = await baseQuery(`/customuser/student/${userId}`);
        if (studentRes.error) return { error: studentRes.error };

        // 2️⃣ Fetch all assignments
        const assignmentRes = await baseQuery(`/courses/assignments/`);
        if (assignmentRes.error) return { error: assignmentRes.error };

        const studentCourses = studentRes.data?.enrolled_courses || [];
        const studentSubmissions = studentRes.data?.submissions || [];
        const allAssignments = assignmentRes.data || [];

        // 3️⃣ Filter assignments for this course
        const filteredAssignments = allAssignments
          .filter((a) => String(a.course?.id) === String(courseId))
          .map((assignment) => {
            // 4️⃣ Mark submitted if found in student submissions
            const submitted = studentSubmissions.some(
              (s) => String(s.assignment) === String(assignment.id)
            );
            return { ...assignment, submitted };
          });

        return { data: filteredAssignments };
      },
      providesTags: (result, error, { courseId }) => [
        { type: "Assignment", id: `STUDENT-COURSE-${courseId}` },
      ],
    }),

submitAssignment: builder.mutation({
  query: (submissionData) => {
    const formData = new FormData();
    formData.append("assignment_id", submissionData.assignment); // 👈 use assignment_id
    if (submissionData.file) formData.append("file", submissionData.file);
    if (submissionData.feedback)
      formData.append("feedback", submissionData.feedback);

    return {
      url: `/courses/submission/`,
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: (result, error, { courseId }) => [
    { type: "Assignment", id: "LIST" },
    { type: "Assignment", id: `STUDENT-COURSE-${courseId}` },
  ],
}),


    // 📦 Orders & Enrollment
    getEnrolledCourses: builder.query({
      query: (id) => `/customuser/student/${id}`,
      providesTags: ["Order"],
    }),

    // 📊 Progress
    getCourseProgressDetails: builder.query({
      query: ({ userId, courseId }) =>
        `/customuser/user-course-progress/${userId}/${courseId}/`,
      providesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),

    // 📚 Library
    getAllLibraryMaterials: builder.query({
      query: () => "/courses/courselibrary/",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "Library", id })),
              { type: "Library", id: "LIST" },
            ]
          : [{ type: "Library", id: "LIST" }],
    }),

    getLibraryMaterialById: builder.query({
      query: (id) => `/courses/courselibrary/${id}/`,
      providesTags: (result, error, id) => [{ type: "Library", id }],
    }),

    // 🎓 Certificates
    generateCertificate: builder.mutation({
      query: () => ({
        url: "/courses/GenerateCertificate/",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return {
            blob,
            filename: response.headers.get("content-disposition"),
          };
        },
      }),
      transformResponse: (response) => ({
        success: true,
        filename: response.filename,
        timestamp: new Date().toISOString(),
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Certificate generation failed:", error);
        }
      },
      transformErrorResponse: (error) => ({
        error:
          error.status === 404
            ? "Certificate not found"
            : "Failed to generate certificate",
        status: error.status,
        data: error.data,
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    checkCertificateAvailability: builder.query({
      query: ({ courseId, userId }) => ({
        url: `/courses/certificates/check/${courseId}/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, { courseId, userId }) => [
        { type: "Certificate", id: `${courseId}-${userId}` },
      ],
    }),

    // 🎥 Live Classes
    getAllLiveClasses: builder.query({
      query: () => `/courses/CreateLiveClass/`,
      providesTags: [{ type: "LiveClass", id: "ALL" }],
    }),

    getUpcomingLiveClasses: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(`/courses/CreateLiveClass/`);
        if (result.error) return { error: result.error };
        return { data: filterUpcoming(result.data) };
      },
      providesTags: [{ type: "LiveClass", id: "UPCOMING" }],
    }),

    getLiveClassById: builder.query({
      query: (id) => `/courses/CreateLiveClass/${id}/`,
      providesTags: (result, error, id) => [{ type: "LiveClass", id }],
    }),

    // 👤 Student Profile
    getStudentProfile: builder.query({
      query: () => `/student_profile/profile/`,
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCategoryQuery,
  useSearchCoursesQuery,
  useGetAllAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetAssignmentsForStudentCourseQuery,
  useSubmitAssignmentMutation,
  useGetEnrolledCoursesQuery,
  useGetCourseProgressDetailsQuery,
  useGetAllLibraryMaterialsQuery,
  useGetLibraryMaterialByIdQuery,
  useGenerateCertificateMutation,
  useCheckCertificateAvailabilityQuery,
  useGetAllLiveClassesQuery,
  useGetUpcomingLiveClassesQuery,
  useGetLiveClassByIdQuery,
  useGetStudentProfileQuery,
} = coursesApi;
