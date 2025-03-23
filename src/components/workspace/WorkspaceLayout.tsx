
import React, { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Header } from "../layout/Header";
import { MobileDrawer } from "../layout/MobileDrawer";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Mobile drawer */}
      <MobileDrawer 
        userAvatar={userAvatar}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      {/* Desktop sidebar - always visible on desktop */}
      <div className="hidden md:block fixed h-full">
        <Sidebar userName={userName} userAvatar={userAvatar} />
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full md:ml-64">
        <Header 
          currentPath={currentPath} 
          onMenuClick={toggleSidebar}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
