"use client"

import React from "react"
import { Link } from "react-router-dom"
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react"
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa"
import { SiX } from "react-icons/si"
import { toast } from "sonner"

// IMPROVED: Enhanced content block renderer with better error handling
const renderContentBlock = (block, index) => {
  if (!block || !block.type) {
    return (
      <p key={index} className="text-red-500 bg-red-50 p-4 rounded">
        Invalid content block at position {index}
      </p>
    )
  }

  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-6 text-lg leading-relaxed text-foreground">
          {block.value || ""}
        </p>
      )

    case "heading":
      const HeadingTag = `h${block.level || 2}`
      return React.createElement(
        HeadingTag,
        {
          key: index,
          id: block.headingId || block.id,
          className: `font-bold mb-4 text-primary ${
            (block.level || 2) === 2 ? "text-2xl" : (block.level || 2) === 3 ? "text-xl" : "text-lg"
          }`,
        },
        block.value || "",
      )

    case "infoBox":
      return (
        <div key={index} className="bg-gray-100 p-6 rounded-lg mb-8">
          {block.title && <h3 className="text-xl font-bold mb-4">{block.title}</h3>}
          {block.value && Array.isArray(block.value) ? (
            <div className="space-y-2">
              {block.value.map((item, i) =>
                item.type === "link" ? (
                  <p key={i}>
                    <a
                      href={item.href}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  </p>
                ) : (
                  <p key={i}>{item.value || item}</p>
                ),
              )}
            </div>
          ) : (
            <p>{block.value}</p>
          )}
        </div>
      )

    case "highlightBox":
      return (
        <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
          {block.title && <h3 className="text-lg font-semibold text-blue-800 mb-2">{block.title}</h3>}
          <p className="font-semibold text-blue-800">{block.value}</p>
        </div>
      )

    case "alertBox":
      return (
        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
          {block.title && <h3 className="text-lg font-semibold text-yellow-800 mb-2">{block.title}</h3>}
          {block.value && Array.isArray(block.value) ? (
            <div className="space-y-2">
              {block.value.map((item, i) =>
                item.type === "paragraph" ? (
                  <p key={i} className="text-yellow-800">
                    {item.value}
                  </p>
                ) : (
                  <p key={i} className="text-yellow-800">
                    {item.value || item}
                  </p>
                ),
              )}
            </div>
          ) : (
            <p className="text-yellow-800">{block.value}</p>
          )}
        </div>
      )

    case "warningBox":
      return (
        <div key={index} className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
          {block.title && <h3 className="text-lg font-semibold text-red-800 mb-2">{block.title}</h3>}
          {block.value && Array.isArray(block.value) ? (
            <div className="space-y-2">
              {block.value.map((item, i) =>
                item.type === "paragraph" ? (
                  <p key={i} className="text-red-800">
                    {item.value}
                  </p>
                ) : (
                  <p key={i} className="text-red-800">
                    {item.value || item}
                  </p>
                ),
              )}
            </div>
          ) : (
            <p className="text-red-800">{block.value}</p>
          )}
        </div>
      )

    case "primaryBox":
      return (
        <div key={index} className="bg-primary text-white p-8 rounded-lg mb-8">
          {block.title && <h3 className="text-2xl font-bold mb-4">{block.title}</h3>}
          {block.value && Array.isArray(block.value) ? (
            <div className="space-y-4">
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
                ) : (
                  <p key={i}>{item.value || item}</p>
                ),
              )}
            </div>
          ) : (
            <p>{block.value}</p>
          )}
        </div>
      )

    case "list":
      return (
        <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
          {(block.value || []).map((item, i) => (
            <li key={i}>{item.value || item}</li>
          ))}
        </ul>
      )

    case "image":
      return (
        <div key={index} className="my-8">
          <img
            src={block.src || "/placeholder.svg?height=400&width=800"}
            alt={block.alt || "Blog image"}
            className="w-full rounded-lg object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=400&width=800"
            }}
          />
          {block.caption && <p className="text-center text-sm text-foreground/70 mt-2 italic">{block.caption}</p>}
        </div>
      )

    default:
      return (
        <div key={index} className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
          <p className="text-yellow-800">
            <strong>Unsupported content type:</strong> {block.type}
          </p>
          <pre className="text-xs mt-2 text-yellow-700">{JSON.stringify(block, null, 2)}</pre>
        </div>
      )
  }
}

function DynamicBlogRenderer({ blogPost, relatedPosts = [] }) {
  if (!blogPost) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h2>
        <p className="text-foreground/80 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90">
          Back to Blog
        </Link>
      </div>
    )
  }

  // Generate the current blog post's URL for sharing
  const postUrl = typeof window !== "undefined" && blogPost ? window.location.origin + "/blog/" + blogPost.slug : ""

  // Handle social sharing clicks
  const handleShare = (platform) => {
    if (!blogPost) return
    const encodedUrl = encodeURIComponent(postUrl)
    const encodedTitle = encodeURIComponent(blogPost.title)
    let shareUrl = ""

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    } else if (platform === "x") {
      shareUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  // Handle copy link to clipboard
  const handleCopyLink = () => {
    if (!postUrl) return
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success("Link copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err)
        toast.error("Failed to copy link.")
      })
  }

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
              src={blogPost.image || "/placeholder.svg?height=400&width=800"}
              alt={blogPost.title}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=400&width=800"
              }}
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
                  {new Date(blogPost.date || blogPost.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Blog Post Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{blogPost.title}</h1>

              {/* Author Information */}
              <div className="flex items-center mb-6 border-b border-foreground/10 pb-6">
                <img
                  src={blogPost.authorImage || "/placeholder.svg?height=48&width=48"}
                  alt={blogPost.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
                <div>
                  <p className="font-medium text-foreground">{blogPost.author || "Anonymous"}</p>
                  <p className="text-sm text-foreground/70">{blogPost.authorRole || "Author"}</p>
                </div>
              </div>

              {/* Dynamically Rendered Article Body */}
              <div className="prose max-w-none">
                {blogPost.content && Array.isArray(blogPost.content) ? (
                  blogPost.content.map(renderContentBlock)
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                    <p className="text-yellow-800 mb-2">
                      <strong>Content Format Issue:</strong> Blog content is not in the expected structured format.
                    </p>
                    <p className="text-sm text-yellow-700">
                      Expected an array of content blocks, but received: {typeof blogPost.content}
                    </p>
                    {blogPost.content && (
                      <pre className="text-xs mt-2 bg-yellow-100 p-2 rounded overflow-auto">
                        {JSON.stringify(blogPost.content, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-foreground/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-5 w-5 text-foreground/70" />
                    {blogPost.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-foreground rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="font-medium text-foreground">Share this article:</span>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  onClick={() => handleShare("facebook")}
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  onClick={() => handleShare("x")}
                  aria-label="Share on X"
                >
                  <SiX className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                  onClick={() => handleShare("linkedin")}
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </button>
                <button
                  className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
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
              className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </div>

        {/* Sidebar for Related Articles */}
        <div className="lg:w-1/3">
          {/* Related Articles Section */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-primary mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="block">
                    <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <img
                        src={relatedPost.image || "/placeholder.svg?height=80&width=80"}
                        alt={relatedPost.title}
                        className="w-20 h-20 object-cover rounded-md mr-3"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=80&width=80"
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-primary line-clamp-2">{relatedPost.title}</h4>
                        <p className="text-xs text-foreground/70 mt-1">
                          {new Date(relatedPost.date || relatedPost.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Signup or CTA */}
          <div className="bg-primary text-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-primary-100 mb-4">Get the latest insights and tips delivered to your inbox.</p>
            <Link
              to="/contact"
              className="inline-block bg-white text-primary px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicBlogRenderer
