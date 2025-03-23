
import React from "react";
import { Sidebar } from "../navigation/Sidebar";
import { Header } from "../navigation/Header";

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
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar userName={userName} userAvatar={userAvatar} />
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header currentPath={currentPath} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
