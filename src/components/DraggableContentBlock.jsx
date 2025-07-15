import React, { useState } from "react";
import { GripVertical } from "lucide-react";
import ContentBlockEditor from "./ContentBlockEditor";

function DraggableContentBlock({
  block,
  blockIndex,
  updateContentBlock,
  removeContentBlock,
  addNestedContentItem,
  updateNestedContentItem,
  removeNestedContentItem,
  moveContentBlock,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", blockIndex.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set to false if we're actually leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const targetIndex = blockIndex;
    
    if (draggedIndex !== targetIndex) {
      moveContentBlock(draggedIndex, targetIndex);
    }
  };

  return (
    <div
      className={`relative transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : "opacity-100 scale-100"
      } ${
        isDragOver && !isDragging ? "transform translate-y-1" : ""
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag Drop Indicator */}
      {isDragOver && !isDragging && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-10"></div>
      )}
      
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex-shrink-0 mt-4 p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Content Block Editor */}
        <div className="flex-grow">
          <ContentBlockEditor
            block={block}
            blockIndex={blockIndex}
            updateContentBlock={updateContentBlock}
            removeContentBlock={removeContentBlock}
            addNestedContentItem={addNestedContentItem}
            updateNestedContentItem={updateNestedContentItem}
            removeNestedContentItem={removeNestedContentItem}
          />
        </div>
      </div>
    </div>
  );
}

export default DraggableContentBlock;