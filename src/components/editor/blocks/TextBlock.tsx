
import React, { useRef, useEffect } from "react";
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare 
} from "lucide-react";

interface Block {
  id: string;
  type: "text" | "heading1" | "heading2" | "heading3" | "todo" | "bullet" | "numbered";
  content: string;
}

interface TextBlockProps {
  block: Block;
  onChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onDelete: () => void;
  changeType: (type: Block["type"]) => void;
  onEnterPress?: () => void;
}

export function TextBlock({ 
  block, 
  onChange, 
  onFocus, 
  onBlur,
  onDelete,
  changeType,
  onEnterPress
}: TextBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = block.content;
    }
  }, [block.type]);

  const getTagForBlockType = () => {
    switch (block.type) {
      case "heading1": return "h1";
      case "heading2": return "h2";
      case "heading3": return "h3";
      case "text":
      default: return "div";
    }
  };

  const getClassForBlockType = () => {
    switch (block.type) {
      case "heading1": return "text-3xl font-bold";
      case "heading2": return "text-2xl font-bold";
      case "heading3": return "text-xl font-bold";
      case "todo": return "flex items-start gap-2";
      case "bullet": return "pl-5 list-disc ml-2";
      case "numbered": return "pl-5 list-decimal ml-2";
      case "text":
      default: return "text-base";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Call the onEnterPress callback to create a new block
      if (onEnterPress) {
        onEnterPress();
      }
    } else if (e.key === "Backspace" && contentRef.current?.textContent === "") {
      e.preventDefault();
      onDelete();
    } else if (e.key === "/" && contentRef.current?.textContent === "") {
      e.preventDefault();
      // Mostrar menú de comandos
    }
  };

  const renderBlockContent = () => {
    if (block.type === "todo") {
      return (
        <div className="flex items-start gap-2">
          <input type="checkbox" className="mt-1.5" />
          <div
            ref={contentRef}
            contentEditable
            className="outline-none flex-1"
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            data-placeholder="Lista de tareas..."
          />
        </div>
      );
    }

    if (block.type === "bullet" || block.type === "numbered") {
      return (
        <li>
          <div
            ref={contentRef}
            contentEditable
            className="outline-none"
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            data-placeholder={block.type === "bullet" ? "Lista con viñetas..." : "Lista numerada..."}
          />
        </li>
      );
    }

    // For regular text and headings
    const Tag = getTagForBlockType();
    
    return React.createElement(Tag, {
      ref: contentRef,
      contentEditable: true,
      className: `outline-none ${getClassForBlockType()} empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`,
      onInput: (e: React.FormEvent<HTMLElement>) => onChange((e.target as HTMLElement).innerHTML),
      onFocus,
      onBlur,
      onKeyDown: handleKeyDown,
      "data-placeholder":
        block.type === "heading1" ? "Título" :
        block.type === "heading2" ? "Subtítulo" :
        block.type === "heading3" ? "Encabezado pequeño" :
        "Escribe algo..."
    });
  };

  return (
    <div className="py-1 group relative">
      <div className="absolute left-0 -ml-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
        <button 
          onClick={() => {
            const types: Block["type"][] = ["text", "heading1", "heading2", "heading3", "bullet", "numbered", "todo"];
            const currentIndex = types.indexOf(block.type);
            const nextType = types[(currentIndex + 1) % types.length];
            changeType(nextType);
          }}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded"
          title="Cambiar tipo de bloque"
        >
          {block.type === "text" && <Type className="h-3.5 w-3.5" />}
          {block.type === "heading1" && <Heading1 className="h-3.5 w-3.5" />}
          {block.type === "heading2" && <Heading2 className="h-3.5 w-3.5" />}
          {block.type === "heading3" && <Heading3 className="h-3.5 w-3.5" />}
          {block.type === "bullet" && <List className="h-3.5 w-3.5" />}
          {block.type === "numbered" && <ListOrdered className="h-3.5 w-3.5" />}
          {block.type === "todo" && <CheckSquare className="h-3.5 w-3.5" />}
        </button>
      </div>
      
      {renderBlockContent()}
    </div>
  );
}
