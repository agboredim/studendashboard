import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { blogPosts } from "../data/blogData"; // Static blog posts
import DynamicBlogRenderer from "../components/DynamicBlogRenderer"; // Component we created above
import {
  useGetBlogBySlugQuery,
  useGetRelatedBlogsQuery,
} from "../services/blogsApi";

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isDynamicPost, setIsDynamicPost] = useState(false);

  // Try to get dynamic post first
  const { data: dynamicPost, isLoading, error } = useGetBlogBySlugQuery(slug);

  // Get related posts if we have a dynamic post
  const { data: relatedResponse } = useGetRelatedBlogsQuery(
    dynamicPost
      ? {
          category: dynamicPost.category,
          excludeId: dynamicPost.id,
          limit: 3,
        }
      : undefined,
    { skip: !dynamicPost }
  );

  useEffect(() => {
    if (dynamicPost) {
      setPost(dynamicPost);
      setIsDynamicPost(true);
    } else {
      // Fallback to static posts
      const staticPost = blogPosts.find((p) => p.slug === slug);
      setPost(staticPost);
      setIsDynamicPost(false);
    }
  }, [dynamicPost, slug]);

  const relatedPosts = isDynamicPost
    ? relatedResponse?.blogs || []
    : blogPosts
        .filter((p) => p.category === post?.category && p.id !== post?.id)
        .slice(0, 3);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">
          Loading article...
        </div>
      </div>
    );
  }

  // If it's a dynamic post, use the new renderer
  if (isDynamicPost) {
    return <DynamicBlogRenderer blogPost={post} relatedPosts={relatedPosts} />;
  }

  // If it's a static post, use the existing rendering logic
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Article Not Found
        </h2>
        <p className="text-foreground/80 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  // Generate the current blog post's URL for static posts
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
    alert("Link copied to clipboard!");
  };

  // Existing static blog post rendering (unchanged)
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-foreground/70 mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        {" > "}
        <Link to="/blog" className="hover:text-primary">
          Blog
        </Link>
        {" > "}
        <span className="text-primary">{post.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
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
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-foreground/70 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </span>
              </div>

              {/* Title */}
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
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-sm text-foreground/70">
                    {post.authorRole}
                  </p>
                </div>
              </div>

              {/* Article Body - Static content with function */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content() }}
              />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <div className="flex flex-wrap items-center gap-2">
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

          {/* Back to Blog */}
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
          {/* Related Articles */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                  <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-20 h-20 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-primary line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-xs text-foreground/70 mt-1">
                        {relatedPost.date}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(blogPosts.map((p) => p.category))).map(
                (category) => (
                  <Link
                    key={category}
                    to={`/blog?category=${category}`}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-foreground">{category}</span>
                    <span className="bg-gray-100 text-foreground rounded-full px-2 py-1 text-xs">
                      {blogPosts.filter((p) => p.category === category).length}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
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
