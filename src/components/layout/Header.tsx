
import React, { useState } from "react";
import { 
  ChevronLeft, 
  MoreHorizontal,
  Share,
  Menu,
  Star,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ShareModal } from "@/components/editor/ShareModal";

interface HeaderProps {
  currentPath: string[];
  onMenuClick?: () => void;
  pageId?: string;
}

export function Header({ currentPath, onMenuClick, pageId = "default-page" }: HeaderProps) {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<string[]>("notion-favorites", []);
  const isFavorite = pageId ? favorites.includes(pageId) : false;

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== pageId));
    } else {
      setFavorites([...favorites, pageId]);
    }
  };

  const handleShowComments = () => {
    // This would ideally be handled by a state manager or a parent component
    const commentPanelToggle = document.querySelector('[data-comments-toggle]');
    if (commentPanelToggle && commentPanelToggle instanceof HTMLElement) {
      commentPanelToggle.click();
    }
  };

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

      <button 
        className="mr-2 hover:bg-gray-100 p-1 rounded"
        onClick={handleGoBack}
        aria-label="Volver atrás"
      >
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
          onClick={toggleFavorite}
          className="h-8 w-8"
        >
          {isFavorite ? (
            <Star className="h-4 w-4 text-yellow-400" />
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
