
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/context/PagesContext";
import { MoreVertical, Copy, Trash2 } from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  onDuplicate?: (id: string) => void;
}

export function SortableBlock({ 
  block, 
  isActive,
  onSetActive,
  onUpdate,
  onTypeChange,
  onAddBlock,
  onDeleteBlock,
  onDuplicate
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      // Use the dedicated duplicate handler if provided
      onDuplicate(block.id);
    } else {
      // Create a duplicate block and add it after this one
      onAddBlock(block.type, block.id);
      
      // Since we can't directly access the newly created block's ID,
      // we need the parent component to handle the content duplication
      // This is a fallback mechanism if onDuplicate is not provided
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative py-1 px-1 rounded hover:bg-gray-50"
      data-block-id={block.id}
      onMouseEnter={() => setShowBlockMenu(true)}
      onMouseLeave={() => setShowBlockMenu(false)}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`cursor-text ${isActive ? 'bg-gray-50' : ''}`}
            onClick={() => onSetActive(block.id)}
          >
            {/* Block content renderer */}
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDeleteBlock(block.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Hover menu */}
      {showBlockMenu && (
        <div className="absolute right-2 top-2 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 rounded hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-40 p-1">
              <button 
                onClick={handleDuplicate}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 text-left"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              <button 
                onClick={() => onDeleteBlock(block.id)}
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 text-left"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
