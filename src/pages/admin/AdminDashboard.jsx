import { Link } from "react-router-dom";
import {
  FileText,
  Eye,
  TrendingUp,
  Plus,
  Edit,
  Calendar,
  Tag,
} from "lucide-react";
import {
  useGetBlogStatsQuery,
  useGetAdminBlogsQuery,
} from "../../services/blogsApi";

function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetBlogStatsQuery();
  const { data: recentBlogs, isLoading: blogsLoading } = useGetAdminBlogsQuery({
    page: 1,
    limit: 5,
  });

  const statsCards = [
    {
      title: "Total Blogs",
      value: stats?.totalBlogs || 0,
      icon: FileText,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Published",
      value: stats?.publishedBlogs || 0,
      icon: Eye,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Draft",
      value: stats?.draftBlogs || 0,
      icon: Edit,
      color: "bg-yellow-500",
      change: "+3%",
    },
    {
      title: "Total Views",
      value: stats?.totalViews || 0,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+23%",
    },
  ];

  if (statsLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your blog.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/admin/blog/create"
          className="bg-primary text-white p-6 rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
        >
          <div className="flex items-center">
            <Plus className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Create New Blog</h3>
              <p className="text-primary-100">Start writing a new blog post</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/blog/list"
          className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm hover:border-primary transition-colors"
        >
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-4 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Blogs
              </h3>
              <p className="text-gray-600">Edit, delete, or publish blogs</p>
            </div>
          </div>
        </Link>

        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 mr-4 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600">View blog performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Blogs
            </h2>
            <Link
              to="/admin/blog/list"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {blogsLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : recentBlogs?.blogs?.length > 0 ? (
            recentBlogs.blogs.map((blog) => (
              <div key={blog.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img
                    src={blog.image || "/placeholder.svg"}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/admin/blog/edit/${blog.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-primary"
                    >
                      {blog.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {blog.date}
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {blog.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/admin/blog/edit/${blog.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No blogs yet. Create your first blog post!
              </p>
              <Link
                to="/admin/blog/create"
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Blog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
