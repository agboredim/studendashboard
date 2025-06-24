import React, { useState, useEffect } from "react";
import { useCreateBlogMutation } from "../services/blogsApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BlogDetailsForm from "../components/BlogDetailsForm";
import ContentBlockEditor from "../components/ContentBlockEditor";
import BlogPreview from "../components/BlogPreview";
import {
  Plus,
  Heading1,
  FileText,
  Info,
  Lightbulb,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  List,
  Eye,
  Edit3,
} from "lucide-react";

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
  const [isPreviewMode, setIsPreviewMode] = useState(false);
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
    if (e && e.preventDefault) {
      e.preventDefault();
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Upload New Blog Post
        </h1>
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {isPreviewMode ? (
            <>
              <Edit3 className="h-5 w-5" />
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" />
              Preview Mode
            </>
          )}
        </button>
      </div>
      {isPreviewMode ? (
        <div className="max-w-4xl mx-auto">
          <BlogPreview blog={blog} />
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Blog Post"}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          {/* Use the new BlogDetailsForm component */}
          <BlogDetailsForm blog={blog} setBlog={setBlog} />

          {/* Content Builder Section */}
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Blog Content Builder
          </h2>
          <div className="space-y-6 mb-8 p-4 border border-gray-100 rounded-md bg-gray-50">
            {/* Render each content block dynamically */}
            {blog.content.map((block, blockIndex) => (
              <ContentBlockEditor
                key={blockIndex}
                block={block}
                blockIndex={blockIndex}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
                addNestedContentItem={addNestedContentItem}
                updateNestedContentItem={updateNestedContentItem}
                removeNestedContentItem={removeNestedContentItem}
              />
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
      )}
    </div>
  );
}

export default AdminBlogUpload;
