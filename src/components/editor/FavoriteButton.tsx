
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { usePages } from '@/context/PagesContext';
import { useToast } from '@/components/ui/use-toast';

interface FavoriteButtonProps {
  pageId: string;
}

export const FavoriteButton = ({ pageId }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, getPageContent } = usePages();
  const { toast } = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!pageId) return;
      
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

  const handleToggleFavorite = async () => {
    if (!pageId) return;
    
    setIsLoading(true);
    try {
      await toggleFavorite(pageId, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de favorito',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`px-2 ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <Star className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
};
