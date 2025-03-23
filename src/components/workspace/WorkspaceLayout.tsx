
import React, { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { Header } from "../layout/Header";
import { Menu } from "lucide-react";

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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-transform transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar userName={userName} userAvatar={userAvatar} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
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
