
import React, { useState } from "react";
import { SearchBar } from "../ui/SearchBar";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  FileText, 
  Calendar, 
  Star, 
  Settings,
  MoreHorizontal
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SidebarProps {
  userName: string;
  userAvatar?: string;
}

interface Page {
  id: string;
  title: string;
  icon: "file" | "calendar";
  parentId?: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [privateExpanded, setPrivateExpanded] = useState(true);
  const [newPageDialogOpen, setNewPageDialogOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [pages, setPages] = useLocalStorage<Page[]>("notion-pages", [
    { id: "doc-1", title: "Documentation", icon: "file" },
    { id: "ideas", title: "Ideas de proyectos", icon: "file" },
    { id: "resources", title: "Recursos", icon: "file" },
  ]);
  const { toast } = useToast();

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const newPage = {
        id: `page-${Date.now()}`,
        title: newPageTitle,
        icon: "file" as const,
      };
      
      setPages([...pages, newPage]);
      setNewPageTitle("");
      setNewPageDialogOpen(false);
      
      toast({
        description: "Page created successfully",
        duration: 2000,
      });
    }
  };
  
  return (
    <aside className="w-64 h-full flex flex-col border-r border-gray-200 bg-gray-50">
      {/* Workspace Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white">
            N
          </div>
          <span className="font-medium text-gray-800">Mi Workspace</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            className="pl-8 py-1 h-8 text-sm bg-gray-100 border-0"
            placeholder="Buscar..."
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Quick Links */}
        <div className="px-3 mb-2">
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
            <FileText className="h-4 w-4" />
            <span>Todas las páginas</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Calendario</span>
          </button>
        </div>

        {/* Favorites */}
        <div className="px-3 mb-1">
          <button 
            onClick={() => setFavoritesExpanded(!favoritesExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 mb-1 w-full"
          >
            {favoritesExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span>FAVORITOS</span>
          </button>
          
          {favoritesExpanded && (
            <div className="pl-2">
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                <span>Notas importantes</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                <span>Planificador semanal</span>
              </button>
            </div>
          )}
        </div>

        {/* Workspace */}
        <div className="px-3 mb-1">
          <button 
            onClick={() => setWorkspacesExpanded(!workspacesExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 mb-1 w-full"
          >
            {workspacesExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span>WORKSPACE</span>
          </button>
          
          {workspacesExpanded && (
            <div className="pl-2">
              {pages.map(page => (
                <button 
                  key={page.id}
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm group"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span className="flex-1 truncate text-left">{page.title}</span>
                  <MoreHorizontal className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Private */}
        <div className="px-3 mb-1">
          <button 
            onClick={() => setPrivateExpanded(!privateExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 mb-1 w-full"
          >
            {privateExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <span>PRIVADO</span>
          </button>
          
          {privateExpanded && (
            <div className="pl-2">
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <FileText className="h-3.5 w-3.5" />
                <span>Diario personal</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <FileText className="h-3.5 w-3.5" />
                <span>Metas</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create new button */}
      <div className="px-3 py-2">
        <button 
          className="flex items-center gap-1 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm"
          onClick={() => setNewPageDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Nueva página</span>
        </button>
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-gray-200 mt-auto">
        <div className="flex items-center gap-2">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={`${userName}'s avatar`}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-600">
                {userName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-700">{userName}</span>
          <button className="ml-auto">
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* New Page Dialog */}
      <Dialog open={newPageDialogOpen} onOpenChange={setNewPageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Page title"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="mb-4"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePage}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
