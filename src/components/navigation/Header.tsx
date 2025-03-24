
import React, { useState, useEffect } from "react";
import { 
  ChevronLeft,
  MoreHorizontal,
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
}

export function Header({ currentPath, onMenuClick, pageId = "default-page" }: HeaderProps) {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, getPageContent } = usePages();
  const { toast } = useToast();

  // Verificar si la página actual está marcada como favorita
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
    // Navegar hacia atrás en el historial
    navigate(-1);
  };

  const handleFavoriteToggle = async () => {
    if (pageId && pageId !== 'default-page') {
      setIsLoading(true);
      try {
        await toggleFavorite(pageId, !isFavorite);
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
    // This would ideally be handled by a state manager or a parent component
    const commentPanelToggle = document.querySelector('[data-comments-toggle]');
    if (commentPanelToggle && commentPanelToggle instanceof HTMLElement) {
      commentPanelToggle.click();
    }
  };

  // Función para determinar la ruta basada en el elemento del breadcrumb
  const getBreadcrumbPath = (item: string, index: number): string => {
    // Primer elemento suele ser el workspace, enviar a la raíz
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
    
    // Para elementos intermedios, identificar la sección
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
      // Si no coincide con ninguna sección conocida, no navegar
      return "#";
    }
  };

  // Eliminar duplicados en la ruta de navegación
  const uniquePath = currentPath.filter((item, index, self) => 
    self.findIndex(i => i.toLowerCase() === item.toLowerCase()) === index
  );

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
          className="h-8 w-8"
        >
          <MessageSquare className="h-4 w-4 text-gray-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleFavoriteToggle}
          className="h-8 w-8"
          disabled={isLoading || pageId === 'default-page'}
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
        >
          <Share className="h-4 w-4 text-gray-500" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Share Modal */}
      <ShareModal 
        open={showShareModal} 
        onOpenChange={setShowShareModal}
        pageId={pageId}
      />
    </header>
  );
}
