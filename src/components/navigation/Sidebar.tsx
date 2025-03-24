
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../ui/SearchBar";
import { SettingsModal } from "../layout/SettingsModal";
import { NewPageModal } from "../layout/NewPageModal";
import { DeletePageDialog } from "../layout/DeletePageDialog";
import { 
  Home, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Calendar,
  Database,
  Folder,
  LayoutDashboard,
  Users
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { usePages } from "@/context/PagesContext";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface SidebarProps {
  userName?: string;
  userAvatar?: string;
}

// Type for default menu items with Lucide icon components
interface DefaultMenuItem {
  name: string;
  icon: React.FC<any>; // For Lucide icons
  path: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [newPageSection, setNewPageSection] = useState<"workspace" | "notes" | "personal">("workspace");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>("sidebar-collapsed", false);
  const { settings } = useSettings();
  const { toast } = useToast();
  const { favorites, workspace, personal, createPage, deletePage } = usePages();

  // Lista de secciones y páginas fijas con iconos mejorados
  const defaultFavorites: DefaultMenuItem[] = [
    { name: "Inicio", icon: Home, path: "/" },
    { name: "Documentación", icon: FileText, path: "/docs" },
    { name: "Configuración", icon: Settings, path: "/settings" },
  ];

  // Separar páginas de workspace y notas
  const workspacePages = workspace.filter(page => page.section === "workspace" || page.path.includes("/workspace/"));
  const notesPages = workspace.filter(page => page.section === "notes" || page.path.includes("/notes/"));
  const personalPages = personal.filter(page => page.section === "personal" || page.path.includes("/personal/"));

  // Función para crear una nueva página
  const handleCreatePage = async (name: string) => {
    try {
      console.log("Creando página en sección:", newPageSection);
      const pageId = await createPage(name, newPageSection);
      setNewPageOpen(false);
      
      if (pageId) {
        toast({
          description: `Se ha creado la página "${name}" en la sección ${newPageSection}`,
        });
      }
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

  // Eliminar páginas duplicadas
  const uniqueFavorites = favorites.filter(fav => 
    !defaultFavorites.some(def => def.path === fav.path)
  );
  
  // Filtrar favoritos pero manteniendo los tipos separados
  const filteredDefaultFavorites = filterItems(defaultFavorites);
  const filteredCustomFavorites = filterItems(uniqueFavorites);
  const filteredWorkspacePages = filterItems(workspacePages);
  const filteredNotesPages = filterItems(notesPages);
  const filteredPersonalPages = filterItems(personalPages);

  // Determinar si una sección debe mostrarse (si hay elementos filtrados)
  const showFavorites = filteredDefaultFavorites.length > 0 || filteredCustomFavorites.length > 0;
  const showWorkspace = filteredWorkspacePages.length > 0;
  const showNotes = filteredNotesPages.length > 0;
  const showPersonal = filteredPersonalPages.length > 0;

  // Iconos para elementos del workspace
  const getWorkspaceIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('calendar') || lowerName.includes('calendario')) return Calendar;
    if (lowerName.includes('database') || lowerName.includes('base de datos')) return Database;
    if (lowerName.includes('document') || lowerName.includes('documento')) return FileText;
    return FileText;
  };

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

  const renderFavoriteItem = (item, index) => (
    <li key={index} className="group relative">
      <Link
        to={item.path}
        className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
      >
        {item.name.toLowerCase() === "inicio" ? (
          <Home className="h-4 w-4 mr-3 text-gray-500" />
        ) : item.name.toLowerCase().includes("document") || item.name.toLowerCase().includes("documentación") ? (
          <FileText className="h-4 w-4 mr-3 text-gray-500" />
        ) : item.name.toLowerCase().includes("config") || item.name.toLowerCase().includes("configuración") ? (
          <Settings className="h-4 w-4 mr-3 text-gray-500" />
        ) : (
          <Star className="h-4 w-4 mr-3 text-gray-500" />
        )}
        <span className="truncate">{item.name}</span>
      </Link>
    </li>
  );

  // Función para toggle el estado del sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Función para abrir el modal de nueva página con sección específica
  const openNewPageModal = (section: "workspace" | "notes" | "personal") => {
    setNewPageSection(section);
    setNewPageOpen(true);
  };

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} h-full bg-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300 relative`}>
      {/* Botón para colapsar/expandir el sidebar */}
      <button
        onClick={toggleSidebar}
        className="absolute right-0 top-16 transform translate-x-1/2 bg-white p-1.5 rounded-full shadow-md text-gray-500 hover:text-gray-800 z-10 border border-gray-200 flex items-center justify-center"
        aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Logo y búsqueda */}
      <div className={`p-4 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Notion-like icon */}
            <div className="h-5 w-5 bg-blue-600 text-white rounded flex items-center justify-center mr-2 flex-shrink-0">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
                <path d="M4 4h8v1.5H4V4zm0 3h8v1.5H4V7zm0 3h5v1.5H4V10z" />
              </svg>
            </div>
            {!sidebarCollapsed && <h1 className="text-xl font-bold">Workspace</h1>}
          </div>
        </div>
        {!sidebarCollapsed && <SearchBar onSearch={setSearchQuery} />}
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Sección Favoritos */}
        {showFavorites && !sidebarCollapsed && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Favoritos
            </h2>
            <ul>
              {filteredDefaultFavorites.map((item, index) => 
                renderFavoriteItem(item, index)
              )}
              {filteredCustomFavorites.map((item, index) => 
                renderPageItem(item, index + filteredDefaultFavorites.length)
              )}
            </ul>
          </div>
        )}

        {/* Versión colapsada - solo iconos */}
        {sidebarCollapsed && showFavorites && (
          <div className="flex flex-col items-center space-y-4 mb-6">
            {filteredDefaultFavorites.slice(0, 3).map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 tooltip-wrapper"
                title={item.name}
              >
                {item.name.toLowerCase() === "inicio" ? (
                  <Home className="h-5 w-5 text-gray-600" />
                ) : item.name.toLowerCase().includes("document") || item.name.toLowerCase().includes("documentación") ? (
                  <FileText className="h-5 w-5 text-gray-600" />
                ) : item.name.toLowerCase().includes("config") || item.name.toLowerCase().includes("configuración") ? (
                  <Settings className="h-5 w-5 text-gray-600" />
                ) : (
                  <Star className="h-5 w-5 text-gray-600" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Sección Workspace */}
        {showWorkspace && !sidebarCollapsed && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workspace
              </h2>
              <button
                onClick={() => openNewPageModal("workspace")}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar página al workspace"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul>
              {filteredWorkspacePages.map((item, index) => {
                const Icon = getWorkspaceIcon(item.name);
                return renderPageItem({...item, icon: Icon}, index);
              })}
            </ul>
          </div>
        )}

        {/* Sección Notas */}
        {showNotes && !sidebarCollapsed && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Notas
              </h2>
              <button
                onClick={() => openNewPageModal("notes")}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar nota"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul>
              {filteredNotesPages.map((item, index) => 
                renderPageItem(item, index)
              )}
            </ul>
          </div>
        )}

        {/* Versión colapsada - iconos de workspace y notas */}
        {sidebarCollapsed && (showWorkspace || showNotes) && (
          <div className="flex flex-col items-center space-y-4 mb-6">
            {showWorkspace && (
              <div className="w-full flex justify-center mb-1">
                <button
                  onClick={() => openNewPageModal("workspace")}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Agregar página al workspace"
                  title="Nueva página de workspace"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </button>
              </div>
            )}
            {filteredWorkspacePages.slice(0, 5).map((item, index) => {
              const Icon = getWorkspaceIcon(item.name);
              return (
                <Link
                  key={`workspace-${index}`}
                  to={item.path}
                  className="p-2 rounded-md text-gray-700 hover:bg-gray-200 tooltip-wrapper"
                  title={item.name}
                >
                  <Icon className="h-5 w-5 text-gray-600" />
                </Link>
              );
            })}
            
            {showNotes && (
              <div className="w-full flex justify-center mb-1 mt-2">
                <button
                  onClick={() => openNewPageModal("notes")}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Agregar nota"
                  title="Nueva nota"
                >
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            )}
            {filteredNotesPages.slice(0, 5).map((item, index) => (
              <Link
                key={`notes-${index}`}
                to={item.path}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 tooltip-wrapper"
                title={item.name}
              >
                <FileText className="h-5 w-5 text-gray-600" />
              </Link>
            ))}
          </div>
        )}

        {/* Sección Personal */}
        {showPersonal && !sidebarCollapsed && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Personal
              </h2>
              <button
                onClick={() => openNewPageModal("personal")}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar página personal"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul>
              {filteredPersonalPages.map((item, index) => 
                renderPageItem(item, index)
              )}
            </ul>
          </div>
        )}

        {/* Versión colapsada - iconos personal */}
        {sidebarCollapsed && showPersonal && (
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-full flex justify-center mb-1">
              <button
                onClick={() => openNewPageModal("personal")}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                aria-label="Agregar página personal"
                title="Nueva página personal"
              >
                <Users className="h-4 w-4" />
              </button>
            </div>
            {filteredPersonalPages.slice(0, 5).map((item, index) => (
              <Link
                key={`personal-${index}`}
                to={item.path}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 tooltip-wrapper"
                title={item.name}
              >
                <Users className="h-5 w-5 text-gray-600" />
              </Link>
            ))}
          </div>
        )}

        {/* Botón para crear nueva página */}
        {!sidebarCollapsed && (
          <div className="px-3 mb-6">
            <button
              onClick={() => setNewPageOpen(true)}
              className="flex items-center w-full rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200 transition"
            >
              <Plus className="h-4 w-4 mr-3 text-gray-500" />
              <span>Nueva página</span>
            </button>
          </div>
        )}
      </nav>

      {/* Perfil de usuario */}
      <div className="p-4 border-t border-gray-200">
        {sidebarCollapsed ? (
          <div className="flex justify-center">
            <button onClick={() => setSettingsOpen(true)}>
              <img
                src={userAvatar || "/images/female-avatar.svg"}
                alt="Avatar"
                className="h-8 w-8 rounded-full"
                title={userName || settings.userName}
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <img
              src={userAvatar || "/images/female-avatar.svg"}
              alt="Avatar"
              className="h-8 w-8 rounded-full mr-2"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName || settings.userName}
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
        )}
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
        defaultSection={newPageSection}
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
