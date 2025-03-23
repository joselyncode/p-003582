
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Home, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define types for our pages
export type PageSection = "favorite" | "workspace" | "notes" | "personal";
export type Page = {
  id?: string;
  name: string;
  icon: string;
  path: string;
  section: PageSection;
};

// Define type for page content
export type Block = {
  id: string;
  type: "text" | "heading1" | "heading2" | "heading3" | "todo" | "bullet" | "numbered";
  content: string;
};

export type PageContent = {
  id?: string;
  page_id: string;
  blocks: Block[];
  last_edited: number;
  is_favorite: boolean;
};

type PagesContextType = {
  favorites: Page[];
  workspace: Page[];
  personal: Page[];
  isLoading: boolean;
  addPage: (page: Page) => Promise<string | undefined>;
  getPageContent: (pageId: string) => Promise<PageContent | null>;
  updatePageContent: (content: PageContent) => Promise<void>;
  toggleFavorite: (pageId: string, isFavorite: boolean) => Promise<void>;
  getPageIdByPath: (path: string) => string | undefined;
};

const PagesContext = createContext<PagesContextType>({
  favorites: [],
  workspace: [],
  personal: [],
  isLoading: true,
  addPage: async () => undefined,
  getPageContent: async () => null,
  updatePageContent: async () => {},
  toggleFavorite: async () => {},
  getPageIdByPath: () => undefined,
});

export const PagesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Page[]>([]);
  const [workspace, setWorkspace] = useState<Page[]>([]);
  const [personal, setPersonal] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesMap, setPagesMap] = useState<Map<string, string>>(new Map()); // path to id mapping
  const { toast } = useToast();

  // Initialize by fetching pages from Supabase
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('*');

        if (error) {
          throw error;
        }

        // Process data and update state
        const favs: Page[] = [];
        const work: Page[] = [];
        const pers: Page[] = [];
        const pathToIdMap = new Map<string, string>();

        data.forEach((page) => {
          const pageObj: Page = {
            id: page.id,
            name: page.name,
            icon: page.icon,
            path: page.path,
            section: page.section as PageSection
          };

          // Add to the appropriate section array
          if (page.section === 'favorite') {
            favs.push(pageObj);
          } else if (page.section === 'workspace' || page.section === 'notes') {
            work.push(pageObj);
          } else if (page.section === 'personal') {
            pers.push(pageObj);
          }

          // Add to path mapping
          pathToIdMap.set(page.path, page.id);
        });

        setFavorites(favs);
        setWorkspace(work);
        setPersonal(pers);
        setPagesMap(pathToIdMap);
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las páginas",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [toast]);

  // Add a new page to the database and update state
  const addPage = async (page: Page): Promise<string | undefined> => {
    try {
      // Insert into the database
      const { data, error } = await supabase
        .from('pages')
        .insert({
          name: page.name,
          icon: page.icon || 'FileText',
          path: page.path,
          section: page.section
        })
        .select('*')
        .single();

      if (error) throw error;

      // Create empty content for the page
      const { error: contentError } = await supabase
        .from('page_content')
        .insert({
          page_id: data.id,
          blocks: [
            { id: "1", type: "heading1", content: page.name },
            { id: "2", type: "text", content: "Start writing..." }
          ],
          last_edited: Date.now(),
          is_favorite: false
        });

      if (contentError) throw contentError;

      // Add to local state
      const newPage: Page = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        path: data.path,
        section: data.section
      };

      // Update the appropriate section
      switch (page.section) {
        case "favorite":
          setFavorites(prev => [...prev, newPage]);
          break;
        case "workspace":
        case "notes":
          setWorkspace(prev => [...prev, { ...newPage, section: "workspace" }]);
          break;
        case "personal":
          setPersonal(prev => [...prev, newPage]);
          break;
      }

      // Update path to id mapping
      setPagesMap(prev => new Map(prev.set(data.path, data.id)));

      toast({
        description: `Se ha creado la página "${page.name}"`,
      });

      return data.id;
    } catch (error) {
      console.error("Error adding page:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive",
      });
      return undefined;
    }
  };

  // Get content for a specific page
  const getPageContent = async (pageId: string): Promise<PageContent | null> => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_id', pageId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data as PageContent;
    } catch (error) {
      console.error("Error fetching page content:", error);
      return null;
    }
  };

  // Update content of a page
  const updatePageContent = async (content: PageContent): Promise<void> => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({
          blocks: content.blocks,
          last_edited: content.last_edited,
          is_favorite: content.is_favorite
        })
        .eq('page_id', content.page_id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating page content:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el contenido",
        variant: "destructive",
      });
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (pageId: string, isFavorite: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({ is_favorite: isFavorite })
        .eq('page_id', pageId);

      if (error) throw error;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de favorito",
        variant: "destructive",
      });
    }
  };

  // Get page ID from path
  const getPageIdByPath = (path: string): string | undefined => {
    return pagesMap.get(path);
  };

  return (
    <PagesContext.Provider 
      value={{ 
        favorites, 
        workspace, 
        personal, 
        isLoading,
        addPage, 
        getPageContent, 
        updatePageContent,
        toggleFavorite,
        getPageIdByPath
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => useContext(PagesContext);
