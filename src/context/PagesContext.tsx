import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Home, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

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
  type: "text" | "heading1" | "heading2" | "heading3" | "bullet" | "numbered" | "todo" | "table";
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
  loading: boolean;
  createPage: (name: string, section: "workspace" | "personal" | "notes") => Promise<string | undefined>;
  addPage: (page: Page) => Promise<string | undefined>;
  deletePage: (pageId: string) => Promise<boolean>;
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
  loading: true,
  createPage: async () => undefined,
  addPage: async () => undefined,
  deletePage: async () => false,
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
  const [loading, setLoading] = useState(true);
  const [pagesMap, setPagesMap] = useState<Map<string, string>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        setLoading(true);
        const { data, error } = await supabase
          .from('pages')
          .select('*');

        if (error) {
          throw error;
        }

        const favs: Page[] = [];
        const work: Page[] = [];
        const pers: Page[] = [];
        const pathToIdMap = new Map<string, string>();

        if (data) {
          data.forEach((page) => {
            const pageObj: Page = {
              id: page.id,
              name: page.name,
              icon: page.icon,
              path: page.path,
              section: page.section as PageSection
            };

            if (page.section === 'favorite') {
              favs.push(pageObj);
            } else if (page.section === 'workspace' || page.section === 'notes') {
              work.push(pageObj);
            } else if (page.section === 'personal') {
              pers.push(pageObj);
            }

            pathToIdMap.set(page.path, page.id);
          });
        }

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
        setLoading(false);
      }
    };

    fetchPages();
  }, [toast]);

  const createPage = async (name: string, section: "workspace" | "personal" | "notes"): Promise<string | undefined> => {
    try {
      const path = `/${section}/${name.toLowerCase().replace(/\s+/g, '-')}`;
      
      return await addPage({
        name,
        icon: 'FileText',
        path,
        section
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const addPage = async (page: Page): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          name: page.name,
          icon: page.icon || 'FileText',
          path: page.path,
          section: page.section
        })
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error("No data returned after page creation");
      }

      const { error: contentError } = await supabase
        .from('page_content')
        .insert({
          page_id: data.id,
          blocks: [],
          last_edited: Date.now(),
          is_favorite: false
        });

      if (contentError) throw contentError;

      const newPage: Page = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        path: data.path,
        section: data.section as PageSection
      };

      switch (page.section) {
        case "favorite":
          setFavorites(prev => [...prev, newPage]);
          break;
        case "workspace":
        case "notes":
          setWorkspace(prev => [...prev, { ...newPage, section: "workspace" as PageSection }]);
          break;
        case "personal":
          setPersonal(prev => [...prev, newPage]);
          break;
      }

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

  const deletePage = async (pageId: string): Promise<boolean> => {
    try {
      const { error: contentError } = await supabase
        .from('page_content')
        .delete()
        .eq('page_id', pageId);

      if (contentError) throw contentError;

      const { data, error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        switch (data.section) {
          case "favorite":
            setFavorites(prev => prev.filter(page => page.id !== pageId));
            break;
          case "workspace":
          case "notes":
            setWorkspace(prev => prev.filter(page => page.id !== pageId));
            break;
          case "personal":
            setPersonal(prev => prev.filter(page => page.id !== pageId));
            break;
        }

        setPagesMap(prev => {
          const newMap = new Map(prev);
          for (const [path, id] of newMap.entries()) {
            if (id === pageId) {
              newMap.delete(path);
              break;
            }
          }
          return newMap;
        });

        toast({
          description: `Se ha eliminado la página "${data.name}"`,
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la página",
        variant: "destructive",
      });
      return false;
    }
  };

  const getPageContent = async (pageId: string): Promise<PageContent | null> => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_id', pageId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
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
        loading,
        createPage,
        addPage,
        deletePage,
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
