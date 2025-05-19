import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { blogPosts } from "../data/blogData";

function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  // Filter posts based on search term and category
  useEffect(() => {
    const filtered = blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        {/* Heading using primary color */}
        <h1 className="text-4xl font-bold text-primary mb-4">
          TITANS CAREERS Blog
        </h1>
        {/* Paragraph using foreground/80 color */}
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
            {/* Icon foreground/60 */}
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

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <div className="mb-12">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={filteredPosts[0].image || "/placeholder.svg"}
                  alt={filteredPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {/* Category badge background primary/10, text primary */}
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {filteredPosts[0].category}
                  </span>
                  {/* Date text foreground/70, icon default color or inherits */}
                  <span className="ml-4 text-sm text-foreground/70 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {filteredPosts[0].date}
                  </span>
                </div>
                {/* Title using primary color */}
                <h2 className="text-2xl font-bold text-primary mb-3">
                  {filteredPosts[0].title}
                </h2>
                {/* Excerpt using foreground/80 color */}
                <p className="text-foreground/80 mb-4">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center mb-6">
                  <img
                    src={filteredPosts[0].authorImage || "/placeholder.svg"}
                    alt={filteredPosts[0].author}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    {/* Author name using foreground color */}
                    <p className="font-medium text-foreground">
                      {filteredPosts[0].author}
                    </p>
                    {/* Author role using foreground/70 color */}
                    <p className="text-sm text-foreground/70">
                      {filteredPosts[0].authorRole}
                    </p>
                  </div>
                </div>
                {/* Link text primary, hover primary/80 */}
                <Link
                  to={`/blog/${filteredPosts[0].slug}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80"
                >
                  Read Article <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.slice(1).map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link to={`/blog/${post.slug}`}>
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                {/* Category badge background primary/10, text primary */}
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {post.category}
                </span>
                {/* Date text foreground/70, icon default color or inherits */}
                <span className="text-xs text-foreground/70 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {post.date}
                </span>
              </div>
              <Link to={`/blog/${post.slug}`}>
                {/* Title text primary, hover primary/80 */}
                <h3 className="text-xl font-bold text-primary mb-2 hover:text-primary/80 transition-colors">
                  {post.title}
                </h3>
              </Link>
              {/* Excerpt text foreground/80 */}
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
                  {/* Author name text foreground */}
                  <span className="text-sm font-medium text-foreground">
                    {post.author}
                  </span>
                </div>
                {/* Link text primary, hover primary/80 */}
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-sm text-primary font-medium hover:text-primary/80"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No articles found
          </h3>
          <p className="text-foreground/80">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}

export default BlogPage;
