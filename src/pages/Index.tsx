import React from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { WorkspaceContent } from "@/components/workspace/WorkspaceContent";

const Index = () => {
  // In a real application, this would come from an API or auth context
  const userName = "John Smith";
  const userAvatar = "https://i.pravatar.cc/100"; // Placeholder avatar URL
  const currentPath = ["Documentation", "Getting Started"];

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

export default Index;
