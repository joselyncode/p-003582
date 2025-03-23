
import React, { useState, useEffect, useRef } from "react";
import { TextBlock } from "./blocks/TextBlock";
import { BlockMenu } from "./BlockMenu";
import { Plus, Move, Share, MessageSquare, Star, MoreHorizontal, Clock } from "lucide-react";
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableBlock } from "./blocks/SortableBlock";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ShareModal } from "../editor/ShareModal";
import { CommentsPanel } from "../editor/CommentsPanel";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type BlockType = "text" | "heading1" | "heading2" | "heading3" | "todo" | "bullet" | "numbered";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

interface PageData {
  blocks: Block[];
  lastEdited: number; // timestamp
  isFavorite: boolean;
}

export function PageEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showMenuAtIndex, setShowMenuAtIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPageId, setCurrentPageId] = useState("default-page");
  const [lastEdited, setLastEdited] = useState<number>(Date.now());
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const { toast } = useToast();
  
  // Use LocalStorage to persist blocks and metadata
  const [savedPages, setSavedPages] = useLocalStorage<{[key: string]: PageData}>('notion-pages', {});
  
  // Initialize blocks from localStorage or default blocks
  useEffect(() => {
    const pageData = savedPages[currentPageId];
    if (pageData && pageData.blocks && pageData.blocks.length > 0) {
      setBlocks(pageData.blocks);
      setLastEdited(pageData.lastEdited || Date.now());
      setIsFavorite(pageData.isFavorite || false);
    } else {
      // Default blocks for new pages
      setBlocks([
        { id: "1", type: "heading1", content: "Untitled" },
        { id: "2", type: "text", content: "Start writing..." },
      ]);
      setLastEdited(Date.now());
    }
  }, [currentPageId, savedPages]);

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blocks.length > 0) {
        const now = Date.now();
        setLastEdited(now);
        
        setSavedPages({
          ...savedPages,
          [currentPageId]: {
            blocks,
            lastEdited: now,
            isFavorite
          }
        });
        console.log("Auto-saved content");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [blocks, currentPageId, savedPages, setSavedPages, isFavorite]);

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
  
  // Toggle favorite status
  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    
    // Update in localStorage immediately
    setSavedPages({
      ...savedPages,
      [currentPageId]: {
        blocks,
        lastEdited,
        isFavorite: newState
      }
    });
    
    toast({
      description: newState ? "Añadido a favoritos" : "Eliminado de favoritos",
      duration: 1500,
    });
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

  // Format the last edited time
  const formatLastEdited = () => {
    return formatDistanceToNow(lastEdited, { addSuffix: true, locale: es });
  };

  // Page options menu actions
  const duplicatePage = () => {
    const newPageId = `${currentPageId}-copy-${Date.now()}`;
    setSavedPages({
      ...savedPages,
      [newPageId]: {
        blocks: blocks,
        lastEdited: Date.now(),
        isFavorite: false
      }
    });
    
    toast({
      description: "Página duplicada",
      duration: 1500,
    });
  };
  
  const deletePage = () => {
    // Don't delete the last page
    if (Object.keys(savedPages).length <= 1) {
      toast({
        description: "No se puede eliminar la única página",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }
    
    const newPages = { ...savedPages };
    delete newPages[currentPageId];
    setSavedPages(newPages);
    
    // Set current page to the first available
    const firstPageId = Object.keys(newPages)[0];
    setCurrentPageId(firstPageId);
    
    toast({
      description: "Página eliminada",
      duration: 1500,
    });
  };

  return (
    <div className="mb-20">
      {/* Editor header with buttons */}
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 py-2">
        <div className="text-sm text-gray-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Editado {formatLastEdited()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Share button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Compartir</span>
          </Button>
          
          {/* Comments button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={() => setIsCommentsPanelOpen(!isCommentsPanelOpen)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600"
            onClick={toggleFavorite}
          >
            <Star 
              className="h-4 w-4" 
              fill={isFavorite ? "gold" : "none"} 
              color={isFavorite ? "gold" : "currentColor"} 
            />
          </Button>
          
          {/* More options button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={duplicatePage}
                >
                  Duplicar página
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Mover a otra carpeta
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={deletePage}
                >
                  Eliminar página
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Editor content */}
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
      
      {/* Share Modal */}
      <ShareModal 
        open={isShareModalOpen} 
        onOpenChange={setIsShareModalOpen} 
        pageId={currentPageId}
      />
      
      {/* Comments Panel */}
      {isCommentsPanelOpen && (
        <CommentsPanel
          pageId={currentPageId}
          onClose={() => setIsCommentsPanelOpen(false)}
        />
      )}
    </div>
  );
}
