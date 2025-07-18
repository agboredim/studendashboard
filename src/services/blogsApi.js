// blogsApi.js - Fixed with missing queries and improved functionality
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Blog", "BlogCategory", "BlogTag"],
  endpoints: (builder) => ({
    // Get all blogs for public use
    getAllBlogs: builder.query({
      query: (params = {}) => "/blog/blogs/",
      transformResponse: (response, meta, arg) => {
        let blogs = response?.blogs || response || [];

        // Filter to only published blogs for public view
        blogs = blogs.filter((blog) => blog.status === "published");

        // Apply frontend filtering if parameters were passed
        if (arg && typeof arg === "object") {
          if (arg.category) {
            blogs = blogs.filter(
              (blog) =>
                blog.category &&
                blog.category.toLowerCase().includes(arg.category.toLowerCase())
            );
          }
          if (arg.search) {
            const searchTerm = arg.search.toLowerCase();
            blogs = blogs.filter((blog) => {
              const titleMatch =
                blog.title && blog.title.toLowerCase().includes(searchTerm);
              const excerptMatch =
                blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm);
              const categoryMatch =
                blog.category &&
                blog.category.toLowerCase().includes(searchTerm);
              return titleMatch || excerptMatch || categoryMatch;
            });
          }

          // Handle pagination on frontend
          const page = arg.page || 1;
          const limit = arg.limit || 10;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedBlogs = blogs.slice(startIndex, endIndex);

          return {
            blogs: paginatedBlogs,
            total: blogs.length,
            totalPages: Math.ceil(blogs.length / limit),
            currentPage: page,
          };
        }

        return {
          blogs: blogs,
          total: blogs.length,
          totalPages: 1,
          currentPage: 1,
        };
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    // Get all blogs for admin with filtering and stats calculation
    getAdminBlogs: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response, meta, arg) => {
        let blogs = response?.blogs || response || [];

        // Apply frontend filtering if parameters were passed
        if (arg && typeof arg === "object") {
          if (arg.status && arg.status !== "all") {
            blogs = blogs.filter((blog) => blog.status === arg.status);
          }
          if (arg.category) {
            blogs = blogs.filter(
              (blog) =>
                blog.category &&
                blog.category.toLowerCase().includes(arg.category.toLowerCase())
            );
          }
          if (arg.search) {
            const searchTerm = arg.search.toLowerCase();
            blogs = blogs.filter((blog) => {
              const titleMatch =
                blog.title && blog.title.toLowerCase().includes(searchTerm);
              const excerptMatch =
                blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm);
              const categoryMatch =
                blog.category &&
                blog.category.toLowerCase().includes(searchTerm);
              return titleMatch || excerptMatch || categoryMatch;
            });
          }

          // Handle pagination on frontend
          const page = arg.page || 1;
          const limit = arg.limit || 10;
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedBlogs = blogs.slice(startIndex, endIndex);

          return {
            blogs: paginatedBlogs,
            total: blogs.length,
            totalPages: Math.ceil(blogs.length / limit),
            currentPage: page,
          };
        }

        return {
          blogs: blogs,
          total: blogs.length,
          totalPages: 1,
          currentPage: 1,
        };
      },
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ id }) => ({ type: "Blog", id })),
              { type: "Blog", id: "ADMIN_LIST" },
            ]
          : [{ type: "Blog", id: "ADMIN_LIST" }],
    }),

    // FIXED: Added back the missing getRelatedBlogs query
    getRelatedBlogs: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response, meta, arg) => {
        let blogs = response?.blogs || response || [];

        // Filter to only published blogs
        blogs = blogs.filter((blog) => blog.status === "published");

        if (arg && typeof arg === "object") {
          // Filter by category if provided
          if (arg.category) {
            blogs = blogs.filter((blog) => blog.category === arg.category);
          }

          // Exclude the current blog if excludeId is provided
          if (arg.excludeId) {
            blogs = blogs.filter((blog) => blog.id !== arg.excludeId);
          }

          // Limit the number of results
          const limit = arg.limit || 3;
          blogs = blogs.slice(0, limit);
        }

        return {
          blogs: blogs,
          total: blogs.length,
        };
      },
      providesTags: [{ type: "Blog", id: "RELATED" }],
    }),

    // Calculate blog stats from the main blogs data
    getBlogStats: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response) => {
        const blogs = response?.blogs || response || [];

        const stats = {
          totalBlogs: blogs.length,
          publishedBlogs: blogs.filter((blog) => blog.status === "published")
            .length,
          draftBlogs: blogs.filter((blog) => blog.status === "draft").length,
          totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
          recentBlogs: blogs
            .sort(
              (a, b) =>
                new Date(b.createdAt || b.date) -
                new Date(a.createdAt || a.date)
            )
            .slice(0, 5),
        };

        return stats;
      },
      providesTags: [{ type: "Blog", id: "STATS" }],
    }),

    // UPDATED: Use correct backend route for individual blog
    getBlogById: builder.query({
      query: (id) => `/blog/blogs/${id}/`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Get blog by slug - try to find by slug in the blogs list
    getBlogBySlug: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response, meta, slug) => {
        const blogs = response?.blogs || response || [];
        const blog = blogs.find((b) => b.slug === slug);
        return blog || null;
      },
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    // UPDATED: Use correct backend route for creating blog
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: "/blog/blogs/",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: [
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "STATS" },
      ],
    }),

    // UPDATED: Use correct backend route for updating blog
    updateBlog: builder.mutation({
      query: ({ id, ...blogData }) => ({
        url: `/blog/blogs/${id}/`,
        method: "PUT",
        body: blogData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "STATS" },
        { type: "Blog", id: "RELATED" },
      ],
    }),

    // UPDATED: Use correct backend route for deleting blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/blogs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "STATS" },
        { type: "Blog", id: "RELATED" },
      ],
    }),

    // Update blog status (if supported by backend)
    updateBlogStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/blog/blogs/${id}/`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "STATS" },
      ],
    }),

    // Bulk delete blogs (implement as multiple individual deletes)
    bulkDeleteBlogs: builder.mutation({
      queryFn: async (blogIds, api, extraOptions, baseQuery) => {
        const results = [];
        for (const id of blogIds) {
          const result = await baseQuery({
            url: `/blog/blogs/${id}/`,
            method: "DELETE",
          });
          if (result.error) {
            return { error: result.error };
          }
          results.push(result.data);
        }
        return { data: results };
      },
      invalidatesTags: [
        { type: "Blog", id: "LIST" },
        { type: "Blog", id: "ADMIN_LIST" },
        { type: "Blog", id: "STATS" },
        { type: "Blog", id: "RELATED" },
      ],
    }),

    // Get blog categories (derived from blogs if no separate endpoint)
    getBlogCategories: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response) => {
        const blogs = response?.blogs || response || [];
        const categories = [
          ...new Set(blogs.map((blog) => blog.category).filter(Boolean)),
        ];
        return categories.map((category) => ({
          name: category,
          count: blogs.filter((blog) => blog.category === category).length,
        }));
      },
      providesTags: [{ type: "BlogCategory", id: "LIST" }],
    }),

    // Search blogs
    searchBlogs: builder.query({
      query: () => "/blog/blogs/",
      transformResponse: (response, meta, searchTerm) => {
        const blogs = response?.blogs || response || [];
        const filteredBlogs = blogs.filter((blog) => {
          const term = searchTerm.toLowerCase();
          return (
            blog.title?.toLowerCase().includes(term) ||
            blog.excerpt?.toLowerCase().includes(term) ||
            blog.category?.toLowerCase().includes(term)
          );
        });
        return { blogs: filteredBlogs, total: filteredBlogs.length };
      },
      providesTags: [{ type: "Blog", id: "SEARCH" }],
    }),

    // Upload blog image (if supported)
    uploadBlogImage: builder.mutation({
      query: (formData) => ({
        url: "/blog/upload-image/",
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
  useGetRelatedBlogsQuery, // FIXED: Added back this export
  useGetBlogCategoriesQuery,
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
