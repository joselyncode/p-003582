
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { SettingsContent } from "@/components/settings/SettingsContent";

const Settings = () => {
  // En una aplicación real, esto vendría de una API o contexto de autenticación
  const userName = "Carlos Mendoza";
  const userAvatar = "https://i.pravatar.cc/100"; // URL de avatar de placeholder
  const currentPath = ["Configuración"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <SettingsContent />
    </WorkspaceLayout>
  );
};

export default Settings;
