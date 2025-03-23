
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Palette, 
  Users, 
  Globe 
} from "lucide-react";

export function SettingsContent() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      <div className="grid grid-cols-[200px_1fr] gap-8">
        {/* Sidebar de navegación */}
        <div className="space-y-1">
          <button className="flex items-center gap-2 text-gray-800 bg-gray-100 w-full rounded-md px-3 py-2 text-sm font-medium text-left">
            <User className="h-4 w-4" />
            <span>Mi cuenta</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 w-full rounded-md px-3 py-2 text-sm text-left">
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 w-full rounded-md px-3 py-2 text-sm text-left">
            <Palette className="h-4 w-4" />
            <span>Apariencia</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 w-full rounded-md px-3 py-2 text-sm text-left">
            <Users className="h-4 w-4" />
            <span>Miembros</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 w-full rounded-md px-3 py-2 text-sm text-left">
            <Globe className="h-4 w-4" />
            <span>Integraciónes</span>
          </button>
        </div>

        {/* Contenido de configuración */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Información personal</h2>
            
            <div className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input 
                  id="name" 
                  defaultValue="Carlos Mendoza" 
                  className="max-w-md"
                />
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="carlos@ejemplo.com" 
                  className="max-w-md"
                />
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="avatar">Foto de perfil</Label>
                <div className="flex items-center gap-4">
                  <img 
                    src="https://i.pravatar.cc/100" 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full" 
                  />
                  <Button variant="outline" size="sm">Cambiar</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Contraseña</h2>
            
            <div className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  className="max-w-md"
                />
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  className="max-w-md"
                />
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  className="max-w-md"
                />
              </div>
              
              <Button className="mt-2">Actualizar contraseña</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
