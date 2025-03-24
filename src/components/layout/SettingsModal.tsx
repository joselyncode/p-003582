
import React, { useState, useEffect } from "react";
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
import { User, Mail, Save } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  userEmail?: string;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: settings.userName,
    email: settings.userEmail,
    language: settings.language
  });

  // Update form data when settings change or modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: settings.userName,
        email: settings.userEmail,
        language: settings.language
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

  const handleSave = () => {
    // Update settings in localStorage through the hook
    updateSettings({
      userName: formData.name,
      userEmail: formData.email,
      language: formData.language
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

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Preferencias generales</h3>
            <div className="grid gap-2">
              <Label htmlFor="language" className="text-sm">
                Idioma
              </Label>
              <select 
                id="language" 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
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
