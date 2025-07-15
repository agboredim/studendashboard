"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Plus,
  CheckSquare,
  Square,
  FileText,
} from "lucide-react";
import {
  useGetAdminBlogsQuery,
  useDeleteBlogMutation,
  useBulkDeleteBlogsMutation,
  useUpdateBlogStatusMutation,
} from "../../services/blogsApi";
import { toast } from "sonner";

function AdminBlogList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const {
    data: blogResponse,
    isLoading,
    error,
  } = useGetAdminBlogsQuery({
    page,
    limit: 10,
    status: statusFilter,
    category: categoryFilter,
    search: searchTerm,
  });

  const [deleteBlog] = useDeleteBlogMutation();
  const [bulkDeleteBlogs] = useBulkDeleteBlogsMutation();
  const [updateBlogStatus] = useUpdateBlogStatusMutation();

  const blogs = blogResponse?.blogs || [];
  const totalPages = blogResponse?.totalPages || 1;
  const totalBlogs = blogResponse?.total || 0;

  const handleSelectBlog = (blogId) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map((blog) => blog.id));
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      try {
        await deleteBlog(blogId).unwrap();
        toast.success("Blog deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error?.data?.message || "Failed to delete blog");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedBlogs.length} selected blogs? This action cannot be undone.`
      )
    ) {
      try {
        await bulkDeleteBlogs(selectedBlogs).unwrap();
        toast.success(`${selectedBlogs.length} blogs deleted successfully`);
        setSelectedBlogs([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error(error?.data?.message || "Failed to delete blogs");
      }
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await updateBlogStatus({ id: blogId, status: newStatus }).unwrap();
      toast.success(`Blog ${newStatus} successfully`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error?.data?.message || `Failed to ${newStatus} blog`);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4 border-b">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
          <p className="text-gray-600 mt-1">
            Manage your blog posts ({totalBlogs} total)
          </p>
        </div>
        <Link
          to="/admin/blog/create"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Blog
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Category Filter */}
          <input
            type="text"
            placeholder="Filter by category..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedBlogs.length} blog{selectedBlogs.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedBlogs([])}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <button onClick={handleSelectAll} className="mr-4 p-1">
              {selectedBlogs.length === blogs.length && blogs.length > 0 ? (
                <CheckSquare className="h-4 w-4 text-primary" />
              ) : (
                <Square className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-5">Blog Post</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>
        </div>

        {/* Blog Rows */}
        <div className="divide-y divide-gray-200">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <button
                    onClick={() => handleSelectBlog(blog.id)}
                    className="mr-4 p-1"
                  >
                    {selectedBlogs.includes(blog.id) ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    {/* Blog Post */}
                    <div className="col-span-5 flex items-center space-x-3">
                      <img
                        src={
                          blog.image || "/placeholder.svg?height=48&width=48"
                        }
                        alt={blog.title}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=48&width=48";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/admin/blog/edit/${blog.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary truncate block"
                        >
                          {blog.title}
                        </Link>
                        <p className="text-sm text-gray-500 truncate">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {blog.category}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <select
                        value={blog.status}
                        onChange={(e) =>
                          handleStatusChange(blog.id, e.target.value)
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-primary ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-sm text-gray-500">
                      {blog.date}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center space-x-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/blog/edit/${blog.id}`}
                        className="text-gray-400 hover:text-primary"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No blogs found</p>
              <Link
                to="/admin/blog/create"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Blog
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBlogList;
