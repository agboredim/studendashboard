import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseUrl = import.meta.env.VITE_BASE_URL;

// Define our live classes API
export const liveClassesApi = createApi({
  reducerPath: "liveClassesApi",
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
  tagTypes: ["LiveClass"],
  endpoints: (builder) => ({
    // Get all live classes
    getAllLiveClasses: builder.query({
      query: () => "/courses/CreateLiveClass/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "LiveClass", id })),
              { type: "LiveClass", id: "LIST" },
            ]
          : [{ type: "LiveClass", id: "LIST" }],
    }),

    // Get live classes by course ID
    getLiveClassesByCourse: builder.query({
      query: (courseId) => `/courses/CreateLiveClass/?course_id=${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "LiveClass", id: `COURSE-${courseId}` },
      ],
    }),

    // Get upcoming live classes (you might need to implement this endpoint)
    getUpcomingLiveClasses: builder.query({
      query: () => "/courses/CreateLiveClass/?upcoming=true",
      providesTags: [{ type: "LiveClass", id: "UPCOMING" }],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetAllLiveClassesQuery,
  useGetLiveClassesByCourseQuery,
  useGetUpcomingLiveClassesQuery,
} = liveClassesApi;
