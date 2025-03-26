
import React, { useState, useEffect } from "react";
import { 
  ChevronLeft,
  Star,
  Share,
  MessageSquare,
  Menu
} from "lucide-react";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShareModal } from "@/components/editor/ShareModal";
import { usePages } from "@/context/PagesContext";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  currentPath: string[];
  onMenuClick?: () => void;
  pageId?: string;
  onCommentsClick?: () => void;
  commentsOpen?: boolean;
}

export function Header({ 
  currentPath, 
  onMenuClick, 
  pageId = "default-page",
  onCommentsClick,
  commentsOpen = false
}: HeaderProps) {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, getPageContent } = usePages();
  const { toast } = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!pageId || pageId === 'default-page') return;
      
      try {
        const content = await getPageContent(pageId);
        if (content) {
          setIsFavorite(content.is_favorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [pageId, getPageContent]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFavoriteToggle = async () => {
    if (pageId && pageId !== 'default-page') {
      setIsLoading(true);
      try {
        // Pasamos shouldNavigate como false para evitar navegación automática que causa el error
        await toggleFavorite(pageId, !isFavorite, false);
        setIsFavorite(!isFavorite);
        
        toast({
          description: isFavorite 
            ? "Página eliminada de favoritos" 
            : "Página añadida a favoritos",
        });
      } catch (error) {
        console.error("Error al cambiar estado de favorito:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de favorito",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShowComments = () => {
    if (onCommentsClick) {
      onCommentsClick();
    }
  };

  const getBreadcrumbPath = (item: string, index: number): string => {
    if (index === 0) {
      if (item.toLowerCase().includes("workspace")) {
        return "/workspace";
      } else if (item.toLowerCase().includes("personal")) {
        return "/personal";
      } else if (item.toLowerCase().includes("notas")) {
        return "/notes";
      } else {
        return "/";
      }
    }
    
    if (item.toLowerCase() === "workspace") {
      return "/workspace";
    } else if (item.toLowerCase() === "notas" || item.toLowerCase() === "notes") {
      return "/notes";
    } else if (item.toLowerCase() === "personal") {
      return "/personal";
    } else if (item.toLowerCase() === "documentación" || item.toLowerCase() === "documentation" || item.toLowerCase() === "docs") {
      return "/docs";
    } else if (item.toLowerCase() === "tareas" || item.toLowerCase() === "todos") {
      return "/todos";
    } else {
      return "#";
    }
  };

  const uniquePath = currentPath.filter((item, index, self) => 
    self.findIndex(i => i.toLowerCase() === item.toLowerCase()) === index
  );

  return (
    <header className="flex items-center border-b border-gray-200 h-12 px-4">
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
          {uniquePath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link 
                    to={getBreadcrumbPath(item, index)} 
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleShowComments}
          className={`h-8 w-8 ${commentsOpen ? 'bg-gray-100' : ''}`}
          aria-label="Mostrar comentarios"
        >
          <MessageSquare className={`h-4 w-4 ${commentsOpen ? 'text-blue-500' : 'text-gray-500'}`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleFavoriteToggle}
          className="h-8 w-8"
          disabled={isLoading || pageId === 'default-page'}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          {isFavorite ? (
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          ) : (
            <Star className="h-4 w-4 text-gray-500" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowShareModal(true)}
          className="h-8 w-8"
          aria-label="Compartir página"
        >
          <Share className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      <ShareModal 
        open={showShareModal} 
        onOpenChange={setShowShareModal}
        pageId={pageId}
      />
    </header>
  );
}
