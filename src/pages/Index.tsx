
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { WorkspaceContent } from "@/components/workspace/WorkspaceContent";

const Index = () => {
  // En una aplicación real, esto vendría de una API o contexto de autenticación
  const userName = "Joselyn Monge";
  const userAvatar = "https://i.pravatar.cc/100"; // URL de avatar de placeholder
  const currentPath = ["Mi Workspace", "Documentación", "Página de notas"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <WorkspaceContent />
    </WorkspaceLayout>
  );
};

export default Index;
