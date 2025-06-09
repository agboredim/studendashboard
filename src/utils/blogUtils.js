/**
 * Generate URL-friendly slug from title
 * @param {string} title - Blog post title
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-"); // Remove leading/trailing hyphens
};

/**
 * Calculate reading time for blog post
 * @param {string|Array} content - Blog content (string or content blocks array)
 * @returns {number} - Estimated reading time in minutes
 */
export const calculateReadingTime = (content) => {
  let wordCount = 0;

  if (typeof content === "string") {
    // For static posts with HTML content
    const textContent = content.replace(/<[^>]*>/g, ""); // Strip HTML
    wordCount = textContent.split(/\s+/).length;
  } else if (Array.isArray(content)) {
    // For dynamic posts with content blocks
    content.forEach((block) => {
      if (block.type === "paragraph" || block.type.includes("heading")) {
        wordCount += block.content.split(/\s+/).length;
      } else if (block.type === "list" || block.type === "numberedList") {
        block.content.forEach((item) => {
          wordCount += item.split(/\s+/).length;
        });
      } else if (block.type === "callout" || block.type === "cta") {
        wordCount += block.content.split(/\s+/).length;
        if (block.title) wordCount += block.title.split(/\s+/).length;
      }
    });
  }

  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Extract plain text from content blocks for search indexing
 * @param {Array} contentBlocks - Array of content blocks
 * @returns {string} - Plain text content
 */
export const extractTextFromBlocks = (contentBlocks) => {
  return contentBlocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "heading2":
        case "heading3":
        case "heading4":
        case "callout":
          return block.content;
        case "list":
        case "numberedList":
          return block.content.join(" ");
        case "cta":
          return `${block.title || ""} ${block.content || ""}`.trim();
        default:
          return "";
      }
    })
    .join(" ");
};

/**
 * Validate blog post data before submission
 * @param {Object} blogData - Blog post data
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateBlogPost = (blogData) => {
  const errors = [];

  // Required fields
  if (!blogData.title?.trim()) errors.push("Title is required");
  if (!blogData.author?.trim()) errors.push("Author is required");
  if (!blogData.category?.trim()) errors.push("Category is required");
  if (!blogData.excerpt?.trim()) errors.push("Excerpt is required");
  if (!blogData.content?.length) errors.push("Content is required");

  // Validate slug
  if (blogData.slug && !/^[a-z0-9-]+$/.test(blogData.slug)) {
    errors.push(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  }

  // Validate URLs
  const urlPattern = /^https?:\/\/.+/;
  if (blogData.image && !urlPattern.test(blogData.image)) {
    errors.push("Featured image must be a valid URL");
  }
  if (blogData.authorImage && !urlPattern.test(blogData.authorImage)) {
    errors.push("Author image must be a valid URL");
  }

  // Validate content blocks
  blogData.content?.forEach((block, index) => {
    if (
      !block.content ||
      (Array.isArray(block.content) && block.content.length === 0)
    ) {
      errors.push(`Content block ${index + 1} is empty`);
    }
    if (
      block.type === "cta" &&
      (!block.title || !block.buttonText || !block.link)
    ) {
      errors.push(`CTA block ${index + 1} is missing required fields`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generate table of contents from content blocks
 * @param {Array} contentBlocks - Array of content blocks
 * @returns {Array} - Table of contents entries
 */
export const generateTableOfContents = (contentBlocks) => {
  return contentBlocks
    .filter(
      (block) =>
        (block.type === "heading2" ||
          block.type === "heading3" ||
          block.type === "heading4") &&
        block.anchor
    )
    .map((block) => ({
      title: block.content,
      anchor: block.anchor,
      level: parseInt(block.type.replace("heading", "")),
    }));
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get related posts based on category and tags
 * @param {Object} currentPost - Current blog post
 * @param {Array} allPosts - All available posts
 * @param {number} limit - Maximum number of related posts
 * @returns {Array} - Related posts
 */
export const getRelatedPosts = (currentPost, allPosts, limit = 3) => {
  if (!currentPost || !allPosts) return [];

  const scorePosts = allPosts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      let score = 0;

      // Same category gets higher score
      if (post.category === currentPost.category) score += 3;

      // Shared tags get points
      const sharedTags =
        post.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
      score += sharedTags;

      // Same author gets a point
      if (post.author === currentPost.author) score += 1;

      return { ...post, score };
    })
    .filter((post) => post.score > 0)
    .sort((a, b) => b.score - a.score);

  return scorePosts.slice(0, limit);
};

/**
 * Convert legacy blog post to new format
 * @param {Object} legacyPost - Legacy blog post with content() function
 * @returns {Object} - New format blog post
 */
export const convertLegacyPost = (legacyPost) => {
  // This is for converting existing static posts if needed
  return {
    ...legacyPost,
    content: [
      {
        id: 1,
        type: "paragraph",
        content: "Legacy content - needs manual conversion",
      },
    ],
    isDynamic: false,
    legacyContent: legacyPost.content, // Keep original for fallback
  };
};

/**
 * Local storage utilities for draft management
 */
export const draftStorage = {
  save: (draftData) => {
    try {
      localStorage.setItem(
        "blog_draft",
        JSON.stringify({
          ...draftData,
          lastSaved: new Date().toISOString(),
        })
      );
      return true;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return false;
    }
  },

  load: () => {
    try {
      const draft = localStorage.getItem("blog_draft");
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem("blog_draft");
      return true;
    } catch (error) {
      console.error("Failed to clear draft:", error);
      return false;
    }
  },

  exists: () => {
    return localStorage.getItem("blog_draft") !== null;
  },
};

/**
 * SEO utilities
 */
export const seoUtils = {
  generateMetaDescription: (excerpt, maxLength = 160) => {
    if (excerpt.length <= maxLength) return excerpt;
    return excerpt.substring(0, maxLength - 3) + "...";
  },

  generateKeywords: (title, tags, category) => {
    const keywords = new Set();

    // Add category
    keywords.add(category.toLowerCase());

    // Add tags
    tags.forEach((tag) => keywords.add(tag.toLowerCase()));

    // Extract keywords from title
    title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .forEach((word) => keywords.add(word));

    return Array.from(keywords).join(", ");
  },

  generateStructuredData: (blogPost) => {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blogPost.title,
      description: blogPost.excerpt,
      image: blogPost.image,
      author: {
        "@type": "Person",
        name: blogPost.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Titans Careers",
        logo: {
          "@type": "ImageObject",
          url: "https://yoursite.com/logo.png",
        },
      },
      datePublished: blogPost.publishedAt || blogPost.date,
      dateModified: blogPost.updatedAt || blogPost.date,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://yoursite.com/blog/${blogPost.slug}`,
      },
    };
  },
};

/**
 * Content analysis utilities
 */
export const contentAnalysis = {
  getWordCount: (contentBlocks) => {
    return extractTextFromBlocks(contentBlocks).split(/\s+/).length;
  },

  getReadabilityScore: (contentBlocks) => {
    const text = extractTextFromBlocks(contentBlocks);
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;

    // Simple readability assessment
    if (avgWordsPerSentence > 20) return "difficult";
    if (avgWordsPerSentence > 15) return "moderate";
    return "easy";
  },

  getSentimentScore: (contentBlocks) => {
    // Basic sentiment analysis - could be enhanced with external library
    const text = extractTextFromBlocks(contentBlocks).toLowerCase();
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "fantastic",
      "wonderful",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "worse",
      "difficult",
    ];

    let score = 0;
    positiveWords.forEach((word) => {
      score += (text.match(new RegExp(word, "g")) || []).length;
    });
    negativeWords.forEach((word) => {
      score -= (text.match(new RegExp(word, "g")) || []).length;
    });

    return score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
  },
};

/**
 * Export utilities for backup/migration
 */
export const exportUtils = {
  exportToMarkdown: (blogPost) => {
    let markdown = `# ${blogPost.title}\n\n`;
    markdown += `**Author:** ${blogPost.author}\n`;
    markdown += `**Date:** ${blogPost.date}\n`;
    markdown += `**Category:** ${blogPost.category}\n`;
    markdown += `**Tags:** ${blogPost.tags.join(", ")}\n\n`;
    markdown += `${blogPost.excerpt}\n\n`;

    blogPost.content.forEach((block) => {
      switch (block.type) {
        case "heading2":
          markdown += `## ${block.content}\n\n`;
          break;
        case "heading3":
          markdown += `### ${block.content}\n\n`;
          break;
        case "heading4":
          markdown += `#### ${block.content}\n\n`;
          break;
        case "paragraph":
          markdown += `${block.content}\n\n`;
          break;
        case "list":
          block.content.forEach((item) => {
            markdown += `- ${item}\n`;
          });
          markdown += "\n";
          break;
        case "numberedList":
          block.content.forEach((item, index) => {
            markdown += `${index + 1}. ${item}\n`;
          });
          markdown += "\n";
          break;
        case "callout":
          markdown += `> **${block.style.toUpperCase()}:** ${
            block.content
          }\n\n`;
          break;
        case "cta":
          markdown += `**${block.title}**\n\n${block.content}\n\n[${block.buttonText}](${block.link})\n\n`;
          break;
      }
    });

    return markdown;
  },

  exportToJSON: (blogPost) => {
    return JSON.stringify(blogPost, null, 2);
  },

  exportToCSV: (blogPosts) => {
    const headers = [
      "Title",
      "Author",
      "Date",
      "Category",
      "Tags",
      "Excerpt",
      "Word Count",
    ];
    const rows = blogPosts.map((post) => [
      post.title,
      post.author,
      post.date,
      post.category,
      post.tags.join("; "),
      post.excerpt,
      contentAnalysis.getWordCount(post.content),
    ]);

    return [headers, ...rows]
      .map((row) =>
        row
          .map((field) => `"${field.toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
  },
};

// Example usage in components:

/*
// In AdminBlogUpload.jsx
import { validateBlogPost, generateSlug, draftStorage } from '../utils/blogUtils';

const handleSave = () => {
  const validation = validateBlogPost(blogData);
  if (!validation.isValid) {
    alert('Please fix the following errors:\n' + validation.errors.join('\n'));
    return;
  }
  
  // Save to backend...
};

// Auto-save draft
useEffect(() => {
  const interval = setInterval(() => {
    if (blogData.title || blogData.content.length > 0) {
      draftStorage.save(blogData);
    }
  }, 30000); // Save every 30 seconds
  
  return () => clearInterval(interval);
}, [blogData]);

// In BlogPage.jsx
import { debounce, getRelatedPosts } from '../utils/blogUtils';

const debouncedSearch = debounce((term) => {
  // Perform search
}, 300);

// In BlogPostPage.jsx
import { calculateReadingTime, generateTableOfContents } from '../utils/blogUtils';

const readingTime = calculateReadingTime(post.content);
const tableOfContents = generateTableOfContents(post.content);
*/
