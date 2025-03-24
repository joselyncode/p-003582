
import React, { useRef, useEffect } from "react";
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare,
  Table
} from "lucide-react";
import { Block } from "@/context/PagesContext";

export interface BlockMenuProps {
  onSelect: (type: Block['type']) => void;
  onClose: () => void;
}

interface BlockMenuButtonProps {
  type: Block['type'];
  label: string;
  icon: React.ElementType;
  onSelect: (type: Block['type']) => void;
}

const BlockMenuButton = ({ type, label, icon: Icon, onSelect }: BlockMenuButtonProps) => (
  <button
    className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded w-full text-left text-sm"
    onClick={() => onSelect(type)}
  >
    <Icon className="h-4 w-4 text-gray-500" />
    <span>{label}</span>
  </button>
);

export function BlockMenu({ onSelect, onClose }: BlockMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const blockTypes = [
    { type: "text" as const, label: "Texto", icon: Type },
    { type: "heading1" as const, label: "Título 1", icon: Heading1 },
    { type: "heading2" as const, label: "Título 2", icon: Heading2 },
    { type: "heading3" as const, label: "Título 3", icon: Heading3 },
    { type: "bullet" as const, label: "Lista con viñetas", icon: List },
    { type: "numbered" as const, label: "Lista numerada", icon: ListOrdered },
    { type: "todo" as const, label: "Lista de tareas", icon: CheckSquare },
    { type: "table" as const, label: "Tabla", icon: Table },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (typeof onClose === 'function') {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="absolute left-0 -ml-32 top-0 z-10 bg-white shadow-lg rounded-md border border-gray-200 w-60 overflow-hidden"
    >
      <div className="p-2">
        {blockTypes.map((blockType) => (
          <BlockMenuButton
            key={blockType.type}
            type={blockType.type}
            label={blockType.label}
            icon={blockType.icon}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
