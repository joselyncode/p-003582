
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { SettingsContent } from "@/components/settings/SettingsContent";

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
      <SettingsContent />
    </WorkspaceLayout>
  );
};

export default Settings;
