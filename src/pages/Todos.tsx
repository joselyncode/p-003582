
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";

const Todos = () => {
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Tareas pendientes"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <PageEditor 
          workspaceName="Second brain"
          pagePath={["Tareas pendientes"]}
        />
      </div>
    </WorkspaceLayout>
  );
};

export default Todos;
