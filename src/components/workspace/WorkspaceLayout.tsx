
import React, { useState } from "react";
import { Sidebar } from "../navigation/Sidebar";
import { Header } from "../navigation/Header";
import { MobileDrawer } from "../layout/MobileDrawer";
import { CommentsPanel } from "../editor/CommentsPanel";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  userName: string;
  userAvatar?: string;
  currentPath: string[];
  pageId?: string;
}

export function WorkspaceLayout({
  children,
  userName,
  userAvatar,
  currentPath,
  pageId = "default-page",
}: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Mobile drawer */}
      <MobileDrawer 
        userAvatar={userAvatar}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div className="flex h-full">
        {/* Desktop sidebar - always visible on desktop */}
        <div className="hidden md:block h-full">
          <Sidebar userName={userName} userAvatar={userAvatar} />
        </div>

        {/* Main content */}
        <div className="flex flex-col w-full">
          <Header 
            currentPath={currentPath} 
            onMenuClick={toggleSidebar}
            pageId={pageId}
            onCommentsClick={toggleComments}
            commentsOpen={commentsOpen}
          />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Comments panel - conditionally rendered */}
      {commentsOpen && pageId !== "default-page" && (
        <CommentsPanel 
          pageId={pageId} 
          onClose={() => setCommentsOpen(false)} 
        />
      )}
    </div>
  );
}
