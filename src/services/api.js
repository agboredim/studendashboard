import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our API base URL
const baseUrl = "https://lms-backend-bn1v.onrender.com";

export const api = createApi({
  reducerPath: "api",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: "/customuser/login/",
        method: "POST",
        body: credentials,
      }),
      // Invalidate the User tag to refetch user data
      invalidatesTags: ["User"],
    }),

    // Register endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: "/customuser/signup/",
        method: "POST",
        body: userData,
      }),
      // Invalidate the User tag to refetch user data
      invalidatesTags: ["User"],
    }),

    // Logout endpoint (if needed on the server)
    logout: builder.mutation({
      query: () => ({
        url: "/customuser/logout",
        method: "POST",
      }),
      // We don't need to invalidate tags here as we'll handle logout state in the reducer
    }),

    // Get user profile
    getUserProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
} = api;
