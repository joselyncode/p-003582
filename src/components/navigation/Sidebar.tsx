
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Settings, 
  User, 
  Plus, 
  Folder, 
  Inbox, 
  FolderPlus,
  FilePlus,
  CalendarClock,
  PlusSquare, 
  Home,
  PanelLeft,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePages } from "@/context/PagesContext";
import { useState } from "react";
import { NewPageModal } from "../layout/NewPageModal";
import { DeletePageDialog } from "../layout/DeletePageDialog";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  userName: string;
  userAvatar?: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workspace, personal, favorites, loading, createPage, deletePage } = usePages();
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSection, setSelectedSection] = useState<"workspace" | "personal" | "notes">("workspace");
  const [pageToDelete, setPageToDelete] = useState<{ id: string, name: string } | null>(null);
  
  const handleNewPage = () => {
    setShowNewPageModal(true);
  };
  
  const handleCreatePage = async (name: string, section: "workspace" | "personal" | "notes") => {
    try {
      const newPageId = await createPage(name, section);
      
      if (newPageId) {
        toast({
          title: "Página creada",
          description: `Se ha creado la página "${name}" con éxito`,
        });
        
        navigate(`/${section}/${newPageId}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive",
      });
    }
    
    setShowNewPageModal(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPageToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deletePage(pageToDelete.id);
      if (success) {
        setShowDeleteDialog(false);
        toast({
          description: `Página "${pageToDelete.name}" eliminada con éxito`,
        });
      }
    } catch (error) {
      console.error("Error al eliminar la página:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la página",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPageToDelete(null);
    }
  };
  
  // CSS for the delete button that appears on hover
  const deleteButtonClass = "opacity-0 group-hover:opacity-100 absolute right-0 flex items-center justify-center p-1 rounded-md hover:bg-gray-200 transition-opacity";
  
  return (
    <div className="w-64 h-full bg-sidebar border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-2 p-3">
        <div className="bg-primary w-8 h-8 flex items-center justify-center rounded text-white font-bold">
          N
        </div>
        <h1 className="text-base font-semibold">Mi Workspace</h1>
      </div>
      
      <div className="relative px-3 py-2">
        <Input
          placeholder="Buscar..."
          className="h-8 bg-gray-100 border-0 focus-visible:ring-1"
        />
      </div>
      
      <div className="p-1">
        <Link to="/all-pages" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700">
          <FileText className="h-4 w-4" />
          <span>Todas las páginas</span>
        </Link>
        
        <Link to="/calendar" className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>Calendario</span>
        </Link>
      </div>
      
      <Separator className="my-2" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="text-xs uppercase font-medium text-gray-500">Workspace</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-gray-500"
                    onClick={() => {
                      setSelectedSection("workspace");
                      handleNewPage();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nueva página de workspace</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {loading ? (
            <div className="px-2 py-1 text-sm text-gray-500">Cargando...</div>
          ) : (
            workspace.map((page) => (
              <div key={page.id} className="group relative">
                <Link
                  to={page.path}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700 w-full pr-8"
                >
                  <Folder className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{page.name}</span>
                </Link>
                {page.id && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={deleteButtonClass}
                          onClick={(e) => handleDeleteClick(e, page.id!, page.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Eliminar página</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="text-xs uppercase font-medium text-gray-500">Personal</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-gray-500"
                    onClick={() => {
                      setSelectedSection("personal");
                      handleNewPage();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nueva página personal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {loading ? (
            <div className="px-2 py-1 text-sm text-gray-500">Cargando...</div>
          ) : (
            personal.map((page) => (
              <div key={page.id} className="group relative">
                <Link
                  to={page.path}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700 w-full pr-8"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{page.name}</span>
                </Link>
                {page.id && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={deleteButtonClass}
                          onClick={(e) => handleDeleteClick(e, page.id!, page.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Eliminar página</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="text-xs uppercase font-medium text-gray-500">Notas</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-gray-500"
                    onClick={() => {
                      setSelectedSection("notes");
                      handleNewPage();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nueva nota</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {loading ? (
            <div className="px-2 py-1 text-sm text-gray-500">Cargando...</div>
          ) : (
            favorites.map((page) => (
              <div key={page.id} className="group relative">
                <Link
                  to={page.path}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700 w-full pr-8"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{page.name}</span>
                </Link>
                {page.id && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={deleteButtonClass}
                          onClick={(e) => handleDeleteClick(e, page.id!, page.name)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Eliminar página</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="p-2 border-t border-gray-200">
        <button 
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"
          onClick={() => navigate('/settings')}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {userName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">Mi Cuenta</div>
          </div>
        </button>
      </div>
      
      <NewPageModal 
        open={showNewPageModal} 
        onOpenChange={setShowNewPageModal}
        onCreate={(name) => handleCreatePage(name, selectedSection)}
        defaultSection={selectedSection}
      />

      {pageToDelete && (
        <DeletePageDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onDelete={handleDeleteConfirm}
          pageName={pageToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
