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
import { ChevronRight, MessageSquare, Edit } from 'lucide-react';
import { Block } from '@/context/PagesContext';
import { Input } from '@/components/ui/input';

interface PageEditorProps {
  workspaceName: string;
  pagePath: string[];
  blocks?: Block[];
  onBlocksChange?: (blocks: Block[]) => void;
  lastSaved?: number;
  allowTitleEdit?: boolean;
}

export function PageEditor({ 
  workspaceName, 
  pagePath, 
  blocks: initialBlocks,
  onBlocksChange,
  lastSaved,
  allowTitleEdit = false
}: PageEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks || [
    {
      id: "1",
      type: "heading1",
      content: ""
    }
  ]);
  
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [blockMenuPosition, setBlockMenuPosition] = useState({ top: 0, left: 0 });
  const [temporaryPageId, setTemporaryPageId] = useState<string>(uuidv4());
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState("");

  useEffect(() => {
    if (initialBlocks) {
      setBlocks(initialBlocks);
      const titleBlock = initialBlocks.find(b => b.type === "heading1");
      if (titleBlock) {
        setTitleText(titleBlock.content || "Untitled");
      } else {
        setTitleText("Untitled");
      }
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
      
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
    
    setTimeout(() => {
      setActiveBlockId(newBlockId);
    }, 100);
    
    setShowBlockMenu(false);

    return newBlockId;
  };

  const handleDuplicateBlock = (id: string) => {
    const blockToDuplicate = blocks.find(block => block.id === id);
    if (!blockToDuplicate) return;
    
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
      
      if (onBlocksChange) {
        onBlocksChange(newBlocks);
      }
      
      return newBlocks;
    });
    
    setTimeout(() => {
      setActiveBlockId(newBlockId);
    }, 100);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      return;
    }
    
    setBlocks(prev => {
      const newBlocks = prev.filter(block => block.id !== id);
      
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
    
    const diffInSeconds = Math.floor((now.getTime() - saved.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Saved just now";
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Saved ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
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

  const handleTitleChange = (newTitle: string) => {
    setTitleText(newTitle);
    
    const updatedBlocks = [...blocks];
    const titleBlockIndex = updatedBlocks.findIndex(b => b.type === "heading1");
    
    if (titleBlockIndex >= 0) {
      updatedBlocks[titleBlockIndex] = {
        ...updatedBlocks[titleBlockIndex],
        content: newTitle
      };
    } else if (updatedBlocks.length > 0) {
      updatedBlocks[0] = {
        ...updatedBlocks[0],
        type: "heading1",
        content: newTitle
      };
    } else {
      updatedBlocks.push({
        id: uuidv4(),
        type: "heading1",
        content: newTitle
      });
    }
    
    setBlocks(updatedBlocks);
    
    if (onBlocksChange) {
      onBlocksChange(updatedBlocks);
    }
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (!titleText.trim()) {
      handleTitleChange("Untitled");
    }
  };

  return (
    <div className="editor-container">
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
          <div className="flex-1">
            {isEditingTitle && allowTitleEdit ? (
              <div className="flex items-center">
                <Input
                  className="text-3xl font-bold py-1 h-auto"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSave();
                    }
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div 
                className="flex items-center gap-2" 
                onClick={() => allowTitleEdit && setIsEditingTitle(true)}
              >
                <h1 className="text-3xl font-bold">
                  {titleText || "Untitled"}
                </h1>
                {allowTitleEdit && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
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

      {showComments && (
        <CommentsPanel 
          pageId={temporaryPageId} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
