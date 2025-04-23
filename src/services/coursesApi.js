import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define our courses API
export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["Course"],
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
  }),
});

// Export the auto-generated hooks
export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByCategoryQuery,
  useSearchCoursesQuery,
} = coursesApi;
