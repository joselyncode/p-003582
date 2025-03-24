import React, { useState, useCallback, useEffect } from 'react';
import { SortableBlock } from './blocks/SortableBlock';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, DragEndEvent, 
  PointerSensor, KeyboardSensor, useSensor, useSensors, 
  closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, 
  verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BlockMenu } from './BlockMenu';
import { ShareModal } from './ShareModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommentsPanel } from './CommentsPanel';
import { ChevronRight, MessageSquare } from 'lucide-react';
import { Block } from '@/context/PagesContext';

interface PageEditorProps {
  workspaceName: string;
  pagePath: string[];
  blocks?: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
  lastSaved?: number;
}

export function PageEditor({ 
  workspaceName, 
  pagePath, 
  blocks: initialBlocks,
  onBlocksChange,
  lastSaved 
}: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks || [
    {
      id: "1",
      type: "heading1",
      content: "Untitled"
    }
  ]);
  
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ top: 0, left: 0 });
  const [temporaryPageId, setTemporaryPageId] = useState<string>(uuidv4());

  useEffect(() => {
    if (initialBlocks) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Notify parent of the change
        if (onBlocksChange) {
          onBlocksChange(newItems);
        }
        
        return newItems;
      });
    }
  };

  const handleBlockUpdate = (id: string, content: string) => {
    setBlocks(prev => {
      const newBlocks = prev.map(block => 
        block.id === id ? { ...block, content } : block
      );
      
      // Notify parent of the change
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
  };
  
  const handleBlockTypeChange = (id: string, newType: Block['type']) => {
    setBlocks(prev => {
      const newBlocks = prev.map(block => 
        block.id === id ? { ...block, type: newType } : block
      );
      
      // Notify parent of the change
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
  };

  const handleAddBlock = (type: Block['type'], afterId: string) => {
    const newBlockId = uuidv4();
    const newBlock: Block = {
      id: newBlockId,
      type,
      content: ""
    };
    
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === afterId);
      const newBlocks = [
        ...prev.slice(0, index + 1),
        newBlock,
        ...prev.slice(index + 1)
      ];
      
      // Notify parent of the change
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
    
    // Focus the new block
    setTimeout(() => {
      setActiveBlockId(newBlockId);
    }, 100);
    
    // Hide the block menu
    setShowBlockMenu(false);

    return newBlockId;
  };

  const handleDuplicateBlock = (id: string) => {
    // Find the block to duplicate
    const blockToDuplicate = blocks.find(block => block.id === id);
    if (!blockToDuplicate) return;
    
    // Create a new block with the same type and content
    const newBlockId = uuidv4();
    const newBlock: Block = {
      id: newBlockId,
      type: blockToDuplicate.type,
      content: blockToDuplicate.content
    };
    
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === id);
      const newBlocks = [
        ...prev.slice(0, index + 1),
        newBlock,
        ...prev.slice(index + 1)
      ];
      
      // Notify parent of the change
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
    
    // Focus the new block
    setTimeout(() => {
      setActiveBlockId(newBlockId);
    }, 100);
  };

  const handleDeleteBlock = (id: string) => {
    // Prevent deleting all blocks
    if (blocks.length <= 1) {
      return;
    }
    
    setBlocks(prev => {
      const newBlocks = prev.filter(block => block.id !== id);
      
      // Notify parent of the change
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
  };

  const formatLastSaved = useCallback(() => {
    if (!lastSaved) return "Not saved yet";
    
    const now = new Date();
    const saved = new Date(lastSaved);
    
    // If less than a minute ago
    const diffInSeconds = Math.floor((now.getTime() - saved.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Saved just now";
    }
    
    // If less than an hour ago
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Saved ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Format as time
    return `Saved at ${saved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }, [lastSaved]);
  
  const showBlockMenuAt = (afterId: string) => {
    const blockElement = document.getElementById(`block-${afterId}`);
    
    if (blockElement) {
      const rect = blockElement.getBoundingClientRect();
      setBlockMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + 20
      });
    }
    
    setShowBlockMenu(true);
  };

  return (
    <div className="editor-container">
      {/* Page header with breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <span>{workspaceName}</span>
          {pagePath.map((item, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {/* This is just a placeholder - in a real app, the first h1 block would be the title */}
            <h1 className="text-3xl font-bold">
              {blocks.find(b => b.type === "heading1")?.content || "Untitled"}
            </h1>
            <div className="flex gap-2 items-center mt-1 text-xs text-muted-foreground">
              <span>{formatLastSaved()}</span>
              <Badge variant="outline" className="text-xs">Draft</Badge>
            </div>
          </div>
          
          <div className="flex gap-2 md:hidden">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowComments(!showComments)}
              data-comments-toggle
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
            </Button>
          </div>
        </div>
      </div>

      {/* Editor blocks */}
      <div className="editor-blocks relative min-h-[70vh]">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map(block => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((block, index) => (
              <div id={`block-${block.id}`} key={block.id}>
                <SortableBlock
                  id={block.id}
                  block={block}
                  index={index}
                  isActive={activeBlockId === block.id}
                  onSetActive={setActiveBlockId}
                  onUpdate={handleBlockUpdate}
                  onTypeChange={handleBlockTypeChange}
                  onAddBlock={handleAddBlock}
                  onDeleteBlock={handleDeleteBlock}
                  onDuplicate={handleDuplicateBlock}
                />
              </div>
            ))}
          </SortableContext>
        </DndContext>

        {/* Block menu */}
        {showBlockMenu && (
          <div style={{ position: 'absolute', top: blockMenuPosition.top, left: blockMenuPosition.left }}>
            <BlockMenu 
              onSelect={(type) => {
                const targetId = activeBlockId || blocks[blocks.length - 1].id;
                handleAddBlock(type, targetId);
              }}
              onClose={() => setShowBlockMenu(false)} 
            />
          </div>
        )}

        {/* Add block button */}
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const targetId = activeBlockId || blocks[blocks.length - 1].id;
              showBlockMenuAt(targetId);
            }}
          >
            + Add block
          </Button>
        </div>
      </div>

      {/* Comments panel */}
      {showComments && (
        <CommentsPanel 
          pageId={temporaryPageId} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}

