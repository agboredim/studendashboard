import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our API base URL
export const baseUrl = import.meta.env.VITE_BASE_URL || "";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include", // Enable sending cookies
    prepareHeaders: (headers, { getState }) => {
      // Get the access token from Redux state
      const token = getState().auth.accessToken;

      // Set Content-Type
      headers.set("Content-Type", "application/json");

      // Add Authorization header if token exists
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
      invalidatesTags: ["User"],
    }),

    // Register endpoint
    register: builder.mutation({
      query: (userData) => ({
        url: "/customuser/signup/",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Google authentication endpoint
    googleAuth: builder.mutation({
      query: (credentials) => ({
        url: "/customuser/api/google-login/",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Authentication failed",
        };
      },
      invalidatesTags: ["User"],
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/customuser/logout",
        method: "POST",
      }),
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

    // UPDATED: Secure PayPal payment processing with backend verification
    processPayPalPayment: builder.mutation({
      query: (paymentData) => ({
        url: `/payment/paypal/capture-order/`, // NEW SECURE ENDPOINT
        method: "POST",
        body: {
          payment_id: paymentData.payment_id, // PayPal payment ID
          order_id: paymentData.order_id, // PayPal order ID
          expected_amount: paymentData.expected_amount, // Expected payment amount
          course_id: paymentData.course_id, // Single course ID
          currency: paymentData.currency || "GBP", // Payment currency
          payer_email: paymentData.payer_email, // Payer's email
          billing_info: paymentData.billing_info, // Billing information
        },
      }),
      transformResponse: (response) => {
        return {
          success: true,
          order_id: response.order_id,
          message: response.message || "Payment processed successfully",
          course_access: response.course_access,
        };
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Failed to process PayPal payment",
          error_code: response.data?.error_code,
        };
      },
      invalidatesTags: ["Orders"],
    }),

    // Stripe Payment Intent
    createStripePaymentIntent: builder.mutation({
      query: (paymentData) => ({
        url: `/payment/create-payment-intent/`,
        method: "POST",
        body: {
          amount: paymentData.amount,
          currency: paymentData.currency || "gbp",
          metadata: {
            integration_check: "accept_a_payment",
          },
        },
      }),
      transformResponse: (response) => {
        return {
          clientSecret: response.client_secret,
          paymentIntentId: response.id,
        };
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.error || "Failed to create payment intent",
        };
      },
    }),

    // Get user orders
    getUserOrders: builder.query({
      query: () => "/orders/user/",
      providesTags: ["Orders"],
    }),

    // Send guide
    sendGuide: builder.mutation({
      query: (body) => ({
        url: "/send-guide/",
        method: "POST",
        body,
      }),
    }),

    // Request Password Reset Email
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "/customuser/password-reset/",
        method: "POST",
        body: email,
      }),
    }),

    // Confirm Password Reset with Token
    confirmPasswordReset: builder.mutation({
      query: (data) => ({
        url: "/customuser/password-reset-confirm/",
        method: "POST",
        body: data,
      }),
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
  useCreateStripePaymentIntentMutation,
  useGetUserOrdersQuery,
  useSendGuideMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} = api;
