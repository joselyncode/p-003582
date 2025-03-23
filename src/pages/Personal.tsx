
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";

const Personal = () => {
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Proyectos personales"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <h1 className="text-3xl font-bold mb-6">Proyectos personales</h1>
        <p className="text-gray-600 mb-4">
          Administra tus proyectos personales en esta página.
        </p>
        <PageEditor />
      </div>
    </WorkspaceLayout>
  );
};

export default Personal;
