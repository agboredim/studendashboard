// blogsApi.js - Blog API following your RTK Query pattern
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Define our blogs API
export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get the token from auth state
      const token = getState().auth.user?.token;

      // If we have a token, add it to the headers
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Blog", "BlogCategory", "BlogTag"],
  endpoints: (builder) => ({
    // Get all published blogs (public endpoint)
    getAllBlogs: builder.query({
      query: ({
        page = 1,
        limit = 10,
        category,
        tag,
        search,
        status = "published",
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          status,
        });

        if (category) params.append("category", category);
        if (tag) params.append("tag", tag);
        if (search) params.append("search", search);

        return `/blogs/?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    // Get blog by slug (public endpoint)
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/slug/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    // Get blog by ID (admin endpoint)
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}/`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Create new blog (admin only)
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "/blogs/",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    // Update existing blog (admin only)
    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `/blogs/${id}/`,
        method: "PUT",
        body: blogData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    // Delete blog (admin only)
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    // Publish/unpublish blog (admin only)
    updateBlogStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/blogs/${id}/status/`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
      ],
    }),

    // Get related blogs
    getRelatedBlogs: builder.query({
      query: ({ category, excludeId, limit = 3 }) => {
        const params = new URLSearchParams({
          category,
          limit: limit.toString(),
          status: "published",
        });

        if (excludeId) params.append("exclude", excludeId);

        return `/blogs/related/?${params.toString()}`;
      },
      providesTags: [{ type: "Blog", id: "RELATED" }],
    }),

    // Get blog categories
    getBlogCategories: builder.query({
      query: () => "/blogs/categories/",
      providesTags: [{ type: "BlogCategory", id: "LIST" }],
    }),

    // Get blog tags
    getBlogTags: builder.query({
      query: () => "/blogs/tags/",
      providesTags: [{ type: "BlogTag", id: "LIST" }],
    }),

    // Get blog statistics (admin only)
    getBlogStats: builder.query({
      query: () => "/blogs/stats/",
      providesTags: [{ type: "Blog", id: "STATS" }],
    }),

    // Search blogs
    searchBlogs: builder.query({
      query: (searchTerm) =>
        `/blogs/search/?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: "Blog", id: "SEARCH" }],
    }),

    // Get admin blogs (all statuses - admin only)
    getAdminBlogs: builder.query({
      query: ({ page = 1, limit = 10, status, author, category } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (status && status !== "all") params.append("status", status);
        if (author) params.append("author", author);
        if (category) params.append("category", category);

        return `/blogs/admin/?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "ADMIN_LIST" },
            ]
          : [{ type: "Blog", id: "ADMIN_LIST" }],
    }),

    // Bulk delete blogs (admin only)
    bulkDeleteBlogs: builder.mutation({
      query: (blogIds) => ({
        url: "/blogs/bulk-delete/",
        method: "DELETE",
        body: { ids: blogIds },
      }),
      invalidatesTags: [
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
      ],
    }),

    // Upload image for blog (admin only)
    uploadBlogImage: builder.mutation({
      query: (formData) => ({
        url: "/blogs/upload-image/",
        method: "POST",
        body: formData,
        // Remove Content-Type header to allow multipart/form-data
        prepareHeaders: (headers) => {
          headers.delete("Content-Type");
          return headers;
        },
      }),
    }),
  }),
});

// Export the auto-generated hooks
export const {
  // Public queries
  useGetAllBlogsQuery,
  useGetBlogBySlugQuery,
  useGetBlogByIdQuery,
  useGetRelatedBlogsQuery,
  useGetBlogCategoriesQuery,
  useGetBlogTagsQuery,
  useSearchBlogsQuery,

  // Admin queries
  useGetAdminBlogsQuery,
  useGetBlogStatsQuery,

  // Mutations
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogStatusMutation,
  useBulkDeleteBlogsMutation,
  useUploadBlogImageMutation,
} = blogsApi;
