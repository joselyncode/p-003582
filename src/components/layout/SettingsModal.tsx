
import React, { useState, useEffect, useRef } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save, Upload, Moon, Sun, Monitor } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  userEmail?: string;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: settings.userName,
    email: settings.userEmail,
    language: settings.language,
    theme: settings.theme,
    avatar: settings.userAvatar
  });

  // Update form data when settings change or modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: settings.userName,
        email: settings.userEmail,
        language: settings.language,
        theme: settings.theme || 'light',
        avatar: settings.userAvatar
      });
    }
  }, [open, settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setFormData(prev => ({
      ...prev,
      theme: value
    }));
  };

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
      setFormData(prev => ({
        ...prev,
        avatar: base64Image
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Update settings in localStorage through the hook
    updateSettings({
      userName: formData.name,
      userEmail: formData.email,
      language: formData.language,
      theme: formData.theme as 'light' | 'dark' | 'system',
      userAvatar: formData.avatar
    });
    
    toast({
      title: "Cambios guardados",
      description: "Tus preferencias han sido actualizadas.",
    });
    
    // Close the modal after saving
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Configuración de cuenta</SheetTitle>
          <SheetDescription>
            Actualiza tu información personal y preferencias
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Avatar upload */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
              {formData.avatar ? (
                <AvatarImage src={formData.avatar} alt={formData.name} />
              ) : (
                <AvatarFallback className="bg-gray-100">
                  {formData.name?.charAt(0)?.toUpperCase() || "U"}
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
            <Button 
              onClick={handleAvatarClick} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              Cambiar avatar
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre completo
                </Label>
              </div>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
              </div>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Preferencias generales</h3>
            <div className="grid gap-2">
              <Label htmlFor="language" className="text-sm">
                Idioma
              </Label>
              <select 
                id="language" 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-gray-800 dark:border-gray-700"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                Tema
              </Label>
              <RadioGroup 
                value={formData.theme} 
                onValueChange={handleThemeChange as any}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Claro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Oscuro
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system" className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    Sistema
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button type="submit" className="flex items-center" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
