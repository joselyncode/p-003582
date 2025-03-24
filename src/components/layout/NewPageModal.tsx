
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Home, Star, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePages, PageSection } from "@/context/PagesContext";

interface NewPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (name: string) => Promise<void>;
  defaultSection?: PageSection;
}

export function NewPageModal({ open, onOpenChange, onCreate, defaultSection = "notes" }: NewPageModalProps) {
  const [pageName, setPageName] = useState("");
  const [pageType, setPageType] = useState<PageSection>(defaultSection);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addPage } = usePages();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pageName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce un nombre para la página",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (onCreate) {
        await onCreate(pageName);
      } else {
        // Generar el path correcto para la sección seleccionada
        const path = `/${pageType}/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
        
        console.log("Creando página en la sección:", pageType);
        
        // Pasar explícitamente la sección seleccionada
        const newPageId = await addPage({
          name: pageName,
          icon: "FileText",
          path,
          section: pageType
        });

        if (newPageId) {
          toast({
            description: `Se ha creado la página "${pageName}" en la sección ${pageType}`,
          });
          onOpenChange(false);
          navigate(path);
        }
      }
    } catch (error) {
      console.error("Error creating page:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la página",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva página</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="page-name">Nombre de la página</Label>
            <Input
              id="page-name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Escribe un nombre para la página"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="page-type">Sección</Label>
            <Select
              value={pageType}
              onValueChange={(value) => setPageType(value as PageSection)}
            >
              <SelectTrigger id="page-type">
                <SelectValue placeholder="Selecciona una sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="favorite">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Favoritos</span>
                  </div>
                </SelectItem>
                <SelectItem value="workspace">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Workspace</span>
                  </div>
                </SelectItem>
                <SelectItem value="notes">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Página de notas</span>
                  </div>
                </SelectItem>
                <SelectItem value="personal">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Personal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear página"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
