"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "../../services/blogsApi";
import BlogDetailsForm from "../../components/BlogDetailsForm";
import DraggableContentBlock from "../../components/DraggableContentBlock";
import BlogPreview from "../../components/BlogPreview";

function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: blogData, isLoading, error } = useGetBlogByIdQuery(id);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  useEffect(() => {
    if (blogData) {
      setBlog(blogData);
    }
  }, [blogData]);

  // Content block management functions (same as AdminBlogUpload)
  const addContentBlock = (type) => {
    const blockId = Date.now().toString();
    let newBlock;

    if (type === "heading") {
      newBlock = {
        id: blockId,
        type: "heading",
        level: 2,
        headingId: "",
        value: "",
      };
    } else if (["infoBox", "highlightBox", "warningBox"].includes(type)) {
      newBlock = { id: blockId, type, title: "", value: "" };
    } else if (type === "primaryBox") {
      newBlock = { id: blockId, type: "primaryBox", title: "", value: [] };
    } else if (type === "alertBox") {
      newBlock = {
        id: blockId,
        type: "alertBox",
        title: "",
        value: [{ type: "paragraph", value: "" }],
      };
    } else if (type === "list") {
      newBlock = { id: blockId, type: "list", value: [{ value: "" }] };
    } else if (type === "image") {
      newBlock = { id: blockId, type: "image", src: "", alt: "", caption: "" };
    } else {
      newBlock = { id: blockId, type, value: "" };
    }
    setBlog((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (index, field, value) => {
    const updatedContent = [...blog.content];
    updatedContent[index] = { ...updatedContent[index], [field]: value };

    if (field === "value" && updatedContent[index].type === "heading") {
      updatedContent[index].headingId = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }
    setBlog((prev) => ({ ...prev, content: updatedContent }));
  };

  const removeContentBlock = (index) => {
    setBlog((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

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

  const moveContentBlock = (fromIndex, toIndex) => {
    const updatedContent = [...blog.content];
    const [movedBlock] = updatedContent.splice(fromIndex, 1);
    updatedContent.splice(toIndex, 0, movedBlock);
    setBlog((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!blog.title || !blog.slug || !blog.category || !blog.excerpt) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (blog.content.length === 0) {
      toast.error("Please add some content blocks to your blog post.");
      return;
    }

    try {
      await updateBlog({ id: blog.id, ...blog }).unwrap();
      toast.success("Blog updated successfully!");
      navigate("/admin/blog/list");
    } catch (err) {
      console.error("Blog update failed:", err);
      toast.error(err?.data?.message || "Failed to update blog");
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Error Loading Blog
        </h2>
        <p className="text-gray-600 mb-6">
          {error?.data?.message ||
            "The blog you're trying to edit doesn't exist or couldn't be loaded."}
        </p>
        <button
          onClick={() => navigate("/admin/blog/list")}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Blog List
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/blog/list")}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Make changes to your blog post</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            {isPreviewMode ? "Edit Mode" : "Preview"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        /* Preview Mode */
        <div className="max-w-4xl mx-auto">
          <BlogPreview blog={blog} />
        </div>
      ) : (
        /* Edit Mode */
        <form
          onSubmit={handleSubmit}
          className={`bg-white p-8 rounded-lg shadow-sm max-w-4xl mx-auto ${
            isUpdating ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <BlogDetailsForm
            blog={blog}
            setBlog={setBlog}
            disabled={isUpdating}
          />

          {/* Content Builder Section */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Blog Content Builder
            {isUpdating && (
              <span className="ml-2 text-sm text-gray-500">Saving...</span>
            )}
          </h2>

          <div className="space-y-6 mb-8 p-4 border border-gray-100 rounded-md bg-gray-50">
            {blog.content.map((block, blockIndex) => (
              <DraggableContentBlock
                key={block.id || `${blockIndex}-${block.type}`}
                block={block}
                blockIndex={blockIndex}
                updateContentBlock={updateContentBlock}
                removeContentBlock={removeContentBlock}
                addNestedContentItem={addNestedContentItem}
                updateNestedContentItem={updateNestedContentItem}
                removeNestedContentItem={removeNestedContentItem}
                moveContentBlock={moveContentBlock}
              />
            ))}

            {/* Add Content Block Buttons */}
            <div className="border border-dashed border-gray-300 p-4 rounded-md text-center bg-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Content Block
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { type: "paragraph", label: "Paragraph", icon: "📝" },
                  { type: "heading", label: "Heading", icon: "📰" },
                  { type: "list", label: "List", icon: "📋" },
                  { type: "image", label: "Image", icon: "🖼️" },
                  { type: "infoBox", label: "Info Box", icon: "ℹ️" },
                  { type: "highlightBox", label: "Highlight Box", icon: "💡" },
                  { type: "alertBox", label: "Alert Box", icon: "⚠️" },
                  { type: "warningBox", label: "Warning Box", icon: "🚨" },
                  { type: "primaryBox", label: "Call to Action", icon: "⭐" },
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addContentBlock(type)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminBlogEdit;
