"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { blogPosts } from "../data/blogData";

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the current post
    const currentPost = blogPosts.find((p) => p.slug === slug);
    setPost(currentPost);

    // Find related posts (same category, different post)
    if (currentPost) {
      const related = blogPosts
        .filter(
          (p) => p.category === currentPost.category && p.id !== currentPost.id
        )
        .slice(0, 3);
      setRelatedPosts(related);
    }

    setLoading(false);
  }, [slug]);

  // Generate the current blog post's URL
  const postUrl =
    typeof window !== "undefined" && post
      ? window.location.origin + "/blog/" + post.slug
      : "";

  const handleShare = (platform) => {
    if (!post) return;
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(post.title);
    let shareUrl = "";
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === "x") {
      shareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleCopyLink = async () => {
    if (!postUrl) return;
    await navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!"); // Replace with toast if you have one
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        {/* Loading text using primary color */}
        <div className="animate-pulse text-primary text-xl">
          Loading article...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        {/* Error heading remains red */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Article Not Found
        </h2>
        {/* Error paragraph using foreground/80 color */}
        <p className="text-foreground/80 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        {/* Button background primary, text white, hover primary/90 */}
        <Link
          to="/blog"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      {/* Breadcrumb text using foreground/70 */}
      <div className="text-sm text-foreground/70 mb-6">
        {/* Breadcrumb link hover primary */}
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        &gt; {/* Breadcrumb link hover primary */}
        <Link to="/blog" className="hover:text-primary">
          Blog
        </Link>{" "}
        {/* Current breadcrumb item text primary */}
        &gt; <span className="text-primary">{post.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Card background white, shadow remains */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />

            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Category badge background primary/10, text primary */}
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {post.category}
                </span>
                {/* Date text foreground/70, icon default color or inherits */}
                <span className="text-sm text-foreground/70 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </span>
              </div>

              {/* Title text primary */}
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {post.title}
              </h1>

              {/* Author */}
              <div className="flex items-center mb-6 border-b border-foreground/10 pb-6">
                <img
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  {/* Author name text foreground */}
                  <p className="font-medium text-foreground">{post.author}</p>
                  {/* Author role text foreground/70 */}
                  <p className="text-sm text-foreground/70">
                    {post.authorRole}
                  </p>
                </div>
              </div>

              {/* Article Body - prose class color handled by typography plugin or default */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content() }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Tag icon foreground/70 */}
                  <Tag className="h-5 w-5 text-foreground/70" />
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="font-medium text-foreground">
                  Share this article:
                </span>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  onClick={() => handleShare("facebook")}
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  onClick={() => handleShare("x")}
                  aria-label="Share on X"
                >
                  <SiX className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  onClick={() => handleShare("linkedin")}
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Back to Blog link text primary, hover primary/80 */}
          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary font-medium hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Related Articles - background white, shadow remains */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Heading text primary */}
            <h3 className="text-xl font-bold text-primary mb-4">
              Related Articles
            </h3>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="block"
                >
                  {/* Hover background gray-50 remains */}
                  <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-20 h-20 object-cover rounded-md mr-3"
                    />
                    <div>
                      {/* Title text primary */}
                      <h4 className="font-medium text-primary line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      {/* Date text foreground/70 */}
                      <p className="text-xs text-foreground/70 mt-1">
                        {relatedPost.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories - background white, shadow remains */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Heading text primary */}
            <h3 className="text-xl font-bold text-primary mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(blogPosts.map((p) => p.category))).map(
                (category) => (
                  <Link
                    key={category}
                    to={`/blog?category=${category}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    {/* Text foreground */}
                    <span className="text-foreground">{category}</span>
                    <span className="bg-gray-100 text-foreground rounded-full px-2 py-1 text-xs">
                      {blogPosts.filter((p) => p.category === category).length}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Popular Tags - background white, shadow remains */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Heading text primary */}
            <h3 className="text-xl font-bold text-primary mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(blogPosts.flatMap((p) => p.tags)))
                .slice(0, 10)
                .map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-foreground rounded-full text-sm hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
