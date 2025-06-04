import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define our courses API
export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = getState().auth.user?.token;

      // If we have a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Course", "Assignment", "Order"],
  endpoints: (builder) => ({
    // Get all courses
    getAllCourses: builder.query({
      query: () => "/courses/courses",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    // Get a single course by ID
    getCourseById: builder.query({
      query: (id) => `/courses/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    // Get courses by category
    getCoursesByCategory: builder.query({
      query: (category) => `/courses/courses?category=${category}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Course", id })),
              { type: "Course", id: "CATEGORY" },
            ]
          : [{ type: "Course", id: "CATEGORY" }],
    }),

    // Search courses
    searchCourses: builder.query({
      query: (searchTerm) => `/courses/courses?search=${searchTerm}`,
      providesTags: [{ type: "Course", id: "SEARCH" }],
    }),

    // NEW ENDPOINTS

    // Get all assignments
    getAllAssignments: builder.query({
      query: () => ({
        url: "/courses/assignments/",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Assignment", id })),
              { type: "Assignment", id: "LIST" },
            ]
          : [{ type: "Assignment", id: "LIST" }],
    }),

    // Get a single assignment by ID
    getAssignmentById: builder.query({
      query: (id) => `/courses/assignments/${id}/`,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),

    // Get student's enrolled courses (orders)
    getEnrolledCourses: builder.query({
      query: (id) => `/customuser/student/${id}`,
      providesTags: ["Order"],
    }),
    //  Get detailed course progress
    getCourseProgressDetails: builder.query({
      query: ({ userId, courseId }) =>
        `/customuser/users/${userId}/courses/${courseId}/progress/details/`,
      providesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
      ],
    }),
    // }),
    // / NEW LIBRARY ENDPOINTS

    // Get all library materials
    getAllLibraryMaterials: builder.query({
      query: () => "/courses/courselibrary/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Library", id })),
              { type: "Library", id: "LIST" },
            ]
          : [{ type: "Library", id: "LIST" }],
    }),

    // Get a single library material by ID
    getLibraryMaterialById: builder.query({
      query: (id) => `/courses/courselibrary/${id}/`,
      providesTags: (result, error, id) => [{ type: "Library", id }],
    }),
    // NEW CERTIFICATE ENDPOINT
    // Generate and download certificate
    generateCertificate: builder.mutation({
      query: () => ({
        url: "/courses/GenerateCertificate/",
        method: "GET",
        // params: { course_id: courseId, user_id: userId },
        responseHandler: async (response) => {
          // Handle PDF blob response
          if (response.status === 200) {
            const blob = await response.blob();
            return {
              blob,
              filename: response.headers.get("content-disposition"),
            };
          }
          throw new Error("Failed to generate certificate");
        },
      }),
      invalidatesTags: [{ type: "Certificate", id: "LIST" }],
    }),

    // Check if certificate is available for a course
    checkCertificateAvailability: builder.query({
      query: ({ courseId, userId }) => ({
        url: `/courses/certificates/check/${courseId}/${userId}/`,
        method: "GET",
      }),
      providesTags: (result, error, { courseId, userId }) => [
        { type: "Certificate", id: `${courseId}-${userId}` },
      ],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCategoryQuery,
  useSearchCoursesQuery,
  // New hooks
  useGetAllAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useGetEnrolledCoursesQuery,
  useGetCourseProgressDetailsQuery,
  // New library hooks
  useGetAllLibraryMaterialsQuery,
  useGetLibraryMaterialByIdQuery,
  useGenerateCertificateMutation,
  useCheckCertificateAvailabilityQuery,
} = coursesApi;
