import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { toast } from "sonner"; // Assuming you have sonner for toasts
import { blogPosts } from "../data/blogData"; // Imported for category/tag counts in sidebar, ideally this would be dynamic

// Helper function to render individual content blocks based on their type
const renderContentBlock = (block, index) => {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-6 text-lg leading-relaxed text-foreground">
          {block.value}
        </p>
      );
    case "heading":
      const HeadingTag = `h${block.level}`; // Dynamically render h2, h3, or h4
      return (
        <HeadingTag
          key={index}
          id={block.id} // Used for anchor links
          className={`font-bold mb-4 text-primary ${
            block.level === 2
              ? "text-2xl"
              : block.level === 3
              ? "text-xl"
              : "text-lg"
          }`}
        >
          {block.value}
        </HeadingTag>
      );
    case "infoBox": // Corresponds to bg-gray-100 style in static data
      return (
        <div key={index} className="bg-gray-100 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">{block.title}</h2>
          {block.value && Array.isArray(block.value) && (
            <ol className="list-decimal pl-6 space-y-2">
              {block.value.map((item, i) =>
                item.type === "link" ? ( // Check if it's a link within the info box
                  <li key={i}>
                    <a
                      href={item.href}
                      className="text-primary hover:underline"
                    >
                      {item.text}
                    </a>
                  </li>
                ) : (
                  // Otherwise, treat as a plain list item
                  <li key={i}>{item.value}</li>
                )
              )}
            </ol>
          )}
        </div>
      );
    case "highlightBox": // Corresponds to bg-blue-50 style in static data
      return (
        <div key={index} className="bg-blue-50 p-6 rounded-lg mb-6">
          <p className="font-semibold text-blue-800">{block.value}</p>
        </div>
      );
    case "alertBox": // Corresponds to bg-yellow-50 with border-l-4 style
      return (
        <div
          key={index}
          className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6"
        >
          {block.title && (
            <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
          )}
          {block.value && Array.isArray(block.value) && (
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {block.value.map((item, i) =>
                item.type === "paragraph" ? (
                  <p key={i}>{item.value}</p>
                ) : (
                  <li key={i}>{item.value}</li>
                )
              )}
            </ul>
          )}
        </div>
      );
    case "warningBox": // Corresponds to bg-red-50 with border-l-4 style
      return (
        <div
          key={index}
          className="bg-red-50 border-l-4 border-red-500 p-6 mb-6"
        >
          {block.title && (
            <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
          )}
          {block.value && Array.isArray(block.value) && (
            <ul className="list-disc pl-6 mt-2 space-y-1">
              {block.value.map((item, i) =>
                item.type === "paragraph" ? (
                  <p key={i}>{item.value}</p>
                ) : (
                  <li key={i}>{item.value}</li>
                )
              )}
            </ul>
          )}
        </div>
      );
    case "primaryBox": // Corresponds to bg-primary text-white style
      return (
        <div key={index} className="bg-primary text-white p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
          {block.value && Array.isArray(block.value) && (
            <>
              {block.value.map((item, i) =>
                item.type === "paragraph" ? (
                  <p key={i} className="mb-4">
                    {item.value}
                  </p>
                ) : item.type === "link" ? (
                  <Link
                    key={i}
                    to={item.href}
                    className="inline-block bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {item.text}
                  </Link>
                ) : null
              )}
            </>
          )}
        </div>
      );
    case "list": // Generic unordered list
      return (
        <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
          {block.value.map((item, i) => (
            <li key={i}>{item.value}</li>
          ))}
        </ul>
      );
    case "image":
      return (
        <div key={index} className="my-8">
          <img
            src={block.src || "/placeholder.svg"}
            alt={block.alt || "Blog image"}
            className="w-full rounded-lg object-cover"
          />
          {block.caption && (
            <p className="text-center text-sm text-foreground/70 mt-2">
              {block.caption}
            </p>
          )}
        </div>
      );
    // Add more cases for other custom content types if needed (e.g., codeBlock)
    default:
      return (
        <p key={index} className="text-red-500">
          Unsupported content block type: {block.type}
        </p>
      );
  }
};

function DynamicBlogRenderer({ blogPost, relatedPosts }) {
  if (!blogPost) {
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

  // Generate the current blog post's URL for sharing
  const postUrl =
    typeof window !== "undefined" && blogPost
      ? window.location.origin + "/blog/" + blogPost.slug
      : "";

  // Handle social sharing clicks
  const handleShare = (platform) => {
    if (!blogPost) return;
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(blogPost.title);
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

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    if (!postUrl) return;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Failed to copy link.");
      });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-foreground/70 mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        {" > "}
        <Link to="/blog" className="hover:text-primary">
          Blog
        </Link>
        {" > "}
        <span className="text-primary">{blogPost.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Article Content Area */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <img
              src={blogPost.image || "/placeholder.svg"}
              alt={blogPost.title}
              className="w-full h-[400px] object-cover"
            />

            {/* Article Details and Content */}
            <div className="p-6 md:p-8">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {blogPost.category}
                </span>
                <span className="text-sm text-foreground/70 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {blogPost.date}
                </span>
              </div>

              {/* Blog Post Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {blogPost.title}
              </h1>

              {/* Author Information */}
              <div className="flex items-center mb-6 border-b border-foreground/10 pb-6">
                <img
                  src={blogPost.authorImage || "/placeholder.svg"}
                  alt={blogPost.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {blogPost.author}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {blogPost.authorRole}
                  </p>
                </div>
              </div>

              {/* Dynamically Rendered Article Body */}
              <div className="prose max-w-none">
                {/* Ensure blogPost.content is an array before mapping */}
                {blogPost.content && Array.isArray(blogPost.content) ? (
                  blogPost.content.map(renderContentBlock)
                ) : (
                  <p className="text-red-500">
                    Blog content is not in the expected structured format.
                  </p>
                )}
              </div>

              {/* Tags Section */}
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-5 w-5 text-foreground/70" />
                  {blogPost.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Buttons */}
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

          {/* Back to Blog Link */}
          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-primary font-medium hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </div>

        {/* Sidebar for Related Articles, Categories, and Popular Tags */}
        <div className="lg:w-1/3">
          {/* Related Articles Section */}
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

          {/* Categories Section (Note: For dynamic counts, this would ideally fetch from a separate API) */}
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
                      {/* This count relies on static `blogPosts` data. For true dynamic counts, you'd need an API endpoint. */}
                      {blogPosts.filter((p) => p.category === category).length}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Popular Tags Section (Note: For dynamic counts, this would ideally fetch from a separate API) */}
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

export default DynamicBlogRenderer;
