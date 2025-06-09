import React, { useState, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "react-quill/dist/quill.snow.css";
import {
  Plus,
  Minus,
  Eye,
  Save,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  useCreateBlogMutation,
  useUploadBlogImageMutation,
} from "../services/blogsApi";

const AdminBlogUpload = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    author: "",
    authorRole: "",
    authorImage: "",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: "",
    tags: [],
    image: "",
    excerpt: "",
    content: "", // WYSIWYG content as HTML
    specialBlocks: [], // For special blocks like CTA, Table of Contents
  });

  const [newTag, setNewTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [contentMode, setContentMode] = useState("wysiwyg"); // 'wysiwyg' or 'blocks'

  // RTK Query mutations
  const [createBlog, { isLoading: isCreating, error: createError }] =
    useCreateBlogMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadBlogImageMutation();

  const specialBlockTypes = [
    { value: "tableOfContents", label: "Table of Contents" },
    { value: "cta", label: "Call to Action" },
    { value: "callout", label: "Callout Box" },
  ];

  const calloutStyles = [
    {
      value: "info",
      label: "Info (Blue)",
      class: "bg-blue-50 border-l-4 border-blue-500",
    },
    {
      value: "warning",
      label: "Warning (Yellow)",
      class: "bg-yellow-50 border-l-4 border-yellow-500",
    },
    {
      value: "danger",
      label: "Danger (Red)",
      class: "bg-red-50 border-l-4 border-red-500",
    },
    {
      value: "success",
      label: "Success (Green)",
      class: "bg-green-50 border-l-4 border-green-500",
    },
    { value: "neutral", label: "Neutral (Gray)", class: "bg-gray-100" },
  ];

  // ReactQuill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
  ];

  // Custom image handler for ReactQuill
  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadImage(formData).unwrap();

        // Get the Quill instance and insert the image
        const quill = this.quill;
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", result.url);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image. Please try again.");
      }
    };
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const addTag = () => {
    if (newTag.trim() && !blogData.tags.includes(newTag.trim())) {
      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addSpecialBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: "",
      style: type === "callout" ? "info" : undefined,
      title: type === "cta" ? "" : undefined,
      buttonText: type === "cta" ? "" : undefined,
      link: type === "cta" ? "" : undefined,
    };
    setBlogData((prev) => ({
      ...prev,
      specialBlocks: [...prev.specialBlocks, newBlock],
    }));
  };

  const updateSpecialBlock = (id, field, value) => {
    setBlogData((prev) => ({
      ...prev,
      specialBlocks: prev.specialBlocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      ),
    }));
  };

  const deleteSpecialBlock = (id) => {
    setBlogData((prev) => ({
      ...prev,
      specialBlocks: prev.specialBlocks.filter((block) => block.id !== id),
    }));
  };

  const handleSave = async (status = "draft") => {
    try {
      // Convert WYSIWYG content to content blocks format for backend
      const contentBlocks = [];

      // Add main WYSIWYG content as HTML block
      if (blogData.content) {
        contentBlocks.push({
          id: 1,
          type: "html",
          content: blogData.content,
        });
      }

      // Add special blocks
      blogData.specialBlocks.forEach((block, index) => {
        contentBlocks.push({
          id: index + 2,
          ...block,
        });
      });

      const blogPayload = {
        title: blogData.title,
        slug: blogData.slug || generateSlug(blogData.title),
        author: blogData.author,
        authorRole: blogData.authorRole,
        authorImage: blogData.authorImage,
        date: blogData.date,
        category: blogData.category,
        tags: blogData.tags,
        image: blogData.image,
        excerpt: blogData.excerpt,
        content: contentBlocks,
        status,
      };

      const result = await createBlog(blogPayload).unwrap();

      alert(
        `Blog ${
          status === "published" ? "published" : "saved as draft"
        } successfully!`
      );

      // Optionally redirect to the new blog post
      if (status === "published") {
        setTimeout(() => {
          window.location.href = `/blog/${result.slug}`;
        }, 2000);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save blog post. Please try again.");
    }
  };

  const renderSpecialBlock = (block, isPreview = false) => {
    switch (block.type) {
      case "tableOfContents":
        return isPreview ? (
          <div key={block.id} className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <p className="text-gray-500 italic">
              Table of contents will be auto-generated from headings in the main
              content.
            </p>
          </div>
        ) : (
          <div key={block.id} className="mb-4 p-4 border rounded-lg bg-blue-50">
            <label className="block text-sm font-medium mb-2">
              Table of Contents
            </label>
            <p className="text-blue-600 text-sm">
              This will automatically generate a table of contents from headings
              in your main content.
            </p>
          </div>
        );

      case "callout":
        const calloutStyle =
          calloutStyles.find((s) => s.value === block.style) ||
          calloutStyles[0];
        return isPreview ? (
          <div key={block.id} className={`${calloutStyle.class} p-6 mb-6`}>
            <p className="font-semibold text-gray-800">{block.content}</p>
          </div>
        ) : (
          <div key={block.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Callout Box</label>
              <button
                onClick={() => deleteSpecialBlock(block.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
            <select
              value={block.style}
              onChange={(e) =>
                updateSpecialBlock(block.id, "style", e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
            >
              {calloutStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <textarea
              value={block.content}
              onChange={(e) =>
                updateSpecialBlock(block.id, "content", e.target.value)
              }
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="Enter callout content..."
            />
          </div>
        );

      case "cta":
        return isPreview ? (
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
        ) : (
          <div key={block.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Call to Action
              </label>
              <button
                onClick={() => deleteSpecialBlock(block.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              value={block.title || ""}
              onChange={(e) =>
                updateSpecialBlock(block.id, "title", e.target.value)
              }
              className="w-full p-3 border rounded-md mb-2"
              placeholder="CTA Title..."
            />
            <textarea
              value={block.content}
              onChange={(e) =>
                updateSpecialBlock(block.id, "content", e.target.value)
              }
              className="w-full p-3 border rounded-md mb-2"
              rows="3"
              placeholder="CTA content..."
            />
            <input
              type="text"
              value={block.buttonText || ""}
              onChange={(e) =>
                updateSpecialBlock(block.id, "buttonText", e.target.value)
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Button text..."
            />
            <input
              type="url"
              value={block.link || ""}
              onChange={(e) =>
                updateSpecialBlock(block.id, "link", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="Button link..."
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (showPreview) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
          </button>
          <h1 className="text-2xl font-bold">Preview</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={blogData.image || "/placeholder.svg"}
              alt={blogData.title}
              className="w-full h-[400px] object-cover"
            />

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {blogData.category}
                </span>
                <span className="text-sm text-foreground/70">
                  {blogData.date}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {blogData.title}
              </h1>

              <div className="flex items-center mb-6 border-b border-foreground/10 pb-6">
                <img
                  src={blogData.authorImage || "/placeholder.svg"}
                  alt={blogData.author}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {blogData.author}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {blogData.authorRole}
                  </p>
                </div>
              </div>

              <div className="prose max-w-none">
                {/* Main WYSIWYG content */}
                {blogData.content && (
                  <div dangerouslySetInnerHTML={{ __html: blogData.content }} />
                )}

                {/* Special blocks */}
                {blogData.specialBlocks.map((block) =>
                  renderSpecialBlock(block, true)
                )}
              </div>

              {blogData.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-foreground/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Tags:</span>
                    {blogData.tags.map((tag, index) => (
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">
            Create New Blog Post
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Eye className="h-4 w-4 mr-2" /> Preview
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={isCreating}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" /> Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={isCreating}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" /> Publish
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {createError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-800">
                Error: {createError.data?.message || "Failed to save blog post"}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={blogData.title}
                onChange={(e) => {
                  setBlogData((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  }));
                }}
                className="w-full p-3 border rounded-md"
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={blogData.slug}
                onChange={(e) =>
                  setBlogData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full p-3 border rounded-md"
                placeholder="url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Author *</label>
              <input
                type="text"
                value={blogData.author}
                onChange={(e) =>
                  setBlogData((prev) => ({ ...prev, author: e.target.value }))
                }
                className="w-full p-3 border rounded-md"
                placeholder="Author name..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Author Role
              </label>
              <input
                type="text"
                value={blogData.authorRole}
                onChange={(e) =>
                  setBlogData((prev) => ({
                    ...prev,
                    authorRole: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-md"
                placeholder="Author role/title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={blogData.category}
                onChange={(e) =>
                  setBlogData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full p-3 border rounded-md"
                required
              >
                <option value="">Select category...</option>
                <option value="Compliance">Compliance</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Business Analysis">Business Analysis</option>
                <option value="Technology">Technology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setBlogData((prev) => ({
                    ...prev,
                    date: date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  }));
                }}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={blogData.image}
                onChange={(e) =>
                  setBlogData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full p-3 border rounded-md"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Author Image URL
              </label>
              <input
                type="url"
                value={blogData.authorImage}
                onChange={(e) =>
                  setBlogData((prev) => ({
                    ...prev,
                    authorImage: e.target.value,
                  }))
                }
                className="w-full p-3 border rounded-md"
                placeholder="https://example.com/author.jpg"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              value={blogData.excerpt}
              onChange={(e) =>
                setBlogData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="Brief description of the blog post..."
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                className="flex-1 p-3 border rounded-md mr-2"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className="px-4 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blogData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Main Content - WYSIWYG Editor */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Main Content *
            </label>
            <div className="border rounded-md">
              <Editor
                value={blogData.content}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                }}
                onEditorChange={(content) =>
                  setBlogData((prev) => ({ ...prev, content }))
                }
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Use the toolbar above to format your content. Click the image icon
              to upload images directly.
            </p>
          </div>

          {/* Special Blocks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Special Blocks</h3>
              <div className="flex flex-wrap gap-2">
                {specialBlockTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => addSpecialBlock(type.value)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                  >
                    + {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {blogData.specialBlocks.map((block) => renderSpecialBlock(block))}
            </div>

            {blogData.specialBlocks.length === 0 && (
              <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No special blocks added yet. Use the buttons above to add
                call-to-action boxes, callouts, or table of contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogUpload;
