
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { PageEditor } from "@/components/editor/PageEditor";
import { useSettings } from "@/hooks/use-settings";

const Settings = () => {
  const { settings } = useSettings();
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Configuración"];

  return (
    <WorkspaceLayout
      userName={settings.userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <PageEditor 
          workspaceName="Mi Workspace"
          pagePath={["Configuración"]}
          initialTitle="Configuración"
        />
        <SettingsContent />
      </div>
    </WorkspaceLayout>
  );
};

export default Settings;
