"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Calendar, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { blogPosts } from "../data/blogData"

function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find the current post
    const currentPost = blogPosts.find((p) => p.slug === slug)
    setPost(currentPost)

    // Find related posts (same category, different post)
    if (currentPost) {
      const related = blogPosts
        .filter((p) => p.category === currentPost.category && p.id !== currentPost.id)
        .slice(0, 3)
      setRelatedPosts(related)
    }

    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-blue-950 text-xl">Loading article...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Article Not Found</h2>
        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-6 py-3 bg-blue-950 text-white rounded-md hover:bg-blue-900">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-950">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link to="/blog" className="hover:text-blue-950">
          Blog
        </Link>{" "}
        &gt; <span className="text-blue-950">{post.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-64 md:h-96 object-cover" />

            {/* Article Content */}
            <div className="p-6 md:p-8">
              {/* Category and Date */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-950 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">{post.title}</h1>

              {/* Author */}
              <div className="flex items-center mb-6 border-b border-gray-200 pb-6">
                <img
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-medium text-lg">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.authorRole}</p>
                </div>
              </div>

              {/* Article Body */}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-500" />
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <span className="font-medium">Share this article:</span>
                <button className="p-2 bg-blue-100 text-blue-950 rounded-full hover:bg-blue-200">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-950 rounded-full hover:bg-blue-200">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-950 rounded-full hover:bg-blue-200">
                  <Linkedin className="h-5 w-5" />
                </button>
                <button className="p-2 bg-blue-100 text-blue-950 rounded-full hover:bg-blue-200">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-8">
            <Link to="/blog" className="inline-flex items-center text-blue-950 font-medium hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Related Articles */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-950 mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="block">
                  <div className="flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-20 h-20 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium text-blue-950 line-clamp-2">{relatedPost.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-950 mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(blogPosts.map((p) => p.category))).map((category) => (
                <Link
                  key={category}
                  to={`/blog?category=${category}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <span>{category}</span>
                  <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                    {blogPosts.filter((p) => p.category === category).length}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-blue-950 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(blogPosts.flatMap((p) => p.tags)))
                .slice(0, 10)
                .map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {tag}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostPage
