
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";

const Notes = () => {
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Página de notas"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4">
        <PageEditor 
          workspaceName="Second brain"
          pagePath={["Página de notas"]}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default Notes;
