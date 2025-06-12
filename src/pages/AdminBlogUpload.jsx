import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Eye,
  Save,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  GripVertical,
  Type,
  List,
  Hash,
  AlertTriangle,
  Megaphone,
  FileText,
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
    content: [], // Array of content blocks
  });

  const [newTag, setNewTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [errors, setErrors] = useState([]);

  // RTK Query mutations
  const [createBlog, { isLoading: isCreating, error: createError }] =
    useCreateBlogMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadBlogImageMutation();

  // Block type definitions
  const blockTypes = [
    { type: "paragraph", label: "Paragraph", icon: Type },
    { type: "heading2", label: "Heading 2", icon: Hash },
    { type: "heading3", label: "Heading 3", icon: Hash },
    { type: "heading4", label: "Heading 4", icon: Hash },
    { type: "list", label: "Bullet List", icon: List },
    { type: "numberedList", label: "Numbered List", icon: List },
    { type: "callout", label: "Callout", icon: AlertTriangle },
    { type: "example", label: "Example", icon: FileText },
    { type: "cta", label: "Call to Action", icon: Megaphone },
    { type: "tableOfContents", label: "Table of Contents", icon: FileText },
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

  // Auto-save draft functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (blogData.title || blogData.content.length > 0) {
        localStorage.setItem("blog_draft", JSON.stringify({
          ...blogData,
          lastSaved: new Date().toISOString(),
        }));
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [blogData]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem("blog_draft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (window.confirm("Found a saved draft. Would you like to restore it?")) {
          setBlogData(parsedDraft);
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  const generateAnchor = (content) => {
    return content
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  };

  const validateBlogPost = () => {
    const newErrors = [];

    if (!blogData.title?.trim()) newErrors.push("Title is required");
    if (!blogData.author?.trim()) newErrors.push("Author is required");
    if (!blogData.category?.trim()) newErrors.push("Category is required");
    if (!blogData.excerpt?.trim()) newErrors.push("Excerpt is required");
    if (!blogData.content?.length) newErrors.push("Content is required");

    // Validate content blocks
    blogData.content?.forEach((block, index) => {
      if (
        !block.content ||
        (Array.isArray(block.content) && block.content.length === 0)
      ) {
        newErrors.push(`Content block ${index + 1} is empty`);
      }
      if (
        block.type === "cta" &&
        (!block.title || !block.buttonText || !block.link)
      ) {
        newErrors.push(`CTA block ${index + 1} is missing required fields`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
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

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: type === "list" || type === "numberedList" ? [""] : "",
      style: type === "callout" ? "info" : undefined,
      anchor: type.includes("heading") ? "" : undefined,
      title: type === "cta" ? "" : undefined,
      buttonText: type === "cta" ? "" : undefined,
      link: type === "cta" ? "" : undefined,
    };

    setBlogData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateBlock = (id, field, value) => {
    setBlogData((prev) => ({
      ...prev,
      content: prev.content.map((block) => {
        if (block.id === id) {
          const updatedBlock = { ...block, [field]: value };
          // Auto-generate anchor for headings
          if (field === "content" && block.type.includes("heading")) {
            updatedBlock.anchor = generateAnchor(value);
          }
          return updatedBlock;
        }
        return block;
      }),
    }));
  };

  const deleteBlock = (id) => {
    setBlogData((prev) => ({
      ...prev,
      content: prev.content.filter((block) => block.id !== id),
    }));
  };

  const moveBlock = (dragIndex, hoverIndex) => {
    setBlogData((prev) => {
      const draggedItem = prev.content[dragIndex];
      const newContent = [...prev.content];
      newContent.splice(dragIndex, 1);
      newContent.splice(hoverIndex, 0, draggedItem);
      return { ...prev, content: newContent };
    });
  };

  const addListItem = (blockId) => {
    const block = blogData.content.find(b => b.id === blockId);
    updateBlock(blockId, "content", [...block.content, ""]);
  };

  const updateListItem = (blockId, itemIndex, value) => {
    const block = blogData.content.find(b => b.id === blockId);
    const newContent = [...block.content];
    newContent[itemIndex] = value;
    updateBlock(blockId, "content", newContent);
  };

  const removeListItem = (blockId, itemIndex) => {
    const block = blogData.content.find(b => b.id === blockId);
    const newContent = block.content.filter((_, index) => index !== itemIndex);
    updateBlock(blockId, "content", newContent);
  };

  const addListItem = (blockId) => {
    const block = blogData.content.find(b => b.id === blockId);
    updateBlock(blockId, "content", [...block.content, ""]);
  };

  const updateListItem = (blockId, itemIndex, value) => {
    const block = blogData.content.find(b => b.id === blockId);
    const newContent = [...block.content];
    newContent[itemIndex] = value;
    updateBlock(blockId, "content", newContent);
  };

  const removeListItem = (blockId, itemIndex) => {
    const block = blogData.content.find(b => b.id === blockId);
    const newContent = block.content.filter((_, index) => index !== itemIndex);
    updateBlock(blockId, "content", newContent);
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

  const renderBlockEditor = (block, index) => {
    const blockType = blockCategories.text.concat(blockCategories.lists, blockCategories.special)
      .find(bt => bt.type === block.type);
    const IconComponent = blockType?.icon || Type;

    return (
      <div
        key={block.id}
        className="mb-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => setDraggedBlock(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedBlock !== null) {
            moveBlock(draggedBlock, index);
            setDraggedBlock(null);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <IconComponent className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{blockType?.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => duplicateBlock(block.id)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Duplicate block"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteBlock(block.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Delete block"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Block-specific editors */}
        {block.type === "paragraph" && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
            className="w-full p-3 border rounded-md min-h-[120px] resize-vertical"
            placeholder="Enter paragraph content..."
          />
        )}

        {block.type.includes("heading") && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md font-semibold"
              placeholder={`Enter ${blockType?.label.toLowerCase()} text...`}
            />
            <input
              type="text"
              value={block.anchor || ""}
              onChange={(e) => updateBlock(block.id, "anchor", e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Anchor (auto-generated from heading)"
            />
          </div>
        )}

        {(block.type === "list" || block.type === "numberedList") && (
          <div className="space-y-2">
            {block.content.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(block.id, itemIndex, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder={`List item ${itemIndex + 1}...`}
                />
                <button
                  onClick={() => removeListItem(block.id, itemIndex)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem(block.id)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <Plus className="h-3 w-3 mr-1" /> Add item
            </button>
          </div>
        )}

        {block.type === "callout" && (
          <div className="space-y-2">
            <select
              value={block.style}
              onChange={(e) => updateBlock(block.id, "style", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {calloutStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="Enter callout content..."
            />
          </div>
        )}

        {block.type === "example" && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
            className="w-full p-3 border rounded-md bg-yellow-50"
            rows="3"
            placeholder="Enter example content..."
          />
        )}

        {block.type === "cta" && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.title || ""}
              onChange={(e) => updateBlock(block.id, "title", e.target.value)}
              className="w-full p-3 border rounded-md font-semibold"
              placeholder="CTA Title..."
            />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="CTA content..."
            />
            <input
              type="text"
              value={block.buttonText || ""}
              onChange={(e) => updateBlock(block.id, "buttonText", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Button text..."
            />
            <input
              type="url"
              value={block.link || ""}
              onChange={(e) => updateBlock(block.id, "link", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Button link..."
            />
          </div>
        )}

        {block.type === "tableOfContents" && (
          <div className="p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <p className="text-gray-600 text-sm italic">
              Table of contents will be auto-generated from headings in your content.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBlockPreview = (block) => {
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
            {block.content.filter(item => item.trim()).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

      case "numberedList":
        return (
          <ol key={block.id} className="list-decimal pl-6 mb-6 space-y-2">
            {block.content.filter(item => item.trim()).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );

      case "callout": {
        const calloutStyle = calloutStyles.find((s) => s.value === block.style) || calloutStyles[0];
        return (
          <div key={block.id} className={`${calloutStyle.class} p-6 mb-6`}>
            <p className="font-semibold text-gray-800">{block.content}</p>
          </div>
        );
      }

      case "example":
        return (
          <div key={block.id} className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Example:</h3>
            <p>{block.content}</p>
          </div>
        );

      case "tableOfContents": {
        const headings = blogData.content.filter(b => 
          b.type.includes("heading") && b.content && b.anchor
        );
        return (
          <div key={block.id} className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-6 space-y-2">
              {headings.map((heading, index) => (
                <li key={index}>
                  <a
                    href={`#${heading.anchor}`}
                    className="text-primary hover:underline"
                  >
                    {heading.content}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        );
      }

      case "cta":
        return (
          <div key={block.id} className="bg-primary text-white p-8 rounded-lg mb-8">
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
                  <p className="font-medium text-foreground">{blogData.author}</p>
                  <p className="text-sm text-foreground/70">{blogData.authorRole}</p>
                </div>
              </div>

              <div className="prose max-w-none">
                {blogData.content.map((block) => renderBlockPreview(block))}
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

  const handleSave = async (status = "draft") => {
    if (!validateBlogPost()) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    try {
      // Convert blocks to backend format
      const contentBlocks = blogData.content.map((block, index) => ({
        id: index + 1,
        type: block.type,
        content: block.content,
        style: block.style,
        anchor: block.anchor,
        title: block.title,
        buttonText: block.buttonText,
        link: block.link,
      }));

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

      // Clear draft on successful save
      localStorage.removeItem("blog_draft");

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

  const renderBlockEditor = (block, index) => {
    const blockType = blockTypes.find(bt => bt.type === block.type);
    const IconComponent = blockType?.icon || Type;

    return (
      <div
        key={block.id}
        className="mb-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => setDraggedBlock(index)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          if (draggedBlock !== null) {
            moveBlock(draggedBlock, index);
            setDraggedBlock(null);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <IconComponent className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{blockType?.label}</span>
          </div>
          <button
            onClick={() => deleteBlock(block.id)}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Block-specific editors */}
        {block.type === "paragraph" && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
            className="w-full p-3 border rounded-md min-h-[120px] resize-vertical"
            placeholder="Enter paragraph content..."
          />
        )}

        {block.type.includes("heading") && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md font-semibold"
              placeholder={`Enter ${blockType.label.toLowerCase()} text...`}
            />
            <input
              type="text"
              value={block.anchor || ""}
              onChange={(e) => updateBlock(block.id, "anchor", e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Anchor (auto-generated from heading)"
            />
          </div>
        )}

        {(block.type === "list" || block.type === "numberedList") && (
          <div className="space-y-2">
            {block.content.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(block.id, itemIndex, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                  placeholder={`List item ${itemIndex + 1}...`}
                />
                <button
                  onClick={() => removeListItem(block.id, itemIndex)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem(block.id)}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <Plus className="h-3 w-3 mr-1" /> Add item
            </button>
          </div>
        )}

        {block.type === "callout" && (
          <div className="space-y-2">
            <select
              value={block.style}
              onChange={(e) => updateBlock(block.id, "style", e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {calloutStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="Enter callout content..."
            />
          </div>
        )}

        {block.type === "example" && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, "content", e.target.value)}
            className="w-full p-3 border rounded-md bg-yellow-50"
            rows="3"
            placeholder="Enter example content..."
          />
        )}

        {block.type === "cta" && (
          <div className="space-y-2">
            <input
              type="text"
              value={block.title || ""}
              onChange={(e) => updateBlock(block.id, "title", e.target.value)}
              className="w-full p-3 border rounded-md font-semibold"
              placeholder="CTA Title..."
            />
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, "content", e.target.value)}
              className="w-full p-3 border rounded-md"
              rows="3"
              placeholder="CTA content..."
            />
            <input
              type="text"
              value={block.buttonText || ""}
              onChange={(e) => updateBlock(block.id, "buttonText", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Button text..."
            />
            <input
              type="url"
              value={block.link || ""}
              onChange={(e) => updateBlock(block.id, "link", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Button link..."
            />
          </div>
        )}

        {block.type === "tableOfContents" && (
          <div className="p-3 bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <p className="text-gray-600 text-sm italic">
              Table of contents will be auto-generated from headings in your content.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderBlockPreview = (block) => {
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
            {block.content.filter(item => item.trim()).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

      case "numberedList":
        return (
          <ol key={block.id} className="list-decimal pl-6 mb-6 space-y-2">
            {block.content.filter(item => item.trim()).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );

      case "callout": {
        const calloutStyle = calloutStyles.find((s) => s.value === block.style) || calloutStyles[0];
        return (
          <div key={block.id} className={`${calloutStyle.class} p-6 mb-6`}>
            <p className="font-semibold text-gray-800">{block.content}</p>
          </div>
        );
      }

      case "example":
        return (
          <div key={block.id} className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Example:</h3>
            <p>{block.content}</p>
          </div>
        );

      case "tableOfContents":
        const headings = blogData.content.filter(b => 
          b.type.includes("heading") && b.content && b.anchor
        );
        return (
          <div key={block.id} className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ol className="list-decimal pl-6 space-y-2">
              {headings.map((heading, index) => (
                <li key={index}>
                  <a
                    href={`#${heading.anchor}`}
                    className="text-primary hover:underline"
                  >
                    {heading.content}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        );

      case "cta":
        return (
          <div key={block.id} className="bg-primary text-white p-8 rounded-lg mb-8">
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
                  <p className="font-medium text-foreground">{blogData.author}</p>
                  <p className="text-sm text-foreground/70">{blogData.authorRole}</p>
                </div>
              </div>

              <div className="prose max-w-none">
                {blogData.content.map((block) => renderBlockPreview(block))}
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
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Please fix the following errors:</span>
              <ul className="mt-2 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {createError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error: {createError.data?.message || "Failed to save blog post"}
            </AlertDescription>
          </Alert>
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
              <label className="block text-sm font-medium mb-2">Category *</label>
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

          {/* Content Blocks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Content Blocks</h3>
              <div className="flex flex-wrap gap-2">
                {blockTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => addBlock(type.type)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    <type.icon className="h-3 w-3 mr-1" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {blogData.content.map((block, index) => renderBlockEditor(block, index))}
            </div>

            {blogData.content.length === 0 && (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No content blocks yet</h3>
                <p className="mb-4">Start building your blog post by adding content blocks above.</p>
                <button
                  onClick={() => addBlock('paragraph')}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Add Your First Paragraph
                </button>
              </div>
            )}
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with enhanced controls */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Create New Blog Post</h1>
          
          <div className="flex items-center gap-4">
            {/* Auto-save indicator */}
            <div className="flex items-center text-sm text-gray-600">
              {isAutoSaving ? (
                <span className="flex items-center">
                  <div className="animate-spin h-3 w-3 border border-blue-500 border-t-transparent rounded-full mr-1"></div>
                  Saving...
                </span>
              ) : lastSaved ? (
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              ) : null}
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-1">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                title="Redo (Ctrl+Y)"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>

            {/* Templates */}
            <div className="relative group">
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Templates
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                {Object.keys(contentTemplates).map(template => (
                  <button
                    key={template}
                    onClick={() => loadTemplate(template)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-50 capitalize"
                  >
                    {template.charAt(0).toUpperCase() + template.slice(1)} Template
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              title="Preview (Ctrl+P)"
            >
              <Eye className="h-4 w-4 mr-2" /> Preview
            </button>
            
            <button
              onClick={() => handleSave("draft")}
              disabled={isCreating}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              title="Save Draft (Ctrl+S)"
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
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Please fix the following errors:</span>
              <ul className="mt-2 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {createError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error: {createError.data?.message || "Failed to save blog post"}
            </AlertDescription>
          </Alert>
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
              <label className="block text-sm font-medium mb-2">Category *</label>
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

          {/* Content Blocks */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Content Blocks</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(blockCategories).map(([categoryName, blocks]) => (
                  <div key={categoryName} className="flex gap-1">
                    {blocks.map((type) => (
                      <button
                        key={type.type}
                        onClick={() => addBlock(type.type)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                        title={`Add ${type.label}`}
                      >
                        <type.icon className="h-3 w-3 mr-1" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {blogData.content.map((block, index) => renderBlockEditor(block, index))}
            </div>

            {blogData.content.length === 0 && (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No content blocks yet</h3>
                <p className="mb-4">Start building your blog post by adding content blocks above.</p>
                <button
                  onClick={() => addBlock('paragraph')}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Add Your First Paragraph
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Replace Current Content?</AlertDialogTitle>
              <AlertDialogDescription>
                This will replace your current content. Any unsaved changes will be lost. 
                Are you sure you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAction}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminBlogUpload;