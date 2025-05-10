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
      query: () => "/courses/assignments/",
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
        `/customuser/users/${userId}/courses/${"681a7baf07f36a7c58e11cd2"}/progress/details/`,
      providesTags: (result, error, { courseId }) => [
        { type: "Progress", id: courseId },
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
} = coursesApi;
