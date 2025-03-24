
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";
import { useSettings } from "@/hooks/use-settings";

const Index = () => {
  const { settings } = useSettings();
  const userAvatar = settings.userAvatar || "/images/female-avatar.svg";
  
  // Definir una estructura de breadcrumb simplificada
  const currentPath = ["Mi Workspace"];

  return (
    <WorkspaceLayout
      userName={settings.userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <PageEditor 
          workspaceName="Mi Workspace"
          pagePath={currentPath}
          allowTitleEdit={true}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default Index;
