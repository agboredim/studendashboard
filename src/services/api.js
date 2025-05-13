import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our API base URL
const baseUrl = import.meta.env.VITE_BASE_URL || "";

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
  tagTypes: ["User", "Courses", "Orders"],
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

    // Google authentication endpoint
    googleAuth: builder.mutation({
      query: (tokenData) => ({
        url: "/customuser/api/google-login/",
        method: "POST",
        body: tokenData,
      }),
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

    // Get courses
    getCourses: builder.query({
      query: () => "/courses/",
      providesTags: ["Courses"],
    }),

    // Get course by ID
    getCourseById: builder.query({
      query: (id) => `/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    // Create order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/courses/orders/",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Process PayPal payment
    processPayPalPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/paypal/create/",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Get user orders
    getUserOrders: builder.query({
      query: () => "/orders/user/",
      providesTags: ["Orders"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateOrderMutation,
  useProcessPayPalPaymentMutation,
  useGetUserOrdersQuery,
} = api;
