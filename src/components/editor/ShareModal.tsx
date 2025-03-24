
import React, { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Share, Copy, Mail, Link as LinkIcon, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSettings } from "@/hooks/use-settings";

export interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageId: string;
}

// Schema for email validation
const emailSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido" }),
});

type SharePermission = 'view' | 'edit' | 'comment';

interface UserShare {
  id: string;
  email: string;
  permission: SharePermission;
}

interface PageShare {
  id: string;
  page_id: string;
  permission: SharePermission;
  is_link_enabled: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
}

export function ShareModal({ open, onOpenChange, pageId }: ShareModalProps) {
  const [shareLink, setShareLink] = useState("");
  const [linkPermission, setLinkPermission] = useState<SharePermission>("view");
  const [isLinkEnabled, setIsLinkEnabled] = useState(true);
  const [shareId, setShareId] = useState<string | null>(null);
  const [userShares, setUserShares] = useState<UserShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { settings } = useSettings();
  const userName = settings.userName || "Usuario";
  
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Generate or fetch the share link when the modal opens
  useEffect(() => {
    if (open && pageId && pageId !== 'default-page') {
      fetchOrCreateShareData();
    }
  }, [open, pageId]);

  const fetchOrCreateShareData = async () => {
    if (!pageId || pageId === 'default-page') return;
    
    setIsLoading(true);
    try {
      // Check if a share already exists for this page
      const { data: existingShares, error: fetchError } = await supabase
        .from('page_shares')
        .select('*')
        .eq('page_id', pageId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingShares) {
        // Share exists, use it
        const pageShare = existingShares as unknown as PageShare;
        setShareId(pageShare.id);
        setLinkPermission(pageShare.permission);
        setIsLinkEnabled(pageShare.is_link_enabled);
        setShareLink(`${window.location.origin}/share/${pageId}`);
        
        // Fetch user shares
        await fetchUserShares(pageShare.id);
      } else {
        // Create a new share
        const { data: newShare, error: insertError } = await supabase
          .from('page_shares')
          .insert({
            page_id: pageId,
            permission: 'view',
            is_link_enabled: true,
            created_by: null // We don't have user auth yet
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        const pageShare = newShare as unknown as PageShare;
        setShareId(pageShare.id);
        setLinkPermission('view');
        setIsLinkEnabled(true);
        setShareLink(`${window.location.origin}/share/${pageId}`);
        setUserShares([]);
      }
    } catch (error) {
      console.error('Error setting up share:', error);
      toast({
        title: "Error",
        description: "No se pudo configurar el enlace para compartir",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserShares = async (shareId: string) => {
    const { data, error } = await supabase
      .from('user_page_shares')
      .select('*')
      .eq('page_share_id', shareId);

    if (error) {
      console.error('Error fetching user shares:', error);
      return;
    }

    if (data) {
      setUserShares(data.map(share => ({
        id: share.id,
        email: share.email,
        permission: share.permission as SharePermission
      })));
    }
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    
    toast({
      description: "Enlace copiado al portapapeles",
      duration: 1500,
    });
    
    // Reset the copied state after a short delay
    setTimeout(() => setCopied(false), 2000);
  };

  const updateLinkPermission = async (permission: SharePermission) => {
    if (!shareId) return;
    
    setLinkPermission(permission);
    
    try {
      const { error } = await supabase
        .from('page_shares')
        .update({ permission, updated_at: new Date().toISOString() })
        .eq('id', shareId);

      if (error) {
        throw error;
      }
      
      toast({
        description: `Permisos de enlace actualizados a "${getPermissionText(permission)}"`,
        duration: 1500,
      });
    } catch (error) {
      console.error('Error updating link permission:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los permisos del enlace",
        variant: "destructive",
      });
    }
  };

  const toggleLinkEnabled = async () => {
    if (!shareId) return;
    
    const newState = !isLinkEnabled;
    setIsLinkEnabled(newState);
    
    try {
      const { error } = await supabase
        .from('page_shares')
        .update({ 
          is_link_enabled: newState,
          updated_at: new Date().toISOString()
        })
        .eq('id', shareId);

      if (error) {
        throw error;
      }
      
      toast({
        description: newState 
          ? "Enlace para compartir activado" 
          : "Enlace para compartir desactivado",
        duration: 1500,
      });
    } catch (error) {
      console.error('Error toggling link state:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del enlace",
        variant: "destructive",
      });
    }
  };

  const shareByEmail = async (data: z.infer<typeof emailSchema>) => {
    if (!shareId) return;
    
    // Check if email already exists in shares
    if (userShares.some(share => share.email.toLowerCase() === data.email.toLowerCase())) {
      toast({
        description: "Este correo ya ha sido invitado",
        variant: "destructive",
        duration: 1500,
      });
      return;
    }
    
    try {
      const { data: userShare, error } = await supabase
        .from('user_page_shares')
        .insert({
          page_share_id: shareId,
          email: data.email,
          permission: linkPermission, // Use the same permission as the current link setting
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      // Add to local state
      setUserShares([...userShares, {
        id: userShare.id,
        email: data.email,
        permission: userShare.permission
      }]);
      
      // Reset form
      form.reset();
      
      toast({
        description: `Invitación enviada a ${data.email}`,
        duration: 1500,
      });
    } catch (error) {
      console.error('Error sharing by email:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación",
        variant: "destructive",
      });
    }
  };

  const updateUserPermission = async (userId: string, permission: SharePermission) => {
    try {
      const { error } = await supabase
        .from('user_page_shares')
        .update({ 
          permission,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      
      // Update local state
      setUserShares(userShares.map(share => 
        share.id === userId 
          ? { ...share, permission } 
          : share
      ));
      
      toast({
        description: "Permisos de usuario actualizados",
        duration: 1500,
      });
    } catch (error) {
      console.error('Error updating user permission:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los permisos",
        variant: "destructive",
      });
    }
  };

  const removeUserShare = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_page_shares')
        .delete()
        .eq('id', userId);

      if (error) {
        throw error;
      }
      
      // Update local state
      setUserShares(userShares.filter(share => share.id !== userId));
      
      toast({
        description: "Usuario eliminado de compartidos",
        duration: 1500,
      });
    } catch (error) {
      console.error('Error removing user share:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar al usuario",
        variant: "destructive",
      });
    }
  };

  const getPermissionText = (permission: SharePermission) => {
    switch (permission) {
      case 'view':
        return 'Solo ver';
      case 'edit':
        return 'Pueden editar';
      case 'comment':
        return 'Pueden comentar';
      default:
        return 'Solo ver';
    }
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
            <div className="flex items-center justify-between">
              <Label htmlFor="link">Enlace para compartir</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="enable-link" className="text-sm text-gray-600">Activar</Label>
                <Switch 
                  id="enable-link" 
                  checked={isLinkEnabled}
                  onCheckedChange={toggleLinkEnabled}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                id="link"
                value={shareLink}
                readOnly
                disabled={!isLinkEnabled}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                disabled={!isLinkEnabled || isLoading}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(shareByEmail)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invitar por correo electrónico</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="correo@ejemplo.com"
                          className="flex-1"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <Button type="submit" disabled={isLoading}>
                        <Mail className="h-4 w-4 mr-2" />
                        Invitar
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {userShares.length > 0 && (
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Usuarios invitados</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {userShares.map(share => (
                  <div key={share.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md">
                    <span className="truncate max-w-[160px]">{share.email}</span>
                    <div className="flex items-center space-x-2">
                      <select
                        value={share.permission}
                        onChange={(e) => updateUserPermission(share.id, e.target.value as SharePermission)}
                        className="text-xs p-1 border rounded"
                        disabled={isLoading}
                      >
                        <option value="view">Ver</option>
                        <option value="edit">Editar</option>
                        <option value="comment">Comentar</option>
                      </select>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeUserShare(share.id)}
                        disabled={isLoading}
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <h4 className="text-sm font-medium mb-2">Permisos del enlace</h4>
            <RadioGroup 
              value={linkPermission} 
              onValueChange={(value) => updateLinkPermission(value as SharePermission)}
              disabled={isLoading || !isLinkEnabled}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="text-sm">Solo ver - No pueden editar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="edit" id="edit" />
                <Label htmlFor="edit" className="text-sm">Pueden editar - Acceso completo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comment" id="comment" />
                <Label htmlFor="comment" className="text-sm">Pueden comentar - Sin edición</Label>
              </div>
            </RadioGroup>
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
