import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

function BlogDetailsForm({ blog, setBlog }) {
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Handle changes for basic blog details (except title)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle title change and auto-generate slug
  const handleSlugChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setBlog((prev) => ({ ...prev, title: title, slug: slug }));
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (currentTagInput.trim() && !blog.tags.includes(currentTagInput.trim())) {
      setBlog((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTagInput.trim()],
      }));
      setCurrentTagInput("");
    }
  };

  // Handle removing an existing tag
  const handleRemoveTag = (tagToRemove) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Blog Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={blog.title}
            onChange={handleSlugChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Slug (auto-generated from title)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={blog.slug}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={blog.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Featured Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={blog.image}
            onChange={handleChange}
            placeholder="e.g., https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={blog.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Tags (Add and press Enter or click +)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              id="tags"
              value={currentTagInput}
              onChange={(e) => setCurrentTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Type tag and press Enter"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="p-2 bg-primary text-white rounded-md hover:bg-primary/90"
              aria-label="Add tag"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-gray-200 text-foreground rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-foreground/70 hover:text-red-600"
                  aria-label={`Remove tag ${tag}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailsForm;
