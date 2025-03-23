import React from "react";
import { Sidebar } from "../layout/Sidebar";
import { Header } from "../layout/Header";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  userName: string;
  userAvatar?: string;
  currentPath: string[];
}

export function WorkspaceLayout({
  children,
  userName,
  userAvatar,
  currentPath,
}: WorkspaceLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex h-screen">
        <Sidebar userName={userName} userAvatar={userAvatar} />
        <div className="flex-1">
          <Header currentPath={currentPath} />
          {children}
        </div>
      </div>
    </div>
  );
}
