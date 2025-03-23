
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../ui/SearchBar";
import { SettingsModal } from "./SettingsModal";
import { Home, FileText, Star, Users, Settings } from "lucide-react";

interface SidebarProps {
  userName: string;
  userAvatar?: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Lista de secciones y páginas
  const favorites = [
    { name: "Inicio", icon: Home, path: "/" },
    { name: "Documentación", icon: FileText, path: "/docs" },
    { name: "Configuración", icon: Settings, path: "/settings" },
  ];

  const workspace = [
    { name: "Mi Workspace", icon: FileText, path: "/workspace" },
    { name: "Documentación", icon: FileText, path: "/docs" },
    { name: "Página de notas", icon: FileText, path: "/notes" },
  ];

  const personal = [
    { name: "Proyectos personales", icon: FileText, path: "/personal" },
    { name: "Tareas pendientes", icon: FileText, path: "/todos" },
  ];

  // Funciones para filtrar los elementos según la búsqueda
  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredFavorites = filterItems(favorites);
  const filteredWorkspace = filterItems(workspace);
  const filteredPersonal = filterItems(personal);

  // Determinar si una sección debe mostrarse (si hay elementos filtrados)
  const showFavorites = filteredFavorites.length > 0;
  const showWorkspace = filteredWorkspace.length > 0;
  const showPersonal = filteredPersonal.length > 0;

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
              {filteredFavorites.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sección Workspace */}
        {showWorkspace && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Workspace
            </h2>
            <ul>
              {filteredWorkspace.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sección Personal */}
        {showPersonal && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
              Personal
            </h2>
            <ul>
              {filteredPersonal.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    <item.icon className="h-4 w-4 mr-3 text-gray-500" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Perfil de usuario */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src={userAvatar || "/placeholder.svg"}
            alt="Avatar"
            className="h-8 w-8 rounded-full mr-2"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userName}
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
        userName={userName}
      />
    </div>
  );
}
