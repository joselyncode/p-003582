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
  { name: "Default", textColor: "text-foreground", bgColor: "bg-transparent", hexColor: "inherit" },
  { name: "Gray", textColor: "text-gray-500", bgColor: "bg-gray-100", hexColor: "#6b7280" },
  { name: "Red", textColor: "text-red-500", bgColor: "bg-red-100", hexColor: "#ef4444" },
  { name: "Orange", textColor: "text-orange-500", bgColor: "bg-orange-100", hexColor: "#f97316" },
  { name: "Yellow", textColor: "text-yellow-500", bgColor: "bg-yellow-100", hexColor: "#eab308" },
  { name: "Green", textColor: "text-green-500", bgColor: "bg-green-100", hexColor: "#22c55e" },
  { name: "Blue", textColor: "text-blue-500", bgColor: "bg-blue-100", hexColor: "#3b82f6" },
  { name: "Purple", textColor: "text-purple-500", bgColor: "bg-purple-100", hexColor: "#a855f7" },
  { name: "Pink", textColor: "text-pink-500", bgColor: "bg-pink-100", hexColor: "#ec4899" },
];

// Define the exact color values that correspond to Tailwind classes
const bgColorMap: Record<string, string> = {
  "bg-transparent": "transparent",
  "bg-gray-100": "#f3f4f6",
  "bg-red-100": "#fee2e2",
  "bg-orange-100": "#ffedd5",
  "bg-yellow-100": "#fef9c3",
  "bg-green-100": "#dcfce7",
  "bg-blue-100": "#dbeafe",
  "bg-purple-100": "#f3e8ff",
  "bg-pink-100": "#fce7f3"
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

  useEffect(() => {
    if (!position) return;
    
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const menuHeight = 40; // Approximate height of the menu
    const menuWidth = 225; // Approximate width of the menu
    const buffer = 5; // Small buffer space (reduced from 10)
    
    const direction = position.y - menuHeight - buffer < 0 ? "bottom" : "top";
    
    let xPos = position.x - (menuWidth / 2);
    
    xPos = Math.max(10, Math.min(xPos, viewportWidth - menuWidth - 10));
    
    setMenuPosition({
      x: xPos,
      y: direction === "top" ? position.y - buffer : position.y + buffer,
      direction
    });
  }, [position]);

  const menuStyle = position ? {
    left: `${menuPosition.x}px`,
    top: menuPosition.direction === "top" ? `${menuPosition.y - 40}px` : `${menuPosition.y + 10}px`,
    position: 'absolute',
    zIndex: 100,
    opacity: 0,
    transform: menuPosition.direction === "top" ? "translateY(5px)" : "translateY(-5px)",
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

  const handleColorSelect = (type: 'text' | 'background', color: typeof colorOptions[0]) => {
    if (!hasSelection) return;
    
    if (type === 'text') {
      console.log("Applying text color from menu:", color.name, color.hexColor); // Debug log
      onFormatText('textColor', color.hexColor);
    } else if (type === 'background') {
      const bgValue = bgColorMap[color.bgColor];
      if (bgValue) {
        console.log("Applying background color from menu:", color.name, bgValue); // Debug log
        onFormatText('backgroundColor', bgValue);
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
                          onClick={() => handleColorSelect('text', color)}
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
                          onClick={() => handleColorSelect('background', color)}
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
