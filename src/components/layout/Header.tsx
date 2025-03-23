
import React from "react";
import { 
  ChevronLeft, 
  MoreHorizontal,
  Share,
  Menu
} from "lucide-react";

interface HeaderProps {
  currentPath: string[];
  onMenuClick?: () => void;
}

export function Header({ currentPath, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center border-b border-gray-200 h-12 px-4">
      {/* Menu button (mobile only) */}
      <button 
        className="mr-2 p-1 rounded md:hidden" 
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <Menu className="h-5 w-5 text-gray-500" />
      </button>

      <button className="mr-2 hover:bg-gray-100 p-1 rounded hidden md:block">
        <ChevronLeft className="h-5 w-5 text-gray-500" />
      </button>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-1 overflow-x-auto">
        <ol className="flex items-center gap-1 whitespace-nowrap">
          {currentPath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="text-gray-400">/</li>
              )}
              <li>
                <button className="text-sm text-gray-600 hover:bg-gray-100 px-1 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
                  {item}
                </button>
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Share className="h-4 w-4 text-gray-500" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
