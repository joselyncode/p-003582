
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Copy, Mail, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageId: string;
}

export function ShareModal({ open, onOpenChange, pageId }: ShareModalProps) {
  const [shareLink, setShareLink] = useState(`notion-clone.com/share/${pageId}`);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const userName = "Joselyn Monge"; // Default user name

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      description: "Enlace copiado al portapapeles",
      duration: 1500,
    });
  };

  const shareByEmail = () => {
    if (!email) {
      toast({
        description: "Por favor, ingresa un correo electrónico",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }

    // Simulación de envío de correo
    toast({
      description: `Invitación enviada a ${email}`,
      duration: 1500,
    });
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir página</DialogTitle>
          <DialogDescription>
            Comparte esta página con otras personas o invítalas a colaborar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link">Enlace para compartir</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="link"
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Invitar por correo electrónico</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={shareByEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Invitar
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Opciones de acceso</h4>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  defaultChecked
                  className="rounded-full"
                />
                <span className="text-sm">Solo ver - No pueden editar</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  className="rounded-full"
                />
                <span className="text-sm">Pueden editar - Acceso completo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="access"
                  className="rounded-full"
                />
                <span className="text-sm">Pueden comentar - Sin edición</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <LinkIcon className="h-4 w-4 mr-1" />
            <span>Compartido por {userName}</span>
          </div>
          <DialogClose asChild>
            <Button type="button">Listo</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
