
import React from "react";
import { 
  ChevronLeft, 
  MoreHorizontal,
  Share,
  Star,
  Users
} from "lucide-react";

interface HeaderProps {
  currentPath: string[];
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="flex items-center border-b border-gray-200 h-12 px-4">
      <button className="mr-2 hover:bg-gray-100 p-1 rounded">
        <ChevronLeft className="h-5 w-5 text-gray-500" />
      </button>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-1">
        <ol className="flex items-center gap-1">
          {currentPath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="text-gray-400">/</li>
              )}
              <li>
                <button className="text-sm text-gray-600 hover:bg-gray-100 px-1 py-0.5 rounded">
                  {item}
                </button>
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Star className="h-4 w-4 text-gray-500" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Share className="h-4 w-4 text-gray-500" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Users className="h-4 w-4 text-gray-500" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
