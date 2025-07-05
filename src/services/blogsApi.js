// blogsApi.js - Blog API following your RTK Query pattern
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Merge: Allow getAllBlogs and getRelatedBlogs to accept params as objects, but keep all endpoints and admin features.
// Use fetchBaseQuery as in the current file, but if a base api is set up elsewhere, you could swap to that.
// All endpoints and tagTypes are preserved.
// getAllBlogs and getRelatedBlogs now accept params as objects for easier usage.

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Blog", "BlogCategory", "BlogTag"],
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: (params = {}) => {
        // Accepts params as an object for easier usage
        const searchParams = new URLSearchParams({
          page: params.page?.toString() || "1",
          limit: params.limit?.toString() || "10",
          status: params.status || "published",
        });
        if (params.category) searchParams.append("category", params.category);
        if (params.tag) searchParams.append("tag", params.tag);
        if (params.search) searchParams.append("search", params.search);
        return `/blog/blogs/?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `/blogs/slug/${slug}/`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}/`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "/blogs/",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
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
    getRelatedBlogs: builder.query({
      query: (params = {}) => {
        // Accepts params as an object for easier usage
        const searchParams = new URLSearchParams({
          category: params.category || "",
          limit: params.limit?.toString() || "3",
          status: "published",
        });
        if (params.excludeId) searchParams.append("exclude", params.excludeId);
        return `/blogs/related/?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Blog", id: "RELATED" }],
    }),
    getBlogCategories: builder.query({
      query: () => "/blogs/categories/",
      providesTags: [{ type: "BlogCategory", id: "LIST" }],
    }),
    getBlogTags: builder.query({
      query: () => "/blogs/tags/",
      providesTags: [{ type: "BlogTag", id: "LIST" }],
    }),
    getBlogStats: builder.query({
      query: () => "/blogs/stats/",
      providesTags: [{ type: "Blog", id: "STATS" }],
    }),
    searchBlogs: builder.query({
      query: (searchTerm) =>
        `/blogs/search/?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: "Blog", id: "SEARCH" }],
    }),
    getAdminBlogs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams({
          page: params.page?.toString() || "1",
          limit: params.limit?.toString() || "10",
        });
        if (params.status && params.status !== "all")
          searchParams.append("status", params.status);
        if (params.author) searchParams.append("author", params.author);
        if (params.category) searchParams.append("category", params.category);
        return `/blogs/admin/?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "ADMIN_LIST" },
            ]
          : [{ type: "Blog", id: "ADMIN_LIST" }],
    }),
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
    uploadBlogImage: builder.mutation({
      query: (formData) => ({
        url: "/blogs/upload-image/",
        method: "POST",
        body: formData,
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
