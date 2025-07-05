import React from "react";
import { Calendar, Tag } from "lucide-react";

function BlogPreview({ blog }) {
  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
            {block.value || "Empty paragraph..."}
          </p>
        );

      case "heading":
        const HeadingTag = `h${block.level}`;
        return (
          <HeadingTag
            key={index}
            id={block.id}
            className={`font-bold text-primary mb-4 ${
              block.level === 2
                ? "text-2xl"
                : block.level === 3
                ? "text-xl"
                : "text-lg"
            }`}
          >
            {block.value || "Empty heading..."}
          </HeadingTag>
        );

      case "list":
        return (
          <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
            {block.value.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700">
                {item.value || "Empty list item..."}
              </li>
            ))}
          </ul>
        );

      case "image":
        return (
          <div key={index} className="mb-6">
            {block.src ? (
              <img
                src={block.src}
                alt={block.alt || "Blog image"}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image URL provided</span>
              </div>
            )}
            {block.caption && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {block.caption}
              </p>
            )}
          </div>
        );

      case "infoBox":
        return (
          <div key={index} className="bg-gray-100 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {block.title || "Info Box Title"}
            </h3>
            <p className="text-gray-700">
              {block.value || "Info box content..."}
            </p>
          </div>
        );

      case "highlightBox":
        return (
          <div
            key={index}
            className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-3 text-blue-800">
              {block.title || "Highlight Box Title"}
            </h3>
            <p className="text-blue-700">
              {block.value || "Highlight box content..."}
            </p>
          </div>
        );

      case "warningBox":
        return (
          <div
            key={index}
            className="bg-red-50 border-l-4 border-red-500 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-3 text-red-800">
              {block.title || "Warning Box Title"}
            </h3>
            <p className="text-red-700">
              {block.value || "Warning box content..."}
            </p>
          </div>
        );

      case "alertBox":
        return (
          <div
            key={index}
            className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">
              {block.title || "Alert Box Title"}
            </h3>
            <div className="space-y-2">
              {block.value.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.type === "paragraph" ? (
                    <p className="text-yellow-700">
                      {item.value || "Empty paragraph..."}
                    </p>
                  ) : (
                    <li className="text-yellow-700 ml-4">
                      {item.value || "Empty list item..."}
                    </li>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "primaryBox":
        return (
          <div
            key={index}
            className="bg-primary text-white p-8 rounded-lg mb-6"
          >
            <h3 className="text-2xl font-bold mb-4">
              {block.title || "Call to Action Title"}
            </h3>
            <div className="space-y-4">
              {block.value.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.type === "paragraph" ? (
                    <p className="mb-4">{item.value || "Empty paragraph..."}</p>
                  ) : item.type === "link" ? (
                    <a
                      href={item.href || "#"}
                      className="inline-block bg-white text-primary px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {item.text || "Link Text"}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className="bg-gray-200 p-4 rounded mb-4">
            <p className="text-gray-600">Unknown block type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-screen overflow-y-auto">
      {/* Featured Image */}
      {blog.image ? (
        <img
          src={blog.image}
          alt={blog.title || "Blog preview"}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No featured image</span>
        </div>
      )}

      {/* Article Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {blog.category || "Category"}
          </span>
          <span className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {blog.date}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-primary mb-4">
          {blog.title || "Blog Title Preview"}
        </h1>

        {/* Author */}
        <div className="flex items-center mb-6 border-b border-gray-200 pb-6">
          <img
            src={blog.authorImage}
            alt={blog.author}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{blog.author}</p>
            <p className="text-sm text-gray-600">{blog.authorRole}</p>
          </div>
        </div>

        {/* Excerpt */}
        {blog.excerpt && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic">{blog.excerpt}</p>
          </div>
        )}

        {/* Article Body */}
        <div className="prose max-w-none">
          {blog.content.length > 0 ? (
            blog.content.map((block, index) => renderContentBlock(block, index))
          ) : (
            <p className="text-gray-500 italic">
              No content blocks added yet...
            </p>
          )}
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-5 w-5 text-gray-600" />
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPreview;
