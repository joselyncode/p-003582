
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Home, Star, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { usePages, PageSection } from "@/context/PagesContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface NewPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (name: string) => Promise<void>;
  defaultSection?: PageSection;
  hideSection?: boolean;
}

// Define the form schema with validation
const formSchema = z.object({
  pageName: z.string().min(1, "El nombre de la página es obligatorio"),
  pageType: z.enum(["favorite", "workspace", "notes", "personal"]),
});

export function NewPageModal({ 
  open, 
  onOpenChange, 
  onCreate, 
  defaultSection = "notes",
  hideSection = false 
}: NewPageModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addPage } = usePages();

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageName: "",
      pageType: defaultSection,
    },
  });

  // Reset form when modal opens with the default section
  useEffect(() => {
    if (open) {
      form.reset({
        pageName: "",
        pageType: defaultSection,
      });
    }
  }, [open, defaultSection, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Destructure values from the form
    const { pageName, pageType } = values;
    
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
        // Generate the correct path for the selected section
        const path = `/${pageType}/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
        
        console.log("Creando página en la sección:", pageType);
        
        // Explicitly pass the selected section
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="pageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la página</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escribe un nombre para la página"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!hideSection && (
              <FormField
                control={form.control}
                name="pageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sección</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una sección" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear página"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
