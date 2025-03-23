
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Home, Star, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPageModal({ open, onOpenChange }: NewPageModalProps) {
  const [pageName, setPageName] = useState("");
  const [pageType, setPageType] = useState("notes");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pageName.trim()) {
      toast({
        title: "Error",
        description: "Por favor, introduce un nombre para la página",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would create a page in the database
    // For now, we'll just navigate to the appropriate section
    let targetPath;
    
    switch(pageType) {
      case "favorite":
        targetPath = "/docs";
        break;
      case "workspace":
        targetPath = "/workspace";
        break;
      case "notes":
        targetPath = "/notes";
        break;
      case "personal":
        targetPath = "/personal";
        break;
      default:
        targetPath = "/notes";
    }

    toast({
      title: "Página creada",
      description: `Se ha creado la página "${pageName}"`,
    });

    // Close modal and navigate
    onOpenChange(false);
    navigate(targetPath);
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
              onValueChange={setPageType}
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
            <Button type="submit">Crear página</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
