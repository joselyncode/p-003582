
import React, { createContext, useContext, useState, ReactNode } from "react";
import { FileText } from "lucide-react";

// Define types for our pages
export type PageSection = "favorite" | "workspace" | "notes" | "personal";
export type Page = {
  name: string;
  icon: any;
  path: string;
  section: PageSection;
};

type PagesContextType = {
  favorites: Page[];
  workspace: Page[];
  personal: Page[];
  addPage: (page: Page) => void;
};

const defaultPages = {
  favorites: [
    { name: "Inicio", icon: "Home", path: "/", section: "favorite" as PageSection },
    { name: "Documentación", icon: "FileText", path: "/docs", section: "favorite" as PageSection },
    { name: "Configuración", icon: "Settings", path: "/settings", section: "favorite" as PageSection },
  ],
  workspace: [
    { name: "Mi Workspace", icon: "FileText", path: "/workspace", section: "workspace" as PageSection },
    { name: "Documentación", icon: "FileText", path: "/docs", section: "workspace" as PageSection },
    { name: "Página de notas", icon: "FileText", path: "/notes", section: "workspace" as PageSection },
  ],
  personal: [
    { name: "Proyectos personales", icon: "FileText", path: "/personal", section: "personal" as PageSection },
    { name: "Tareas pendientes", icon: "FileText", path: "/todos", section: "personal" as PageSection },
  ],
};

const PagesContext = createContext<PagesContextType>({
  favorites: defaultPages.favorites,
  workspace: defaultPages.workspace,
  personal: defaultPages.personal,
  addPage: () => {},
});

export const PagesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Page[]>(defaultPages.favorites);
  const [workspace, setWorkspace] = useState<Page[]>(defaultPages.workspace);
  const [personal, setPersonal] = useState<Page[]>(defaultPages.personal);

  const addPage = (page: Page) => {
    switch (page.section) {
      case "favorite":
        setFavorites(prev => [...prev, page]);
        break;
      case "workspace":
        setWorkspace(prev => [...prev, page]);
        break;
      case "personal":
        setPersonal(prev => [...prev, page]);
        break;
      case "notes":
        // Notes are part of workspace in our UI
        setWorkspace(prev => [...prev, { ...page, section: "workspace" }]);
        break;
    }
  };

  return (
    <PagesContext.Provider value={{ favorites, workspace, personal, addPage }}>
      {children}
    </PagesContext.Provider>
  );
};

export const usePages = () => useContext(PagesContext);
