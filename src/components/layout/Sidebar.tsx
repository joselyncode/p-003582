
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../ui/SearchBar";
import { SettingsModal } from "./SettingsModal";
import { NewPageModal } from "./NewPageModal";
import { DeletePageDialog } from "./DeletePageDialog";
import { Home, FileText, Star, Users, Settings, Plus, Trash2, User, LayoutDashboard } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { usePages } from "@/context/PagesContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  userName?: string;
  userAvatar?: string;
}

export function Sidebar({ userAvatar }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { settings } = useSettings();
  const { toast } = useToast();
  const { favorites, workspace, personal, loading, createPage, deletePage } = usePages();

  // Lista de secciones y páginas fijas
  const defaultFavorites = [
    { name: "Inicio", icon: Home, path: "/" },
    { name: "Documentación", icon: FileText, path: "/docs" },
    { name: "Workspace", icon: LayoutDashboard, path: "/workspace" },
    { name: "Configuración", icon: Settings, path: "/settings" },
  ];

  // Función para crear una nueva página
  const handleCreatePage = async (name) => {
    try {
      const section = "workspace";
      await createPage(name, section);
      setNewPageOpen(false);
      
      toast({
        description: `Se ha creado la página "${name}"`,
      });
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive",
      });
    }
  };

  // Función para mostrar el diálogo de confirmación de eliminación
  const handleDeleteClick = (page) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  // Función para eliminar la página
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deletePage(pageToDelete.id);
      if (success) {
        toast({
          description: `Se ha eliminado la página "${pageToDelete.name}"`,
        });
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la página",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  // Funciones para filtrar los elementos según la búsqueda
  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredFavorites = filterItems([...defaultFavorites, ...favorites]);
  const filteredWorkspace = filterItems(workspace);
  const filteredPersonal = filterItems(personal);

  // Determinar si una sección debe mostrarse (si hay elementos filtrados)
  const showFavorites = filteredFavorites.length > 0;
  const showWorkspace = true; // Always show Workspace section
  const showPersonal = filteredPersonal.length > 0;

  // Renderizar un elemento de página con opción de eliminar
  const renderPageItem = (item, index, canDelete = true) => (
    <li key={index} className="group relative">
      <Link
        to={item.path}
        className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
      >
        {item.icon && typeof item.icon === 'function' ? (
          <item.icon className="h-4 w-4 mr-3 text-gray-500" />
        ) : (
          <FileText className="h-4 w-4 mr-3 text-gray-500" />
        )}
        <span className="truncate">{item.name}</span>
      </Link>
      
      {canDelete && item.id && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDeleteClick(item);
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Eliminar ${item.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  );

  return (
    <div className="w-64 h-full bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Logo y búsqueda */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Workspace</h1>
        </div>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Sección Favoritos */}
        {showFavorites && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Favoritos
            </h2>
            <ul>
              {filteredFavorites.map((item, index) => 
                renderPageItem(item, index, item.id != null)
              )}
            </ul>
          </div>
        )}

        {/* Sección Workspace */}
        {showWorkspace && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workspace
              </h2>
              <button
                onClick={() => setNewPageOpen(true)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar página"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul>
              {filteredWorkspace.map((item, index) => 
                renderPageItem(item, index)
              )}
              {filteredWorkspace.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-500 italic">
                  No hay páginas en el workspace
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Sección Personal */}
        {showPersonal && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Personal
              </h2>
              <button
                onClick={() => {
                  setNewPageOpen(true);
                }}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar página personal"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul>
              {filteredPersonal.map((item, index) => 
                renderPageItem(item, index)
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Perfil de usuario */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 rounded-full">
            {settings.userAvatar ? (
              <AvatarImage 
                src={settings.userAvatar} 
                alt={settings.userName}
              />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0 ml-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {settings.userName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Mi cuenta
            </p>
          </div>
          <button 
            onClick={() => setSettingsOpen(true)}
            className="ml-2 p-1.5 rounded-full hover:bg-gray-200"
            aria-label="Configuración"
          >
            <Settings className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Modal de configuración */}
      <SettingsModal 
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />

      {/* Modal de nueva página */}
      <NewPageModal
        open={newPageOpen}
        onOpenChange={setNewPageOpen}
        onCreate={handleCreatePage}
        defaultSection="workspace"
      />

      {/* Diálogo de confirmación para eliminar página */}
      {pageToDelete && (
        <DeletePageDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onDelete={handleDeletePage}
          pageName={pageToDelete.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
