import React, { useState, useEffect } from "react";
import { useCreateBlogMutation } from "../services/blogsApi"; // RTK Query hook for creating blogs
import { toast } from "sonner"; // For showing success/error messages
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Heading1,
  FileText,
  Info,
  Lightbulb,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  List,
} from "lucide-react"; // Icons for block types

// Initial state for a new blog post form
const initialBlogState = {
  title: "",
  slug: "",
  author: "Titans Careers Editorial Team", // Default author
  authorRole: "AML/KYC Compliance Experts", // Default role
  authorImage:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", // Default author image
  date: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }), // Auto-generated date
  category: "Compliance", // Default category
  tags: [], // Array for tags
  image: "", // Featured image URL
  excerpt: "", // Short summary
  content: [], // This will hold our structured content blocks
};

function AdminBlogUpload() {
  const [blog, setBlog] = useState(initialBlogState);
  const [currentTagInput, setCurrentTagInput] = useState(""); // State for adding new tags
  const [createBlog, { isLoading, isSuccess, isError, error }] =
    useCreateBlogMutation(); // RTK Query mutation hook
  const navigate = useNavigate(); // For programmatic navigation

  // Effect to handle success/error states after blog creation attempt
  useEffect(() => {
    if (isSuccess) {
      toast.success("Blog post uploaded successfully!");
      setBlog(initialBlogState); // Reset the form after successful upload
      navigate("/blog"); // Navigate to the blog listing page
    }
    if (isError) {
      toast.error(
        `Failed to upload blog: ${
          error?.data?.message || error?.message || "Unknown error"
        }`
      );
      console.error("Blog upload error:", error); // Log the full error for debugging
    }
  }, [isSuccess, isError, error, navigate]);

  // Handle changes for basic blog details (except title, which has special slug logic)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle title change and auto-generate slug
  const handleSlugChange = (e) => {
    const title = e.target.value;
    // Basic slug generation logic
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars (keep spaces and hyphens)
      .replace(/\s+/g, "-") // Replace spaces with single hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim(); // Trim leading/trailing hyphens/spaces
    setBlog((prev) => ({ ...prev, title: title, slug: slug }));
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (currentTagInput.trim() && !blog.tags.includes(currentTagInput.trim())) {
      setBlog((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTagInput.trim()],
      }));
      setCurrentTagInput(""); // Clear the input field
    }
  };

  // Handle removing an existing tag
  const handleRemoveTag = (tagToRemove) => {
    setBlog((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // --- Content Block Management Functions ---

  // Add a new content block to the blog's content array
  const addContentBlock = (type) => {
    let newBlock;
    // Initialize block based on its type to match JSON structure
    if (type === "heading") {
      newBlock = { type: "heading", level: 2, id: "", value: "" }; // Default to h2
    } else if (["infoBox", "highlightBox", "warningBox"].includes(type)) {
      newBlock = { type, title: "", value: "" }; // Simple text boxes
    } else if (type === "primaryBox") {
      newBlock = { type: "primaryBox", title: "", value: [] }; // Primary box can have nested paragraphs/links
    } else if (type === "alertBox") {
      newBlock = {
        type: "alertBox",
        title: "",
        value: [{ type: "paragraph", value: "" }],
      }; // Alert box can have paragraphs or list items
    } else if (type === "list") {
      newBlock = { type: "list", value: [{ value: "" }] }; // List block
    } else if (type === "image") {
      newBlock = { type: "image", src: "", alt: "", caption: "" }; // Image block
    } else {
      newBlock = { type, value: "" }; // Default for paragraph or other simple types
    }
    setBlog((prev) => ({
      ...prev,
      content: [...prev.content, newBlock], // Add new block to the end
    }));
  };

  // Update a specific field of a content block
  const updateContentBlock = (index, field, value) => {
    const updatedContent = [...blog.content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };

    // Special logic for heading: auto-generate id from value
    if (field === "value" && updatedContent[index].type === "heading") {
      updatedContent[index].id = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }
    setBlog((prev) => ({ ...prev, content: updatedContent }));
  };

  // Remove a content block
  const removeContentBlock = (index) => {
    setBlog((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  // Add a nested item within a content block (e.g., list item in alertBox, paragraph/link in primaryBox)
  const addNestedContentItem = (blockIndex, itemType) => {
    const updatedContent = [...blog.content];
    if (
      updatedContent[blockIndex].value &&
      Array.isArray(updatedContent[blockIndex].value)
    ) {
      if (itemType === "paragraph") {
        updatedContent[blockIndex].value.push({ type: "paragraph", value: "" });
      } else if (itemType === "link") {
        updatedContent[blockIndex].value.push({
          type: "link",
          text: "",
          href: "",
        });
      } else if (itemType === "listItem") {
        updatedContent[blockIndex].value.push({ value: "" });
      }
      setBlog((prev) => ({ ...prev, content: updatedContent }));
    }
  };

  // Update a nested item within a content block
  const updateNestedContentItem = (blockIndex, itemIndex, field, value) => {
    const updatedContent = [...blog.content];
    if (
      updatedContent[blockIndex].value &&
      Array.isArray(updatedContent[blockIndex].value)
    ) {
      updatedContent[blockIndex].value[itemIndex] = {
        ...updatedContent[blockIndex].value[itemIndex],
        [field]: value,
      };
      setBlog((prev) => ({ ...prev, content: updatedContent }));
    }
  };

  // Remove a nested item within a content block
  const removeNestedContentItem = (blockIndex, itemIndex) => {
    const updatedContent = [...blog.content];
    if (
      updatedContent[blockIndex].value &&
      Array.isArray(updatedContent[blockIndex].value)
    ) {
      updatedContent[blockIndex].value = updatedContent[
        blockIndex
      ].value.filter((_, i) => i !== itemIndex);
      setBlog((prev) => ({ ...prev, content: updatedContent }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for main blog fields
    if (
      !blog.title ||
      !blog.slug ||
      !blog.category ||
      !blog.excerpt ||
      !blog.image
    ) {
      toast.error(
        "Please fill in all basic blog details (Title, Slug, Category, Excerpt, Image URL)."
      );
      return;
    }
    if (blog.content.length === 0) {
      toast.error("Please add some content blocks to your blog post.");
      return;
    }

    // More granular validation for content blocks
    for (const block of blog.content) {
      if (
        ["paragraph", "heading", "highlightBox"].includes(block.type) &&
        !block.value?.trim()
      ) {
        toast.error(`"${block.type}" block cannot be empty.`);
        return;
      }
      if (block.type === "image" && !block.src?.trim()) {
        toast.error("Image block requires a source URL.");
        return;
      }
      if (
        block.type === "list" &&
        (!block.value ||
          block.value.length === 0 ||
          block.value.some((item) => !item.value?.trim()))
      ) {
        toast.error("List blocks must contain at least one non-empty item.");
        return;
      }
      if (
        ["infoBox", "alertBox", "warningBox", "primaryBox"].includes(block.type)
      ) {
        if (!block.title?.trim()) {
          toast.error(`"${block.type}" block requires a title.`);
          return;
        }
        if (!block.value || block.value.length === 0) {
          toast.error(`"${block.type}" block must contain content.`);
          return;
        }
        if (
          block.value.some(
            (item) => item.type === "paragraph" && !item.value?.trim()
          )
        ) {
          toast.error(
            `All paragraphs within "${block.type}" must have content.`
          );
          return;
        }
        if (
          block.value.some(
            (item) => item.type === "listItem" && !item.value?.trim()
          )
        ) {
          toast.error(
            `All list items within "${block.type}" must have content.`
          );
          return;
        }
        if (
          block.value.some(
            (item) =>
              item.type === "link" && (!item.text?.trim() || !item.href?.trim())
          )
        ) {
          toast.error(
            `All links within "${block.type}" must have text and a URL.`
          );
          return;
        }
      }
    }

    try {
      // Send the blog object (which now contains the structured content array) to the backend
      await createBlog(blog).unwrap();
    } catch (err) {
      // Error handling is managed by the useEffect hook
      console.error("Blog creation failed:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Upload New Blog Post
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
      >
        {/* Basic Blog Details Section */}
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Blog Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              onChange={handleSlugChange} // Uses special handler for slug generation
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
              readOnly // Make slug read-only as it's auto-generated
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
                    e.preventDefault(); // Prevent form submission
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

        {/* Content Builder Section */}
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Blog Content Builder
        </h2>
        <div className="space-y-6 mb-8 p-4 border border-gray-100 rounded-md bg-gray-50">
          {/* Render each content block dynamically */}
          {blog.content.map((block, blockIndex) => (
            <div
              key={blockIndex}
              className="border border-gray-200 p-4 rounded-md relative bg-white shadow-sm"
            >
              {/* Remove block button */}
              <button
                type="button"
                onClick={() => removeContentBlock(blockIndex)}
                className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                aria-label="Remove block"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Input fields based on block type */}
              {block.type === "paragraph" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Paragraph Content
                  </label>
                  <textarea
                    rows="4"
                    value={block.value}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter paragraph text..."
                  ></textarea>
                </div>
              )}

              {block.type === "heading" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Heading
                  </label>
                  <select
                    value={block.level}
                    onChange={(e) =>
                      updateContentBlock(
                        blockIndex,
                        "level",
                        parseInt(e.target.value)
                      )
                    }
                    className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={2}>Heading 2 (H2)</option>
                    <option value={3}>Heading 3 (H3)</option>
                    <option value={4}>Heading 4 (H4)</option>
                  </select>
                  <input
                    type="text"
                    value={block.value}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter heading text..."
                  />
                  <small className="text-foreground/70 text-sm mt-1 block">
                    Auto-generated ID (for Table of Contents): `#{block.id}`
                  </small>
                </div>
              )}

              {/* Styled Boxes (Info, Highlight, Warning) - share similar structure */}
              {(block.type === "infoBox" ||
                block.type === "highlightBox" ||
                block.type === "warningBox") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {block.type === "infoBox" && "Info Box (Gray)"}
                    {block.type === "highlightBox" && "Highlight Box (Blue)"}
                    {block.type === "warningBox" && "Warning Box (Red)"}
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="Enter title for the box..."
                  />
                  <textarea
                    rows="4"
                    value={block.value}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter content for the box..."
                  ></textarea>
                </div>
              )}

              {/* Primary Box (Call to Action) - can have nested paragraphs/links */}
              {block.type === "primaryBox" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Call to Action Box (Primary Color)
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="Enter title (e.g., Start Your AML Career with Titans Careers)..."
                  />
                  {/* Nested content items */}
                  {block.value.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col gap-2 mb-2 p-3 border border-gray-200 rounded-md bg-gray-50"
                    >
                      <label className="block text-sm font-medium text-foreground/80">
                        Item {itemIndex + 1}
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateNestedContentItem(
                            blockIndex,
                            itemIndex,
                            "type",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="link">Link (Button Style)</option>
                      </select>
                      {item.type === "paragraph" && (
                        <textarea
                          rows="2"
                          value={item.value}
                          onChange={(e) =>
                            updateNestedContentItem(
                              blockIndex,
                              itemIndex,
                              "value",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter paragraph text..."
                        />
                      )}
                      {item.type === "link" && (
                        <>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) =>
                              updateNestedContentItem(
                                blockIndex,
                                itemIndex,
                                "text",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Link Button Text (e.g., Enroll in Our Training)"
                          />
                          <input
                            type="url"
                            value={item.href}
                            onChange={(e) =>
                              updateNestedContentItem(
                                blockIndex,
                                itemIndex,
                                "href",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Link URL (e.g., /courses)"
                          />
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          removeNestedContentItem(blockIndex, itemIndex)
                        }
                        className="self-end px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm transition-colors"
                        aria-label="Remove nested item"
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}
                  {/* Buttons to add nested items */}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        addNestedContentItem(blockIndex, "paragraph")
                      }
                      className="flex-grow px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm transition-colors"
                    >
                      Add Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => addNestedContentItem(blockIndex, "link")}
                      className="flex-grow px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm transition-colors"
                    >
                      Add Link (Button)
                    </button>
                  </div>
                </div>
              )}

              {/* Alert Box (Yellow Border) - can have nested paragraphs/list items */}
              {block.type === "alertBox" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Alert Box (Yellow Border, for stats/cases)
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="Enter title (e.g., By the Numbers: or Notable Cases:)..."
                  />
                  {/* Nested content items */}
                  {block.value.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateNestedContentItem(
                            blockIndex,
                            itemIndex,
                            "type",
                            e.target.value
                          )
                        }
                        className="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="paragraph">Paragraph</option>
                        <option value="listItem">List Item</option>
                      </select>
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          updateNestedContentItem(
                            blockIndex,
                            itemIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter item content..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeNestedContentItem(blockIndex, itemIndex)
                        }
                        className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        aria-label="Remove nested item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addNestedContentItem(blockIndex, "listItem")} // Default to listItem
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm mt-2 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              )}

              {/* List Block (Unordered) */}
              {block.type === "list" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    List Items (Unordered)
                  </label>
                  {block.value.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) =>
                          updateNestedContentItem(
                            blockIndex,
                            itemIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter list item content..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeNestedContentItem(blockIndex, itemIndex)
                        }
                        className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        aria-label="Remove list item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addNestedContentItem(blockIndex, "listItem")}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm mt-2 transition-colors"
                  >
                    Add List Item
                  </button>
                </div>
              )}

              {/* Image Block */}
              {block.type === "image" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Image
                  </label>
                  <input
                    type="url"
                    value={block.src}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "src", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                  />
                  <input
                    type="text"
                    value={block.alt}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "alt", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    placeholder="Alt text (for accessibility)"
                  />
                  <input
                    type="text"
                    value={block.caption}
                    onChange={(e) =>
                      updateContentBlock(blockIndex, "caption", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Caption (optional)"
                  />
                </div>
              )}
            </div>
          ))}

          {/* Buttons to Add New Content Blocks */}
          <div className="border border-dashed border-gray-300 p-4 rounded-md text-center bg-gray-100">
            <h3 className="text-lg font-medium text-foreground mb-4">
              Add New Content Block
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => addContentBlock("paragraph")}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
              >
                <FileText className="h-5 w-5" /> Paragraph
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("heading")}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
              >
                <Heading1 className="h-5 w-5" /> Heading
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("list")}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
              >
                <List className="h-5 w-5" /> List
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("image")}
                className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
              >
                <ImageIcon className="h-5 w-5" /> Image
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("infoBox")}
                className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow-sm"
              >
                <Info className="h-5 w-5" /> Info Box
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("highlightBox")}
                className="flex items-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors shadow-sm"
              >
                <Lightbulb className="h-5 w-5" /> Highlight Box
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("alertBox")}
                className="flex items-center gap-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors shadow-sm"
              >
                <AlertTriangle className="h-5 w-5" /> Alert Box
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("warningBox")}
                className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors shadow-sm"
              >
                <AlertTriangle className="h-5 w-5" /> Warning Box
              </button>
              <button
                type="button"
                onClick={() => addContentBlock("primaryBox")}
                className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors shadow-sm"
              >
                <Star className="h-5 w-5" /> Call to Action
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading} // Disable button while uploading
        >
          {isLoading ? "Uploading..." : "Upload Blog Post"}
        </button>
      </form>
    </div>
  );
}

export default AdminBlogUpload;
