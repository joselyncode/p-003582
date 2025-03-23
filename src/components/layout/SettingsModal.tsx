
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Save } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  userEmail?: string;
}

export function SettingsModal({ open, onOpenChange, userName, userEmail = "joselyn@ejemplo.com" }: SettingsModalProps) {
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
              <Input id="name" defaultValue={userName} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
              </div>
              <Input id="email" type="email" defaultValue={userEmail} className="w-full" />
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
                defaultValue="es"
              >
                <option value="es">Español</option>
                <option value="en">Inglés</option>
              </select>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
