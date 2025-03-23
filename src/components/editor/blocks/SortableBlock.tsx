
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/context/PagesContext";

export interface SortableBlockProps {
  id: string;
  block: Block;
  index: number;
  isActive: boolean;
  onSetActive: (id: string | null) => void;
  onUpdate: (id: string, content: string) => void;
  onTypeChange: (id: string, newType: Block['type']) => void;
  onAddBlock: (type: Block['type'], afterId: string) => void;
  onDeleteBlock: (id: string) => void;
}

export function SortableBlock({ 
  block, 
  isActive,
  onSetActive,
  onUpdate,
  onTypeChange,
  onAddBlock,
  onDeleteBlock
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="py-1 px-1 rounded hover:bg-gray-50"
    >
      <div
        className={`cursor-text ${isActive ? 'ring-2 ring-blue-200' : ''}`}
        onClick={() => onSetActive(block.id)}
      >
        {/* Placeholder for the actual block content renderer */}
        <div className="px-3 py-2">
          {block.type === "heading1" && (
            <h1 className="text-3xl font-bold" contentEditable={true} suppressContentEditableWarning={true}
              onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
              {block.content}
            </h1>
          )}
          {block.type === "heading2" && (
            <h2 className="text-2xl font-bold" contentEditable={true} suppressContentEditableWarning={true}
              onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
              {block.content}
            </h2>
          )}
          {block.type === "heading3" && (
            <h3 className="text-xl font-bold" contentEditable={true} suppressContentEditableWarning={true}
              onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
              {block.content}
            </h3>
          )}
          {block.type === "text" && (
            <p className="text-base" contentEditable={true} suppressContentEditableWarning={true}
              onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
              {block.content}
            </p>
          )}
          {block.type === "todo" && (
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <div contentEditable={true} suppressContentEditableWarning={true}
                onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
                {block.content}
              </div>
            </div>
          )}
          {block.type === "bullet" && (
            <div className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <div contentEditable={true} suppressContentEditableWarning={true}
                onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
                {block.content}
              </div>
            </div>
          )}
          {block.type === "numbered" && (
            <div className="flex items-start gap-2">
              <span className="mt-1">1.</span>
              <div contentEditable={true} suppressContentEditableWarning={true}
                onBlur={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}>
                {block.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
