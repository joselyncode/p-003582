
import React, { useState, useEffect, useRef } from "react";
import { TextBlock } from "./blocks/TextBlock";
import { BlockMenu } from "./BlockMenu";
import { 
  Plus, 
  Move, 
  Share, 
  MessageSquare, 
  Star, 
  MoreHorizontal, 
  Clock, 
  CircleDot, 
  Users, 
  MessageCircle, 
  Link2, 
  Plus as PlusIcon 
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface PageEditorProps {
  workspaceName?: string;
  pagePath?: string[];
}

export function PageEditor({ workspaceName = "Mi Workspace", pagePath = [] }: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showMenuAtIndex, setShowMenuAtIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPageId, setCurrentPageId] = useState("default-page");
  const [lastEdited, setLastEdited] = useState<number>(Date.now());
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);
  const [pageStatus, setPageStatus] = useState<string>("En progreso");
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

  // Handle Enter key press in a block to create a new block below it
  const handleEnterPress = (index: number) => {
    addBlock(index, "text");
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
    if (Date.now() - lastEdited < 60000) { // menos de 1 minuto
      return "justo ahora";
    }
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
  
  // Get the page title from the first heading1 block
  const getPageTitle = () => {
    const titleBlock = blocks.find(block => block.type === "heading1");
    return titleBlock ? titleBlock.content : "Untitled";
  };

  return (
    <div className="mb-20">
      {/* Notion-style header with breadcrumb */}
      <div className="flex flex-col space-y-2">
        {/* Top navigation bar - breadcrumb and actions */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/images/female-avatar.svg" alt="Avatar" />
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{workspaceName}</BreadcrumbLink>
                </BreadcrumbItem>
                {pagePath.map((path, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{path}</BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="font-medium">
                    {getPageTitle()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 mr-2">
              Editado {formatLastEdited()}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="text-gray-600"
            >
              <Share className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCommentsPanelOpen(!isCommentsPanelOpen)}
              className="text-gray-600"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className="text-gray-600"
            >
              <Star 
                className="h-4 w-4" 
                fill={isFavorite ? "gold" : "none"} 
                color={isFavorite ? "gold" : "currentColor"} 
              />
            </Button>
            
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
        
        {/* Property section (like in Notion) */}
        <div className="mt-10 mb-8">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <CircleDot className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pageStatus}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Assign</span>
              <span className="text-sm text-gray-500">Empty</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Comment</span>
              <span className="text-sm text-gray-500">Empty</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Related Links</span>
              <span className="text-sm text-gray-500">Empty</span>
            </div>
            
            <Button variant="outline" size="sm" className="ml-7 w-fit">
              <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
              Add a property
            </Button>
          </div>
          
          <Separator className="my-8" />
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
                      onEnterPress={() => handleEnterPress(index)}
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
