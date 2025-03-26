
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../ui/SearchBar";
import { SettingsModal } from "./SettingsModal";
import { NewPageModal } from "./NewPageModal";
import { DeletePageDialog } from "./DeletePageDialog";
import { Home, FileText, Star, Users, Settings, Plus, Trash2, User, LayoutDashboard, Folder, ChevronDown, ChevronRight } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/components/ui/use-toast";
import { usePages, PageSection } from "@/context/PagesContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NewSectionModal } from "./NewSectionModal";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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
  const [newPageSection, setNewPageSection] = useState<PageSection>("workspace");
  const [newSectionModalOpen, setNewSectionModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const { settings } = useSettings();
  const { toast } = useToast();
  const { 
    favorites, 
    workspace, 
    personal, 
    projects, 
    customSections, 
    loading, 
    createPage, 
    deletePage, 
    addCustomSection 
  } = usePages();

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
      const section = newPageSection;
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

  // Función para crear una nueva sección personalizada
  const handleCreateSection = async (name) => {
    try {
      await addCustomSection(name);
      setNewSectionModalOpen(false);
      
      toast({
        description: `Se ha creado la sección "${name}"`,
      });
    } catch (error) {
      console.error("Error creating section:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la sección",
        variant: "destructive",
      });
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
  const filteredProjects = filterItems(projects);
  
  // Filtrar las secciones personalizadas
  const filteredCustomSections = customSections.map(section => ({
    ...section,
    pages: filterItems(section.pages)
  }));

  // Determinar si una sección debe mostrarse (si hay elementos filtrados)
  const showFavorites = filteredFavorites.length > 0;
  const showWorkspace = true; // Always show Workspace section
  const showPersonal = filteredPersonal.length > 0;
  const showProjects = true; // Always show Projects section

  // Abrir el diálogo para crear una nueva página
  const openNewPageModal = (section: PageSection) => {
    setNewPageSection(section);
    setNewPageOpen(true);
  };

  // Alternar el estado de colapso de una sección
  const toggleSectionCollapse = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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
        {item.icon && typeof item.icon === 'function' ? (
          <item.icon className="h-4 w-4 mr-3 text-gray-500" />
        ) : (
          <FileText className="h-4 w-4 mr-3 text-gray-500" />
        )}
        <span className="truncate">{item.name}</span>
      </Link>
    </li>
  );

  const toggleSidebar = () => {
    // setSidebarCollapsed(!sidebarCollapsed);
  };

  const currentAvatar = settings.userAvatar || "/images/female-avatar.svg";

  // Renderizar una sección colapsable con páginas y botón para agregar nuevas páginas
  const renderCustomSection = (section) => {
    const isCollapsed = collapsedSections[section.id] || false;
    
    return (
      <div key={section.id} className="mb-6">
        <Collapsible
          open={!isCollapsed}
          onOpenChange={(open) => toggleSectionCollapse(section.id)}
        >
          <div className="flex items-center justify-between px-3 mb-2">
            <CollapsibleTrigger className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none">
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
              {section.name}
            </CollapsibleTrigger>
            <button
              onClick={() => openNewPageModal(section.id)}
              className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              aria-label={`Agregar página a ${section.name}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <CollapsibleContent>
            <ul>
              {section.pages.map((item, index) => 
                renderPageItem(item, index)
              )}
              {section.pages.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-500 italic">
                  No hay páginas en esta sección
                </li>
              )}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

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
                renderFavoriteItem(item, index)
              )}
            </ul>
          </div>
        )}

        {/* Sección Workspace */}
        {showWorkspace && (
          <div className="mb-6">
            <Collapsible
              defaultOpen={true}
              onOpenChange={(open) => toggleSectionCollapse("workspace")}
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <CollapsibleTrigger className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none">
                  {collapsedSections["workspace"] ? <ChevronRight className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
                  Workspace
                </CollapsibleTrigger>
                <button
                  onClick={() => openNewPageModal("workspace")}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Agregar página"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <CollapsibleContent>
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Sección Personal */}
        {showPersonal && (
          <div className="mb-6">
            <Collapsible
              defaultOpen={true}
              onOpenChange={(open) => toggleSectionCollapse("personal")}
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <CollapsibleTrigger className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none">
                  {collapsedSections["personal"] ? <ChevronRight className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
                  Personal
                </CollapsibleTrigger>
                <button
                  onClick={() => openNewPageModal("personal")}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Agregar página personal"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <CollapsibleContent>
                <ul>
                  {filteredPersonal.map((item, index) => 
                    renderPageItem(item, index)
                  )}
                  {filteredPersonal.length === 0 && (
                    <li className="px-3 py-2 text-sm text-gray-500 italic">
                      No hay páginas personales
                    </li>
                  )}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Sección Proyectos */}
        {showProjects && (
          <div className="mb-6">
            <Collapsible
              defaultOpen={true}
              onOpenChange={(open) => toggleSectionCollapse("projects")}
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <CollapsibleTrigger className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 focus:outline-none">
                  {collapsedSections["projects"] ? <ChevronRight className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
                  Proyectos
                </CollapsibleTrigger>
                <button
                  onClick={() => openNewPageModal("projects")}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  aria-label="Agregar proyecto"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <CollapsibleContent>
                <ul>
                  {filteredProjects.map((item, index) => 
                    renderPageItem(item, index)
                  )}
                  {filteredProjects.length === 0 && (
                    <li className="px-3 py-2 text-sm text-gray-500 italic">
                      No hay proyectos
                    </li>
                  )}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Secciones personalizadas */}
        {filteredCustomSections.map(section => renderCustomSection(section))}

        {/* Botón para crear una nueva sección */}
        <div className="px-3 mb-6">
          <button
            onClick={() => setNewSectionModalOpen(true)}
            className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Crear nueva sección</span>
          </button>
        </div>
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
        defaultSection={newPageSection}
      />

      {/* Modal de nueva sección */}
      <NewSectionModal
        open={newSectionModalOpen}
        onOpenChange={setNewSectionModalOpen}
        onCreate={handleCreateSection}
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
