
import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";

const Docs = () => {
  // Using the same user data as other pages for consistency
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Documentación"];

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="px-8 py-4 max-w-4xl mx-auto max-sm:px-4">
        <h1 className="text-3xl font-bold mb-6">Documentación</h1>
        <p className="text-gray-600 mb-4">
          Esta página contiene la documentación del proyecto.
        </p>
      </div>
    </WorkspaceLayout>
  );
};

export default Docs;
