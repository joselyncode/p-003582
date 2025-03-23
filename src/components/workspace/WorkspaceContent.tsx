
import React from "react";
import { PageEditor } from "../editor/PageEditor";
import { useLocation } from "react-router-dom";

export function WorkspaceContent() {
  const location = useLocation();
  
  // Obtener información de la ruta actual para mostrar en la navegación
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
  
  const { workspaceName, pagePath } = getPageInfo();
  
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <PageEditor workspaceName={workspaceName} pagePath={pagePath} />
    </main>
  );
}
