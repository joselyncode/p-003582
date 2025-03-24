import React, { useEffect, useState } from "react";
import { PageEditor } from "../editor/PageEditor";
import { useLocation } from "react-router-dom";
import { usePages, Block } from "@/context/PagesContext";

export function WorkspaceContent() {
  const location = useLocation();
  const { getPageIdByPath, getPageContent, updatePageContent } = usePages();
  const [pageId, setPageId] = useState<string | undefined>(undefined);
  const [pageBlocks, setPageBlocks] = useState<Block[]>([]);
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path === "/") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: []
      };
    } else if (path === "/workspace") {
      return {
        workspaceName: "Mi Workspace",
        pagePath: []
      };
    } else if (path === "/docs") {
      return {
        workspaceName: "Second brain",
        pagePath: ["Base de datos: tareas Buo"]
      };
    } else if (path === "/notes") {
      return {
        workspaceName: "Second brain",
        pagePath: ["Base de datos: tareas Buo"]
      };
    } else if (path === "/personal") {
      return {
        workspaceName: "Second brain",
        pagePath: ["Proyectos personales"]
      };
    } else if (path === "/todos") {
      return {
        workspaceName: "Second brain",
        pagePath: ["Base de datos: tareas Buo"]
      };
    } else {
      return {
        workspaceName: "Mi Workspace",
        pagePath: []
      };
    }
  };
  
  useEffect(() => {
    const loadPageContent = async () => {
      const id = getPageIdByPath(location.pathname);
      setPageId(id);
      
      if (id) {
        const content = await getPageContent(id);
        if (content) {
          setPageBlocks(content.blocks);
          setLastSaved(content.last_edited);
        } else {
          setPageBlocks([
            { id: "1", type: "heading1", content: "Untitled" }
          ]);
        }
      }
    };
    
    loadPageContent();
  }, [location.pathname, getPageIdByPath, getPageContent]);
  
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
  
  const { workspaceName, pagePath } = getPageInfo();
  
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <PageEditor 
        workspaceName={workspaceName} 
        pagePath={pagePath} 
        blocks={pageBlocks}
        onBlocksChange={handleContentChange}
        lastSaved={lastSaved}
      />
    </main>
  );
}
