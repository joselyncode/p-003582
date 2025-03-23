
import React from "react";
import { 
  ChevronLeft,
  MoreHorizontal
} from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

interface HeaderProps {
  currentPath: string[];
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="flex items-center border-b border-gray-200 h-12 px-4">
      <button className="mr-2 hover:bg-gray-100 p-1 rounded">
        <ChevronLeft className="h-5 w-5 text-gray-500" />
      </button>

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {currentPath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  {item}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}
