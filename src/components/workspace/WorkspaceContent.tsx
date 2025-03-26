import React, { useEffect, useState } from "react";
import { PageEditor } from "../editor/PageEditor";
import { useLocation } from "react-router-dom";
import { usePages, Block } from "@/context/PagesContext";
import { toast } from "sonner";

export function WorkspaceContent() {
  const location = useLocation();
  const { getPageIdByPath, getPageContent, updatePageContent, workspace, personal, favorites } = usePages();
  const [pageId, setPageId] = useState<string | undefined>(undefined);
  const [pageBlocks, setPageBlocks] = useState<Block[]>([]);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Untitled");
  
  const getPageInfo = () => {
    const path = location.pathname;
    
    // Buscar la página actual para obtener el título correcto
    const allPages = [...workspace, ...personal, ...favorites];
    const currentPage = allPages.find(page => page.path === path);
    const pageName = currentPage ? currentPage.name : getDefaultPageName(path);
    
    if (path === "/") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Inicio"],
        pageTitle: "Inicio"
      };
    } else if (path === "/workspace") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Workspace"],
        pageTitle: "Workspace"
      };
    } else if (path === "/docs") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Documentación"],
        pageTitle: "Documentación"
      };
    } else if (path === "/notes") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Notas"],
        pageTitle: "Notas"
      };
    } else if (path === "/personal") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Personal"],
        pageTitle: "Personal"
      };
    } else if (path === "/todos") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Tareas"],
        pageTitle: "Tareas"
      };
    } else if (path === "/favorite") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Favoritos"],
        pageTitle: "Favoritos"
      };
    } else {
      return {
        workspaceName: "Mi Workspace",
        pagePath: ["Página"],
        pageTitle: pageName
      };
    }
  };
  
  const getDefaultPageName = (path: string): string => {
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Convertir guiones a espacios y capitalizar
    if (lastPart) {
      return lastPart
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return "Página";
  };
  
  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const id = getPageIdByPath(location.pathname);
        setPageId(id);
        
        // Actualizar el título de la página
        const { pageTitle } = getPageInfo();
        setPageTitle(pageTitle);
        
        if (id) {
          const content = await getPageContent(id);
          if (content) {
            setPageBlocks(content.blocks);
            setLastSaved(content.last_edited);
          } else {
            setPageBlocks([]);
          }
        }
      } catch (error) {
        console.error("Error cargando contenido de página:", error);
        // No mostramos el toast de error para evitar el popup
      }
    };
    
    loadPageContent();
  }, [location.pathname, getPageIdByPath, getPageContent, workspace, personal, favorites]);
  
  const saveContent = async () => {
    if (pageId && hasUnsavedChanges) {
      const now = Date.now();
      await updatePageContent({
        page_id: pageId,
        blocks: pageBlocks,
        last_edited: now,
        is_favorite: false
      });
      
      setLastSaved(now);
      setHasUnsavedChanges(false);
      console.log("Auto-saved content");
    }
  };
  
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const timeout = setTimeout(saveContent, 2000);
      setAutoSaveTimeout(timeout);
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [pageBlocks, hasUnsavedChanges]);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges) {
        saveContent();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (hasUnsavedChanges) {
        saveContent();
      }
    };
  }, [hasUnsavedChanges]);
  
  const handleContentChange = (newBlocks: Block[]) => {
    setPageBlocks(newBlocks);
    setHasUnsavedChanges(true);
  };
  
  const handleTitleChange = (newTitle: string) => {
    if (newTitle && newTitle !== pageTitle) {
      setPageTitle(newTitle);
      // Aquí se podría implementar la actualización del título en la base de datos
      // por ahora solo actualizamos el estado local
    }
  };
  
  const { workspaceName, pagePath } = getPageInfo();
  
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <PageEditor 
        workspaceName={workspaceName} 
        pagePath={pagePath} 
        blocks={pageBlocks}
        onBlocksChange={handleContentChange}
        lastSaved={lastSaved}
        allowTitleEdit={true}
        initialTitle={pageTitle}
        onTitleChange={handleTitleChange}
      />
    </main>
  );
}
