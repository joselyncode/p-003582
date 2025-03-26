import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Home, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

export type PageSection = "favorite" | "workspace" | "notes" | "personal" | "projects" | string;

export type Page = {
  id?: string;
  name: string;
  icon: string;
  path: string;
  section: PageSection;
};

export type CustomSection = {
  id: string;
  name: string;
  pages: Page[];
};

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
  projects: Page[];
  customSections: CustomSection[];
  isLoading: boolean;
  loading: boolean;
  createPage: (name: string, section: PageSection) => Promise<string | undefined>;
  addPage: (page: Page) => Promise<string | undefined>;
  deletePage: (pageId: string) => Promise<boolean>;
  getPageContent: (pageId: string) => Promise<PageContent | null>;
  updatePageContent: (content: PageContent) => Promise<void>;
  toggleFavorite: (pageId: string, isFavorite: boolean, shouldNavigate: boolean) => Promise<void>;
  getPageIdByPath: (path: string) => string | undefined;
  updatePageTitle: (pageId: string, newTitle: string) => Promise<boolean>;
  movePageToSection: (pageId: string, newSection: PageSection, shouldNavigate: boolean) => Promise<boolean>;
  addCustomSection: (name: string) => Promise<string | undefined>;
  deleteCustomSection: (sectionId: string) => Promise<boolean>;
};

const PagesContext = createContext<PagesContextType>({
  favorites: [],
  workspace: [],
  personal: [],
  projects: [],
  customSections: [],
  isLoading: true,
  loading: true,
  createPage: async () => undefined,
  addPage: async () => undefined,
  deletePage: async () => false,
  getPageContent: async () => null,
  updatePageContent: async () => {},
  toggleFavorite: async () => {},
  getPageIdByPath: () => undefined,
  updatePageTitle: async () => false,
  movePageToSection: async () => false,
  addCustomSection: async () => undefined,
  deleteCustomSection: async () => false,
});

export const PagesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Page[]>([]);
  const [workspace, setWorkspace] = useState<Page[]>([]);
  const [personal, setPersonal] = useState<Page[]>([]);
  const [projects, setProjects] = useState<Page[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pagesMap, setPagesMap] = useState<Map<string, string>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        setLoading(true);
        
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*');

        if (pagesError) {
          throw pagesError;
        }

        const { data: sectionsData, error: sectionsError } = await supabase
          .from('custom_sections')
          .select('*');

        if (sectionsError) {
          throw sectionsError;
        }

        const favs: Page[] = [];
        const work: Page[] = [];
        const pers: Page[] = [];
        const proj: Page[] = [];
        const pathToIdMap = new Map<string, string>();
        const customSectionsMap = new Map<string, { name: string, pages: Page[] }>();

        if (sectionsData) {
          sectionsData.forEach((section) => {
            customSectionsMap.set(section.id, {
              name: section.name,
              pages: []
            });
          });
        }

        if (pagesData) {
          pagesData.forEach((page) => {
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
            } else if (page.section === 'projects') {
              proj.push(pageObj);
            } else if (customSectionsMap.has(page.section)) {
              const section = customSectionsMap.get(page.section);
              if (section) {
                section.pages.push(pageObj);
              }
            }

            pathToIdMap.set(page.path, page.id);
          });
        }

        const customSectionsArray: CustomSection[] = [];
        customSectionsMap.forEach((value, key) => {
          customSectionsArray.push({
            id: key,
            name: value.name,
            pages: value.pages
          });
        });

        setFavorites(favs);
        setWorkspace(work);
        setPersonal(pers);
        setProjects(proj);
        setCustomSections(customSectionsArray);
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

  const createPage = async (name: string, section: PageSection): Promise<string | undefined> => {
    try {
      const isCustomSection = section !== 'workspace' && 
                             section !== 'personal' && 
                             section !== 'notes' && 
                             section !== 'projects' && 
                             section !== 'favorite';
      
      let path;
      if (isCustomSection) {
        const sectionObj = customSections.find(s => s.id === section);
        if (!sectionObj) {
          throw new Error("Sección no encontrada");
        }
        path = `/custom/${sectionObj.name.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        path = `/${section}/${name.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
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
      console.log("Adding page with section:", page.section);
      
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

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (!data) {
        throw new Error("No data returned after page creation");
      }

      console.log("Page created in DB:", data);

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

      const isCustomSection = data.section !== 'favorite' && 
                             data.section !== 'workspace' && 
                             data.section !== 'notes' && 
                             data.section !== 'personal' &&
                             data.section !== 'projects';

      if (isCustomSection) {
        setCustomSections(prev => {
          return prev.map(section => {
            if (section.id === data.section) {
              return {
                ...section,
                pages: [...section.pages, newPage]
              };
            }
            return section;
          });
        });
      } else {
        switch (newPage.section) {
          case "favorite":
            setFavorites(prev => [...prev, newPage]);
            break;
          case "workspace":
          case "notes":
            setWorkspace(prev => [...prev, newPage]);
            break;
          case "personal":
            setPersonal(prev => [...prev, newPage]);
            break;
          case "projects":
            setProjects(prev => [...prev, newPage]);
            break;
          default:
            console.warn("Sección desconocida:", newPage.section);
        }
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
        const isCustomSection = data.section !== 'favorite' && 
                               data.section !== 'workspace' && 
                               data.section !== 'notes' && 
                               data.section !== 'personal' &&
                               data.section !== 'projects';

        if (isCustomSection) {
          setCustomSections(prev => {
            return prev.map(section => {
              if (section.id === data.section) {
                return {
                  ...section,
                  pages: section.pages.filter(page => page.id !== pageId)
                };
              }
              return section;
            });
          });
        } else {
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
            case "projects":
              setProjects(prev => prev.filter(page => page.id !== pageId));
              break;
          }
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

  const addCustomSection = async (name: string): Promise<string | undefined> => {
    try {
      const { data, error } = await supabase
        .from('custom_sections')
        .insert({
          name,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newSection: CustomSection = {
          id: data.id,
          name: data.name,
          pages: []
        };

        setCustomSections(prev => [...prev, newSection]);
        
        toast({
          description: `Se ha creado la sección "${name}"`,
        });

        return data.id;
      }

      return undefined;
    } catch (error) {
      console.error("Error creating custom section:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la sección",
        variant: "destructive",
      });
      return undefined;
    }
  };

  const deleteCustomSection = async (sectionId: string): Promise<boolean> => {
    try {
      const sectionPages = customSections.find(s => s.id === sectionId)?.pages || [];
      
      for (const page of sectionPages) {
        if (page.id) {
          await deletePage(page.id);
        }
      }

      const { error } = await supabase
        .from('custom_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      setCustomSections(prev => prev.filter(section => section.id !== sectionId));
      
      toast({
        description: "Se ha eliminado la sección",
      });

      return true;
    } catch (error) {
      console.error("Error deleting custom section:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la sección",
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

  const toggleFavorite = async (pageId: string, isFavorite: boolean, shouldNavigate: boolean = true): Promise<void> => {
    try {
      const { error } = await supabase
        .from('page_content')
        .update({ is_favorite: isFavorite })
        .eq('page_id', pageId);

      if (error) throw error;

      const allPages = [...workspace, ...personal, ...favorites, ...projects];
      const customPages = customSections.flatMap(section => section.pages);
      const page = [...allPages, ...customPages].find(p => p.id === pageId);
      
      if (page) {
        const originalSection = page.section === 'favorite' 
          ? (page.path.includes('/workspace/') ? 'workspace' : 
             page.path.includes('/notes/') ? 'notes' : 
             page.path.includes('/personal/') ? 'personal' :
             page.path.includes('/projects/') ? 'projects' : 
             customSections.find(s => page.path.includes(`/custom/${s.name.toLowerCase().replace(/\s+/g, '-')}/`))?.id || 'personal')
          : page.section;
          
        const targetSection = isFavorite ? 'favorite' : originalSection;
        
        if (page.section !== targetSection) {
          await movePageToSection(pageId, targetSection, shouldNavigate);
        }
      }

      const { data, error: fetchError } = await supabase
        .from('pages')
        .select('*');

      if (fetchError) throw fetchError;

      if (data) {
        const favs: Page[] = [];
        const work: Page[] = [];
        const pers: Page[] = [];
        const proj: Page[] = [];
        const customSectionsMap = new Map<string, { name: string, pages: Page[] }>();
        const pathToIdMap = new Map<string, string>();

        customSections.forEach(section => {
          customSectionsMap.set(section.id, {
            name: section.name,
            pages: []
          });
        });

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
          } else if (page.section === 'projects') {
            proj.push(pageObj);
          } else if (customSectionsMap.has(page.section)) {
            const section = customSectionsMap.get(page.section);
            if (section) {
              section.pages.push(pageObj);
            }
          }

          pathToIdMap.set(page.path, page.id);
        });

        const customSectionsArray: CustomSection[] = [];
        customSectionsMap.forEach((value, key) => {
          customSectionsArray.push({
            id: key,
            name: value.name,
            pages: value.pages
          });
        });

        setFavorites(favs);
        setWorkspace(work);
        setPersonal(pers);
        setProjects(proj);
        setCustomSections(customSectionsArray);
        setPagesMap(pathToIdMap);
      }

      toast({
        description: isFavorite 
          ? "Página añadida a favoritos" 
          : "Página eliminada de favoritos",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de favorito",
        variant: "destructive",
      });
    }
  };

  const movePageToSection = async (pageId: string, newSection: PageSection, shouldNavigate: boolean = true): Promise<boolean> => {
    try {
      const allPages = [...workspace, ...personal, ...favorites, ...projects];
      const customPages = customSections.flatMap(section => section.pages);
      const existingPage = [...allPages, ...customPages].find(page => page.id === pageId);
      
      if (!existingPage) {
        toast({
          title: "Error",
          description: "No se encontró la página para actualizar",
          variant: "destructive",
        });
        return false;
      }
      
      let newPath;
      if (newSection !== 'favorite' && 
          newSection !== 'workspace' && 
          newSection !== 'notes' && 
          newSection !== 'personal' &&
          newSection !== 'projects') {
        const sectionObj = customSections.find(s => s.id === newSection);
        if (!sectionObj) {
          throw new Error("Sección no encontrada");
        }
        newPath = `/custom/${sectionObj.name.toLowerCase().replace(/\s+/g, '-')}/${existingPage.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        newPath = `/${newSection}/${existingPage.name.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
      const { data, error } = await supabase
        .from('pages')
        .update({
          section: newSection,
          path: newPath
        })
        .eq('id', pageId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const updatedPage = { ...existingPage, section: newSection, path: newPath };
        
        setFavorites(prev => prev.filter(page => page.id !== pageId));
        setWorkspace(prev => prev.filter(page => page.id !== pageId));
        setPersonal(prev => prev.filter(page => page.id !== pageId));
        setProjects(prev => prev.filter(page => page.id !== pageId));
        setCustomSections(prev => 
          prev.map(section => ({
            ...section,
            pages: section.pages.filter(page => page.id !== pageId)
          }))
        );
        
        const isCustomSection = newSection !== 'favorite' && 
                               newSection !== 'workspace' && 
                               newSection !== 'notes' && 
                               newSection !== 'personal' &&
                               newSection !== 'projects';

        if (isCustomSection) {
          setCustomSections(prev => {
            return prev.map(section => {
              if (section.id === newSection) {
                return {
                  ...section,
                  pages: [...section.pages, updatedPage]
                };
              }
              return section;
            });
          });
        } else {
          switch (newSection) {
            case "favorite":
              setFavorites(prev => [...prev, updatedPage]);
              break;
            case "workspace":
            case "notes":
              setWorkspace(prev => [...prev, updatedPage]);
              break;
            case "personal":
              setPersonal(prev => [...prev, updatedPage]);
              break;
            case "projects":
              setProjects(prev => [...prev, updatedPage]);
              break;
          }
        }
        
        setPagesMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(existingPage.path);
          newMap.set(newPath, pageId);
          return newMap;
        });
        
        if (shouldNavigate) {
          window.location.href = newPath;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error moving page to section:", error);
      toast({
        title: "Error",
        description: "No se pudo mover la página a la nueva sección",
        variant: "destructive",
      });
      return false;
    }
  };

  const getPageIdByPath = (path: string): string | undefined => {
    return pagesMap.get(path);
  };

  const updatePageTitle = async (pageId: string, newTitle: string): Promise<boolean> => {
    try {
      const allPages = [...workspace, ...personal, ...favorites, ...projects];
      const customPages = customSections.flatMap(section => section.pages);
      const existingPage = [...allPages, ...customPages].find(page => page.id === pageId);
      
      if (!existingPage) {
        toast({
          title: "Error",
          description: "No se encontró la página para actualizar",
          variant: "destructive",
        });
        return false;
      }
      
      let newPath;
      const isCustomSection = existingPage.section !== 'favorite' && 
                             existingPage.section !== 'workspace' && 
                             existingPage.section !== 'notes' && 
                             existingPage.section !== 'personal' &&
                             existingPage.section !== 'projects';

      if (isCustomSection) {
        const sectionObj = customSections.find(s => s.id === existingPage.section);
        if (!sectionObj) {
          throw new Error("Sección no encontrada");
        }
        newPath = `/custom/${sectionObj.name.toLowerCase().replace(/\s+/g, '-')}/${newTitle.toLowerCase().replace(/\s+/g, '-')}`;
      } else {
        const section = existingPage.path.split('/')[1];
        newPath = `/${section}/${newTitle.toLowerCase().replace(/\s+/g, '-')}`;
      }
      
      const { data, error } = await supabase
        .from('pages')
        .update({
          name: newTitle,
          path: newPath
        })
        .eq('id', pageId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const updatedPage = { ...existingPage, name: newTitle, path: newPath };
        
        if (isCustomSection) {
          setCustomSections(prev => {
            return prev.map(section => {
              if (section.id === existingPage.section) {
                return {
                  ...section,
                  pages: section.pages.map(page => page.id === pageId ? updatedPage : page)
                };
              }
              return section;
            });
          });
        } else {
          switch (data.section) {
            case "favorite":
              setFavorites(prev => prev.map(page => page.id === pageId ? updatedPage : page));
              break;
            case "workspace":
            case "notes":
              setWorkspace(prev => prev.map(page => page.id === pageId ? updatedPage : page));
              break;
            case "personal":
              setPersonal(prev => prev.map(page => page.id === pageId ? updatedPage : page));
              break;
            case "projects":
              setProjects(prev => prev.map(page => page.id === pageId ? updatedPage : page));
              break;
          }
        }
        
        setPagesMap(prev => {
          const newMap = new Map(prev);
          newMap.delete(existingPage.path);
          newMap.set(newPath, pageId);
          return newMap;
        });
        
        toast({
          description: `Se ha actualizado el título de la página a "${newTitle}"`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error updating page title:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el título de la página",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <PagesContext.Provider 
      value={{ 
        favorites, 
        workspace, 
        personal,
        projects,
        customSections,
        isLoading,
        loading,
        createPage,
        addPage,
        deletePage,
        getPageContent, 
        updatePageContent,
        toggleFavorite,
        getPageIdByPath,
        updatePageTitle,
        movePageToSection,
        addCustomSection,
        deleteCustomSection
      }}
    >
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => useContext(PagesContext);

