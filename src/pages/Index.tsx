
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";

const Index = () => {
  // En una aplicación real, esto vendría de una API o contexto de autenticación
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg"; // Imagen estática de avatar femenino
  const currentPath = ["Mi Workspace", "Documentación", "Página de notas"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <h1 className="text-3xl font-bold mb-6">Inicio</h1>
        <p className="text-gray-600 mb-4">
          Bienvenido a tu espacio de trabajo personal.
        </p>
        <PageEditor />
      </div>
    </WorkspaceLayout>
  );
};

export default Index;
