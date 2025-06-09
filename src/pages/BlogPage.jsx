import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { blogPosts } from "../data/blogData"; // Static blog posts
import { useGetAllBlogsQuery } from "../services/blogsApi";

function BlogPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [page, setPage] = useState(1);

  // RTK Query for dynamic blogs
  const {
    data: blogResponse,
    isLoading,
    error,
  } = useGetAllBlogsQuery({
    page,
    limit: 10,
    category: selectedCategory !== "All" ? selectedCategory : undefined,
    search: searchTerm || undefined,
  });

  // Combine static and dynamic posts
  const allPosts = [
    ...blogPosts, // Static posts
    ...(blogResponse?.blogs || []).map((post) => ({
      ...post,
      isDynamic: true,
    })),
  ];

  // Filter combined posts
  const filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(allPosts.map((post) => post.category))];

  const renderBlogCard = (post, isFeatured = false) => {
    if (isFeatured) {
      return (
        <div className="mb-12">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2 h-full">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="ml-4 text-sm text-foreground/70 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </span>
                  {post.isDynamic && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      New
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">
                  {post.title}
                </h2>
                <p className="text-foreground/80 mb-4">{post.excerpt}</p>
                <div className="flex items-center mb-6">
                  <img
                    src={post.authorImage || "/placeholder.svg"}
                    alt={post.author}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{post.author}</p>
                    <p className="text-sm text-foreground/70">
                      {post.authorRole}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80"
                >
                  Read Article <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={post.id}
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Link to={`/blog/${post.slug}`}>
          <div className="relative">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            />
            {post.isDynamic && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
                New
              </span>
            )}
          </div>
        </Link>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {post.category}
            </span>
            <span className="text-xs text-foreground/70 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {post.date}
            </span>
          </div>
          <Link to={`/blog/${post.slug}`}>
            <h3 className="text-xl font-bold text-primary mb-2 hover:text-primary/80 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="text-foreground/80 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author}
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <span className="text-sm font-medium text-foreground">
                {post.author}
              </span>
            </div>
            <Link
              to={`/blog/${post.slug}`}
              className="text-sm text-primary font-medium hover:text-primary/80"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">
          TITANS CAREERS Blog
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Stay ahead of the curve with expert insights, emerging trends, and
          practical tips across KYC & AML compliance, data analysis,
          cybersecurity, business analysis/project management, and regulatory
          technology. Whether you're building your career or leading change,
          Titans Careers has you covered.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="search"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-foreground/60" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 text-sm text-foreground/70">
        Showing {filteredPosts.length} of {allPosts.length} articles
        {selectedCategory !== "All" && ` in "${selectedCategory}"`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Featured Post */}
      {filteredPosts.length > 0 && renderBlogCard(filteredPosts[0], true)}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.slice(1).map((post) => renderBlogCard(post))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No articles found
          </h3>
          <p className="text-foreground/80 mb-4">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load More Button (for pagination if needed) */}
      {filteredPosts.length > 10 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90">
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
