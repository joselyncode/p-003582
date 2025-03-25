
import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link, 
  Palette 
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const colorOptions = [
  { name: "Default", textColor: "text-foreground", bgColor: "bg-transparent" },
  { name: "Gray", textColor: "text-gray-500", bgColor: "bg-gray-100" },
  { name: "Red", textColor: "text-red-500", bgColor: "bg-red-100" },
  { name: "Orange", textColor: "text-orange-500", bgColor: "bg-orange-100" },
  { name: "Yellow", textColor: "text-yellow-500", bgColor: "bg-yellow-100" },
  { name: "Green", textColor: "text-green-500", bgColor: "bg-green-100" },
  { name: "Blue", textColor: "text-blue-500", bgColor: "bg-blue-100" },
  { name: "Purple", textColor: "text-purple-500", bgColor: "bg-purple-100" },
  { name: "Pink", textColor: "text-pink-500", bgColor: "bg-pink-100" },
];

// Define proper types for the Tailwind to CSS mapping
interface TextColorStyle {
  color: string;
}

interface BgColorStyle {
  backgroundColor: string;
}

// Mapping of Tailwind classes to CSS values
const tailwindToCSS: Record<string, TextColorStyle | BgColorStyle> = {
  // Text colors
  "text-foreground": { color: "inherit" },
  "text-gray-500": { color: "#6b7280" },
  "text-red-500": { color: "#ef4444" },
  "text-orange-500": { color: "#f97316" },
  "text-yellow-500": { color: "#eab308" },
  "text-green-500": { color: "#22c55e" },
  "text-blue-500": { color: "#3b82f6" },
  "text-purple-500": { color: "#a855f7" },
  "text-pink-500": { color: "#ec4899" },
  
  // Background colors
  "bg-transparent": { backgroundColor: "transparent" },
  "bg-gray-100": { backgroundColor: "#f3f4f6" },
  "bg-red-100": { backgroundColor: "#fee2e2" },
  "bg-orange-100": { backgroundColor: "#ffedd5" },
  "bg-yellow-100": { backgroundColor: "#fef9c3" },
  "bg-green-100": { backgroundColor: "#dcfce7" },
  "bg-blue-100": { backgroundColor: "#dbeafe" },
  "bg-purple-100": { backgroundColor: "#f3e8ff" },
  "bg-pink-100": { backgroundColor: "#fce7f3" }
};

interface FormatMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  onFormatText: (format: string, value?: string) => void;
  hasSelection?: boolean;
}

export function FormatMenu({ position, onClose, onFormatText, hasSelection = true }: FormatMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; direction: "top" | "bottom" }>({ 
    x: 0, 
    y: 0, 
    direction: "top" 
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Calculate optimal menu position
  useEffect(() => {
    if (!position) return;
    
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const menuHeight = 40; // Approximate height of the menu
    const menuWidth = 225; // Approximate width of the menu
    const buffer = 5; // Small buffer space (reduced from 10)
    
    // Check if there's enough space above
    const direction = position.y - menuHeight - buffer < 0 ? "bottom" : "top";
    
    // Center horizontally over the selection
    let xPos = position.x - (menuWidth / 2);
    
    // Keep menu within viewport horizontally
    xPos = Math.max(10, Math.min(xPos, viewportWidth - menuWidth - 10));
    
    setMenuPosition({
      x: xPos,
      y: direction === "top" ? position.y - buffer : position.y + buffer,
      direction
    });
  }, [position]);

  // Calculate menu style based on position
  const menuStyle = position ? {
    left: `${menuPosition.x}px`,
    top: menuPosition.direction === "top" ? `${menuPosition.y - 40}px` : `${menuPosition.y + 10}px`,
    position: 'absolute',
    zIndex: 100,
    opacity: 0,
    transform: menuPosition.direction === "top" ? "translateY(5px)" : "translateY(-5px)", // Reduced from 10px to 5px
    animation: "formatMenuFadeIn 0.15s ease-out forwards",
  } as React.CSSProperties : { display: 'none' };

  const applyFormat = (format: string) => {
    if (!hasSelection) return;
    onFormatText(format);
  };

  const handleAddLink = () => {
    if (!hasSelection) return;
    
    if (showLinkInput && linkInput.trim()) {
      onFormatText('link', linkInput.trim());
      setLinkInput("");
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
    }
  };

  const handleColorSelect = (type: 'text' | 'background', colorClass: string) => {
    if (!hasSelection) return;
    
    // Apply correct color based on type
    if (type === 'text') {
      const textStyle = tailwindToCSS[colorClass] as TextColorStyle;
      if ('color' in textStyle) {
        const styleString = `color:${textStyle.color};`;
        onFormatText('textColor', styleString);
      }
    } else if (type === 'background') {
      const bgStyle = tailwindToCSS[colorClass] as BgColorStyle;
      if ('backgroundColor' in bgStyle) {
        const styleString = `background-color:${bgStyle.backgroundColor};`;
        onFormatText('backgroundColor', styleString);
      }
    }
  };

  if (!position) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes formatMenuFadeIn {
            from {
              opacity: 0;
              transform: ${menuPosition.direction === "top" ? "translateY(5px)" : "translateY(-5px)"};
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
      <div 
        ref={menuRef} 
        style={menuStyle} 
        className="rounded-md bg-white shadow-md border border-gray-200 py-1 px-1 flex items-center gap-1"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded" 
                onClick={() => applyFormat('bold')}
                disabled={!hasSelection}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Bold" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded" 
                onClick={() => applyFormat('italic')}
                disabled={!hasSelection}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Italic" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded" 
                onClick={() => applyFormat('underline')}
                disabled={!hasSelection}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Underline" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded" 
                onClick={() => applyFormat('strikethrough')}
                disabled={!hasSelection}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Strikethrough" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded"
                    disabled={!hasSelection}
                  >
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" side="bottom">
                  <div className="grid gap-2">
                    <h4 className="font-medium text-sm">Text color</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {colorOptions.map((color) => (
                        <Button 
                          key={`text-${color.name}`}
                          variant="ghost" 
                          className="h-7 px-2 justify-start"
                          onClick={() => handleColorSelect('text', color.textColor)}
                        >
                          <div className={`w-4 h-4 mr-2 rounded-full ${color.textColor} flex items-center justify-center`}>
                            <span className="text-xs">A</span>
                          </div>
                          <span className="text-xs">{color.name}</span>
                        </Button>
                      ))}
                    </div>
                    
                    <h4 className="font-medium text-sm mt-2">Background color</h4>
                    <div className="grid grid-cols-3 gap-1">
                      {colorOptions.map((color) => (
                        <Button 
                          key={`bg-${color.name}`}
                          variant="ghost" 
                          className="h-7 px-2 justify-start"
                          onClick={() => handleColorSelect('background', color.bgColor)}
                        >
                          <div className={`w-4 h-4 mr-2 rounded-full ${color.bgColor} border border-gray-200`}></div>
                          <span className="text-xs">{color.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Format color" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              {showLinkInput ? (
                <div className="flex items-center bg-gray-100 rounded px-2">
                  <input
                    type="text" 
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Enter URL..."
                    className="bg-transparent border-none outline-none text-sm py-1 w-32"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddLink();
                      } else if (e.key === 'Escape') {
                        setShowLinkInput(false);
                        setLinkInput("");
                      }
                    }}
                    autoFocus
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddLink}
                    className="h-6 px-1"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded" 
                  onClick={handleAddLink}
                  disabled={!hasSelection}
                >
                  <Link className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{hasSelection ? "Add link" : "Selecciona texto para aplicar formato"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
