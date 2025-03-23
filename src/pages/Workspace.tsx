
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { WorkspaceContent } from "@/components/workspace/WorkspaceContent";

const Workspace = () => {
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Mi Workspace"];

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

export default Workspace;
