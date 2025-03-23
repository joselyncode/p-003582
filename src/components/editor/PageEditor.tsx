
import React, { useState, useEffect, useRef } from "react";
import { TextBlock } from "./blocks/TextBlock";
import { BlockMenu } from "./BlockMenu";
import { Plus, Move } from "lucide-react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableBlock } from "./blocks/SortableBlock";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

type BlockType = "text" | "heading1" | "heading2" | "heading3" | "todo" | "bullet" | "numbered";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export function PageEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showMenuAtIndex, setShowMenuAtIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPageId, setCurrentPageId] = useState("default-page");
  const { toast } = useToast();
  
  // Use LocalStorage to persist blocks
  const [savedBlocks, setSavedBlocks] = useLocalStorage<{[key: string]: Block[]}>('notion-blocks', {});
  
  // Initialize blocks from localStorage or default blocks
  useEffect(() => {
    const loadedBlocks = savedBlocks[currentPageId];
    if (loadedBlocks && loadedBlocks.length > 0) {
      setBlocks(loadedBlocks);
    } else {
      // Default blocks for new pages
      setBlocks([
        { id: "1", type: "heading1", content: "Untitled" },
        { id: "2", type: "text", content: "Start writing..." },
      ]);
    }
  }, [currentPageId, savedBlocks]);

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blocks.length > 0) {
        setSavedBlocks({
          ...savedBlocks,
          [currentPageId]: blocks
        });
        console.log("Auto-saved content");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [blocks, currentPageId, savedBlocks, setSavedBlocks]);

  const handleBlockChange = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ));
  };

  const handleBlockFocus = (id: string) => {
    setFocusedBlockId(id);
  };

  const handleBlockBlur = () => {
    setFocusedBlockId(null);
  };

  const addBlock = (index: number, type: BlockType = "text") => {
    const newId = Date.now().toString();
    setBlocks([
      ...blocks.slice(0, index + 1),
      { id: newId, type, content: "" },
      ...blocks.slice(index + 1)
    ]);
    setShowMenuAtIndex(null);
    
    // Focus the new block after render
    setTimeout(() => {
      const element = document.getElementById(`block-${newId}`);
      if (element) {
        element.focus();
      }
    }, 100);
    
    toast({
      description: "New block added",
      duration: 1500,
    });
  };

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, type: newType } : block
    ));
    setShowMenuAtIndex(null);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(block => block.id !== id));
      toast({
        description: "Block deleted",
        duration: 1500,
      });
    }
  };
  
  // For drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      toast({
        description: "Block moved",
        duration: 1500,
      });
    }
    
    setIsDragging(false);
  };

  return (
    <div className="mb-20">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block, index) => (
            <div key={block.id} className="relative group">
              <SortableBlock id={block.id}>
                <div className="flex items-start group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 mt-1 cursor-move">
                    <Move className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex-grow">
                    <TextBlock 
                      block={block}
                      onChange={(content) => handleBlockChange(block.id, content)}
                      onFocus={() => handleBlockFocus(block.id)}
                      onBlur={handleBlockBlur}
                      onDelete={() => deleteBlock(block.id)}
                      changeType={(type) => changeBlockType(block.id, type)}
                    />
                  </div>
                </div>
              </SortableBlock>
              
              {/* Add button between blocks */}
              {!isDragging && (
                <div 
                  className="absolute left-0 -ml-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button 
                    onClick={() => setShowMenuAtIndex(index)} 
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Plus className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              )}
              
              {showMenuAtIndex === index && (
                <BlockMenu 
                  onSelect={(type) => addBlock(index, type)} 
                  onClose={() => setShowMenuAtIndex(null)}
                />
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
