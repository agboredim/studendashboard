import React from "react";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { Link } from "react-router-dom";

const DynamicBlogRenderer = ({ blogPost, relatedPosts = [] }) => {
  // Generate the current blog post's URL
  const postUrl =
    typeof window !== "undefined" && blogPost
      ? window.location.origin + "/blog/" + blogPost.slug
      : "";

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

  const handleCopyLink = async () => {
    if (!postUrl) return;
    await navigator.clipboard.writeText(postUrl);
    alert("Link copied to clipboard!");
  };

  const renderContentBlock = (block) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={block.id} className="mb-6 text-lg leading-relaxed">
            {block.content}
          </p>
        );

      case "heading2":
        return (
          <h2
            key={block.id}
            id={block.anchor}
            className="text-2xl font-bold mb-4 text-primary"
          >
            {block.content}
          </h2>
        );

      case "heading3":
        return (
          <h3
            key={block.id}
            id={block.anchor}
            className="text-xl font-semibold mb-4"
          >
            {block.content}
          </h3>
        );

      case "heading4":
        return (
          <h4
            key={block.id}
            id={block.anchor}
            className="text-lg font-semibold mb-2"
          >
            {block.content}
          </h4>
        );

      case "list":
        return (
          <ul key={block.id} className="list-disc pl-6 mb-6 space-y-2">
            {block.content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

      case "numberedList":
        return (
          <ol key={block.id} className="list-decimal pl-6 mb-6 space-y-2">
            {block.content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );

      case "callout":
        const getCalloutClass = (style) => {
          const styles = {
            info: "bg-blue-50 border-l-4 border-blue-500",
            warning: "bg-yellow-50 border-l-4 border-yellow-500",
            danger: "bg-red-50 border-l-4 border-red-500",
            success: "bg-green-50 border-l-4 border-green-500",
            neutral: "bg-gray-100",
          };
          return styles[style] || styles.info;
        };

        return (
          <div
            key={block.id}
            className={`${getCalloutClass(block.style)} p-6 mb-6`}
          >
            <p className="font-semibold text-gray-800">{block.content}</p>
          </div>
        );

      case "example":
        return (
          <div
            key={block.id}
            className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-2">Example:</h3>
            <p>{block.content}</p>
          </div>
        );

      case "tableOfContents":
        return (
          <div key={block.id} className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-6 space-y-2">
              {block.content.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.anchor}`}
                    className="text-primary hover:underline"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        );

      case "cta":
        return (
          <div
            key={block.id}
            className="bg-primary text-white p-8 rounded-lg mb-8"
          >
            <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
            <p className="mb-4">{block.content}</p>
            <a
              href={block.link}
              className="inline-block bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              {block.buttonText}
            </a>
          </div>
        );

      default:
        return null;
    }
  };

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
        <span className="text-primary">{blogPost.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <img
              src={blogPost.image || "/placeholder.svg"}
              alt={blogPost.title}
              className="w-full h-[400px] object-cover"
            />

            {/* Article Content */}
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

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {blogPost.title}
              </h1>

              {/* Author */}
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

              {/* Article Body */}
              <div className="prose max-w-none">
                {blogPost.content.map((block) => renderContentBlock(block))}
              </div>

              {/* Tags */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-foreground/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-5 w-5 text-foreground/70" />
                    {blogPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-foreground rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
          {relatedPosts.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicBlogRenderer;

// ===========================================
// JSON SCHEMA FOR BACKEND ENGINEER
// ===========================================

/*
BLOG POST JSON STRUCTURE:

{
  "id": "number", // Auto-generated by backend
  "title": "string", // Required
  "slug": "string", // Auto-generated from title if not provided
  "author": "string", // Required
  "authorRole": "string",
  "authorImage": "string", // URL
  "date": "string", // Format: "March 10, 2025"
  "category": "string", // Required - one of: "Compliance", "Data Analysis", "Cybersecurity", "Business Analysis", "Technology"
  "tags": ["string"], // Array of strings
  "image": "string", // URL - Featured image
  "excerpt": "string", // Required - Brief description
  "content": [
    {
      "id": "number", // Block ID
      "type": "string", // Block type - see types below
      "content": "string|array", // Content varies by type
      "style": "string", // Optional - for callouts
      "anchor": "string", // Optional - for headings
      "title": "string", // Optional - for CTAs
      "buttonText": "string", // Optional - for CTAs
      "link": "string" // Optional - for CTAs
    }
  ],
  "createdAt": "ISO string", // Backend timestamp
  "updatedAt": "ISO string", // Backend timestamp
  "status": "string", // "draft" | "published" | "archived"
  "publishedAt": "ISO string" // Backend timestamp when published
}

CONTENT BLOCK TYPES:

1. paragraph:
{
  "id": 123,
  "type": "paragraph",
  "content": "This is a paragraph of text..."
}

2. heading2:
{
  "id": 124,
  "type": "heading2",
  "content": "Main Heading",
  "anchor": "main-heading" // Optional for table of contents
}

3. heading3:
{
  "id": 125,
  "type": "heading3",
  "content": "Sub Heading",
  "anchor": "sub-heading"
}

4. heading4:
{
  "id": 126,
  "type": "heading4",
  "content": "Minor Heading",
  "anchor": "minor-heading"
}

5. list (bulleted):
{
  "id": 127,
  "type": "list",
  "content": ["First item", "Second item", "Third item"]
}

6. numberedList:
{
  "id": 128,
  "type": "numberedList",
  "content": ["First step", "Second step", "Third step"]
}

7. callout:
{
  "id": 129,
  "type": "callout",
  "content": "This is important information",
  "style": "info" // "info" | "warning" | "danger" | "success" | "neutral"
}

8. tableOfContents:
{
  "id": 130,
  "type": "tableOfContents",
  "content": [
    {
      "title": "Section 1",
      "anchor": "section-1"
    },
    {
      "title": "Section 2", 
      "anchor": "section-2"
    }
  ]
}

9. cta (Call to Action):
{
  "id": 131,
  "type": "cta",
  "title": "Start Your Career",
  "content": "Join our training program today...",
  "buttonText": "Enroll Now",
  "link": "/courses"
}

EXAMPLE COMPLETE BLOG POST:

{
  "id": 1,
  "title": "Complete Guide to AML Compliance",
  "slug": "complete-guide-aml-compliance",
  "author": "John Smith",
  "authorRole": "AML Expert",
  "authorImage": "https://example.com/john.jpg",
  "date": "March 15, 2025",
  "category": "Compliance",
  "tags": ["AML", "Compliance", "Financial Crime"],
  "image": "https://example.com/featured.jpg",
  "excerpt": "Learn everything about AML compliance in this comprehensive guide.",
  "content": [
    {
      "id": 1,
      "type": "paragraph",
      "content": "Anti-Money Laundering (AML) compliance is crucial for financial institutions..."
    },
    {
      "id": 2,
      "type": "heading2",
      "content": "What is AML?",
      "anchor": "what-is-aml"
    },
    {
      "id": 3,
      "type": "callout",
      "content": "AML regulations help prevent financial crime.",
      "style": "info"
    },
    {
      "id": 4,
      "type": "list",
      "content": ["KYC procedures", "Transaction monitoring", "Risk assessment"]
    },
    {
      "id": 5,
      "type": "cta",
      "title": "Master AML Compliance",
      "content": "Join our comprehensive AML training program.",
      "buttonText": "Enroll Today",
      "link": "/courses/aml"
    }
  ],
  "status": "published",
  "createdAt": "2025-03-15T10:00:00Z",
  "updatedAt": "2025-03-15T10:00:00Z",
  "publishedAt": "2025-03-15T12:00:00Z"
}

API ENDPOINTS NEEDED:

POST /api/blogs - Create new blog post
GET /api/blogs - Get all blog posts (with pagination, filtering)
GET /api/blogs/:id - Get single blog post
PUT /api/blogs/:id - Update blog post
DELETE /api/blogs/:id - Delete blog post
PUT /api/blogs/:id/publish - Publish draft
PUT /api/blogs/:id/unpublish - Unpublish blog

QUERY PARAMETERS for GET /api/blogs:
- page: number
- limit: number
- category: string
- tag: string
- status: "draft" | "published" | "archived"
- search: string (searches title, excerpt, content)
- author: string

*/
