import React from "react";
import { Trash2 } from "lucide-react";

function ContentBlockEditor({
  block,
  blockIndex,
  updateContentBlock,
  removeContentBlock,
  addNestedContentItem,
  updateNestedContentItem,
  removeNestedContentItem,
}) {
  return (
    <div className="border border-gray-200 p-4 rounded-md relative bg-white shadow-sm">
      {/* Remove block button */}
      <button
        type="button"
        onClick={() => removeContentBlock(blockIndex)}
        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        aria-label="Remove block"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Paragraph Block */}
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

      {/* Heading Block */}
      {block.type === "heading" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1">
            Heading
          </label>
          <select
            value={block.level}
            onChange={(e) =>
              updateContentBlock(blockIndex, "level", parseInt(e.target.value))
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
            Auto-generated ID (for Table of Contents): #{block.id}
          </small>
        </div>
      )}

      {/* Simple Boxes (Info, Highlight, Warning) */}
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

      {/* Primary Box (Call to Action) */}
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
                onClick={() => removeNestedContentItem(blockIndex, itemIndex)}
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
              onClick={() => addNestedContentItem(blockIndex, "paragraph")}
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

      {/* Alert Box */}
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
            <div key={itemIndex} className="flex items-center gap-2 mb-2">
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
                onClick={() => removeNestedContentItem(blockIndex, itemIndex)}
                className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                aria-label="Remove nested item"
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
            Add Item
          </button>
        </div>
      )}

      {/* List Block */}
      {block.type === "list" && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1">
            List Items (Unordered)
          </label>
          {block.value.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center gap-2 mb-2">
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
                onClick={() => removeNestedContentItem(blockIndex, itemIndex)}
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
  );
}

export default ContentBlockEditor;
