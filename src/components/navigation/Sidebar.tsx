
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Star, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  userName: string;
  userAvatar?: string;
}

export function Sidebar({ userName, userAvatar }: SidebarProps) {
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [privateExpanded, setPrivateExpanded] = useState(true);

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
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <FileText className="h-3.5 w-3.5" />
                <span>Documentación</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <FileText className="h-3.5 w-3.5" />
                <span>Ideas de proyectos</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
                <FileText className="h-3.5 w-3.5" />
                <span>Recursos</span>
              </button>
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
        <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-200 w-full rounded-md px-2 py-1.5 text-sm">
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
    </aside>
  );
}
