
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { PageEditor } from "@/components/editor/PageEditor";

const Settings = () => {
  // En una aplicación real, esto vendría de una API o contexto de autenticación
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg"; // Imagen estática de avatar femenino
  const currentPath = ["Configuración"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <PageEditor />
        <SettingsContent />
      </div>
    </WorkspaceLayout>
  );
};

export default Settings;
