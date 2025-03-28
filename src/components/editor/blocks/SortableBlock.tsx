import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "@/context/PagesContext";
import { 
  MoreVertical, 
  GripVertical, 
  Copy, 
  Trash2, 
  Plus, 
  PaintBucket, 
  Eraser,
  ChevronRight
} from "lucide-react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableBlock } from "./TableBlock";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { FormatMenu } from "../FormatMenu";

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

const bgColorOptions = [
  { label: "Default", value: "bg-transparent" },
  { label: "Gray", value: "bg-gray-100" },
  { label: "Red", value: "bg-red-100" },
  { label: "Yellow", value: "bg-yellow-100" },
  { label: "Green", value: "bg-green-100" },
  { label: "Blue", value: "bg-blue-100" },
  { label: "Purple", value: "bg-purple-100" },
  { label: "Pink", value: "bg-pink-100" },
];

export function SortableBlock({ 
  block, 
  isActive,
  onSetActive,
  onUpdate,
  onTypeChange,
  onAddBlock,
  onDeleteBlock,
  onDuplicate,
  index
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [bgColor, setBgColor] = useState("bg-transparent");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [isNewBlock, setIsNewBlock] = useState(!block.content);
  const [isChecked, setIsChecked] = useState(false);
  const [formatMenuPosition, setFormatMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [hasTextSelection, setHasTextSelection] = useState(false);

  useEffect(() => {
    if (block.type === "todo" && block.content) {
      if (block.content.startsWith("[x]")) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
    }
  }, [block.content, block.type]);

  useEffect(() => {
    if (isNewBlock && contentEditableRef.current && isActive) {
      contentEditableRef.current.focus();
      setIsNewBlock(false);
    }
  }, [isNewBlock, isActive]);

  useEffect(() => {
    if (isActive && contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  }, [isActive]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(block.id);
    } else {
      onAddBlock(block.type, block.id);
    }
  };

  const handleClearContents = () => {
    onUpdate(block.id, "");
  };

  const handleChangeBgColor = (colorClass: string) => {
    setBgColor(colorClass);
  };

  const isTableBlock = block.type === "table";
  const isListType = block.type === "bullet" || block.type === "numbered" || block.type === "todo";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      if (!contentEditableRef.current?.textContent?.trim()) {
        onTypeChange(block.id, "text");
        return;
      }
      
      onAddBlock(block.type, block.id);
    }
  };

  const handleTodoCheckChange = (checked: boolean) => {
    setIsChecked(checked);
    
    if (contentEditableRef.current) {
      const currentText = contentEditableRef.current.textContent || '';
      const cleanText = currentText.replace(/^\[x\]|\[ \]/, '').trim();
      
      onUpdate(block.id, checked ? `[x]${cleanText}` : `${cleanText}`);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    
    if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setFormatMenuPosition({
        x: rect.left + (rect.width / 2),
        y: rect.top
      });
      setHasTextSelection(true);
    } else {
      setFormatMenuPosition(null);
      setHasTextSelection(false);
    }
  };

  const applyFormatting = (format: string, value?: string) => {
    console.log(`Aplicando formato: ${format}`, value); // Log de depuración
    
    const selection = window.getSelection();
    
    if (!selection || selection.isCollapsed || !selection.rangeCount || !contentEditableRef.current) {
      console.log("No se detectó selección válida"); // Log de depuración
      return;
    }
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      console.log("El texto seleccionado está vacío"); // Log de depuración
      return;
    }
    
    console.log("Texto seleccionado:", selectedText); // Log de depuración
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `<s>${selectedText}</s>`;
        break;
      case 'link':
        if (value) {
          formattedText = `<a href="${value}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        }
        break;
      case 'textColor':
        if (value) {
          console.log(`Creando span con color: ${value}`); // Log de depuración
          formattedText = `<span style="color:${value} !important">${selectedText}</span>`;
        }
        break;
      case 'backgroundColor':
        if (value) {
          console.log(`Creando span con background-color: ${value}`); // Log de depuración
          formattedText = `<span style="background-color:${value} !important">${selectedText}</span>`;
        }
        break;
      default:
        console.log("Formato desconocido:", format);
        return;
    }
    
    if (!formattedText) {
      console.log("No se creó texto formateado"); // Log de depuración
      return;
    }
    
    console.log("Texto formateado a insertar:", formattedText); // Log de depuración
    
    range.deleteContents();
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    
    range.insertNode(fragment);
    
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML;
      console.log("Contenido actualizado:", newContent); // Log de depuración
      
      requestAnimationFrame(() => {
        if (contentEditableRef.current) {
          onUpdate(block.id, contentEditableRef.current.innerHTML);
        }
      });
    }
    
    setFormatMenuPosition(null);
    setHasTextSelection(false);
    document.getSelection()?.removeAllRanges();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative py-1 px-1 rounded hover:bg-gray-50 ${bgColor}`}
      data-block-id={block.id}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-gray-400 hover:text-gray-800" {...listeners}>
              <GripVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
            
            {isTableBlock && (
              <DropdownMenuItem onClick={handleClearContents}>
                <Eraser className="mr-2 h-4 w-4" />
                <span>Clear contents</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => onDeleteBlock(block.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PaintBucket className="mr-2 h-4 w-4" />
                <span>Color</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {bgColorOptions.map((color) => (
                  <DropdownMenuItem 
                    key={color.value} 
                    onClick={() => handleChangeBgColor(color.value)}
                    className="flex items-center"
                  >
                    <div className={`w-4 h-4 mr-2 rounded ${color.value !== 'bg-transparent' ? color.value : 'border border-gray-200'}`}></div>
                    <span>{color.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`cursor-text ${isActive ? 'bg-gray-50' : ''}`}
            onClick={() => onSetActive(block.id)}
          >
            <div className="px-3 py-2">
              {block.type === "heading1" && (
                <h1 
                  className="text-3xl font-bold" 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                  ref={contentEditableRef}
                  onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                  onKeyUp={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                ></h1>
              )}
              {block.type === "heading2" && (
                <h2 
                  className="text-2xl font-bold" 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                  ref={contentEditableRef}
                  onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                  onKeyUp={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                ></h2>
              )}
              {block.type === "heading3" && (
                <h3 
                  className="text-xl font-bold" 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                  ref={contentEditableRef}
                  onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                  onKeyUp={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                ></h3>
              )}
              {block.type === "text" && (
                <p 
                  className="text-base" 
                  contentEditable={true} 
                  suppressContentEditableWarning={true}
                  ref={contentEditableRef}
                  onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                  onKeyUp={handleTextSelection}
                  onMouseUp={handleTextSelection}
                  dangerouslySetInnerHTML={{ __html: block.content || "" }}
                ></p>
              )}
              {block.type === "todo" && (
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id={`todo-${block.id}`}
                    className="mt-1"
                    checked={isChecked}
                    onCheckedChange={handleTodoCheckChange}
                  />
                  <div 
                    contentEditable={true} 
                    suppressContentEditableWarning={true}
                    ref={contentEditableRef}
                    onBlur={(e) => {
                      const cleanText = e.currentTarget.innerHTML || '';
                      onUpdate(block.id, isChecked ? `[x]${cleanText}` : cleanText);
                    }}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleTextSelection}
                    onMouseUp={handleTextSelection}
                    className={isChecked ? "line-through underline text-gray-500" : ""}
                    dangerouslySetInnerHTML={{ __html: block.content ? block.content.replace(/^\[x\]/, '').trim() : '' }}
                  ></div>
                </div>
              )}
              {block.type === "bullet" && (
                <div className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <div 
                    contentEditable={true} 
                    suppressContentEditableWarning={true}
                    ref={contentEditableRef}
                    onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleTextSelection}
                    onMouseUp={handleTextSelection}
                    dangerouslySetInnerHTML={{ __html: block.content || "" }}
                  ></div>
                </div>
              )}
              {block.type === "numbered" && (
                <div className="flex items-start gap-2">
                  <span className="mt-1">{index + 1}.</span>
                  <div 
                    contentEditable={true} 
                    suppressContentEditableWarning={true}
                    ref={contentEditableRef}
                    onBlur={(e) => onUpdate(block.id, e.currentTarget.innerHTML)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleTextSelection}
                    onMouseUp={handleTextSelection}
                    dangerouslySetInnerHTML={{ __html: block.content || "" }}
                  ></div>
                </div>
              )}
              {block.type === "table" && (
                <TableBlock 
                  initialContent={block.content}
                  onUpdate={(content) => onUpdate(block.id, content)}
                />
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
          </ContextMenuItem>
          
          {isTableBlock && (
            <ContextMenuItem onClick={handleClearContents}>
              <Eraser className="mr-2 h-4 w-4" />
              <span>Clear contents</span>
            </ContextMenuItem>
          )}
          
          <ContextMenuItem onClick={() => onDeleteBlock(block.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <PaintBucket className="mr-2 h-4 w-4" />
              <span>Color</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              {bgColorOptions.map((color) => (
                <ContextMenuItem 
                  key={color.value} 
                  onClick={() => handleChangeBgColor(color.value)}
                  className="flex items-center"
                >
                  <div className={`w-4 h-4 mr-2 rounded ${color.value !== 'bg-transparent' ? color.value : 'border border-gray-200'}`}></div>
                  <span>{color.label}</span>
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

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

      <FormatMenu 
        position={formatMenuPosition} 
        onClose={() => setFormatMenuPosition(null)}
        onFormatText={applyFormatting}
        hasSelection={hasTextSelection}
      />
    </div>
  );
}
