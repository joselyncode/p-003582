
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
  Globe,
  Upload
} from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function SettingsContent() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido.",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 2MB.",
        variant: "destructive"
      });
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target?.result as string;
      updateSettings({ userAvatar: base64Image });
      
      toast({
        title: "Avatar actualizado",
        description: "Tu imagen de perfil ha sido actualizada correctamente.",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      <div className="grid grid-cols-[200px_1fr] gap-8 max-sm:grid-cols-1">
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
              {/* Avatar upload */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar 
                  className="h-16 w-16 cursor-pointer" 
                  onClick={handleAvatarClick}
                >
                  {settings.userAvatar ? (
                    <AvatarImage src={settings.userAvatar} alt={settings.userName} />
                  ) : (
                    <AvatarFallback className="bg-gray-100">
                      <User className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div>
                  <h3 className="text-sm font-medium">Foto de perfil</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    JPG, GIF o PNG. Máximo 2MB.
                  </p>
                  <Button 
                    onClick={handleAvatarClick} 
                    variant="outline" 
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input 
                  id="name" 
                  defaultValue={settings.userName} 
                  className="max-w-md"
                  onChange={(e) => updateSettings({ userName: e.target.value })}
                />
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={settings.userEmail} 
                  className="max-w-md"
                  onChange={(e) => updateSettings({ userEmail: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Preferencias</h2>
            
            <div className="space-y-4">
              {/* Idioma */}
              <div className="grid gap-2 max-w-md">
                <Label htmlFor="settings-language">Idioma</Label>
                <select 
                  id="settings-language" 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
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
