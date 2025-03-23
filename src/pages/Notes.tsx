
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
        <h1 className="text-3xl font-bold mb-6">Página de notas</h1>
        <p className="text-gray-600 mb-4">
          Aquí puedes agregar y organizar tus notas personales.
        </p>
        <PageEditor />
      </div>
    </WorkspaceLayout>
  );
};

export default Notes;
