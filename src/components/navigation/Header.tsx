
import React from "react";
import { 
  ChevronLeft,
  MoreHorizontal,
  Menu
} from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentPath: string[];
  onMenuClick?: () => void;
}

export function Header({ currentPath, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navegar hacia atrás en el historial
    navigate(-1);
  };

  return (
    <header className="flex items-center border-b border-gray-200 h-12 px-4">
      {/* Mobile menu button */}
      <button 
        className="md:hidden mr-2 hover:bg-gray-100 p-1 rounded"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5 text-gray-500" />
      </button>
      
      <button 
        className="mr-2 hover:bg-gray-100 p-1 rounded"
        onClick={handleGoBack}
        aria-label="Volver atrás"
      >
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
