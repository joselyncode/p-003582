
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";
import { usePages, PageSection, PageContent, Block } from "@/context/PagesContext";
import { useToast } from "@/components/ui/use-toast";

interface DynamicPageProps {
  section: PageSection;
}

const DynamicPage = ({ section }: DynamicPageProps) => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workspace, personal, favorites, getPageContent, updatePageContent } = usePages();
  
  const [pageTitle, setPageTitle] = useState("Cargando...");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [blocks, setBlocks] = useState<Block[] | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  
  // Buscar la página en las diferentes secciones
  useEffect(() => {
    // Combinar todas las páginas para buscar
    const allPages = [...workspace, ...personal, ...favorites];
    
    // Buscar la página actual por URL
    const currentPath = `/${section}/${pageId}`;
    const currentPage = allPages.find(page => page.path === currentPath);
    
    if (!currentPage) {
      toast({
        title: "Error",
        description: `No se encontró la página en la ruta ${currentPath}`,
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setPageTitle(currentPage.name);
    
    // Buscar el contenido de la página
    if (currentPage.id) {
      const fetchPageContent = async () => {
        const content = await getPageContent(currentPage.id!);
        if (content) {
          setPageContent(content);
          setBlocks(content.blocks);
          setLastSaved(content.last_edited);
        } else {
          toast({
            title: "Error",
            description: "No se pudo cargar el contenido de la página",
            variant: "destructive",
          });
        }
      };
      
      fetchPageContent();
    }
  }, [section, pageId, workspace, personal, favorites, getPageContent, navigate, toast]);
  
  const handleBlocksChange = async (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    
    if (pageContent && pageContent.page_id) {
      const updatedContent: PageContent = {
        ...pageContent,
        blocks: newBlocks,
        last_edited: Date.now()
      };
      
      setLastSaved(updatedContent.last_edited);
      await updatePageContent(updatedContent);
    }
  };
  
  // Determinar la sección para la ruta de migas de pan
  const getSectionName = () => {
    switch (section) {
      case "notes":
        return "Notas";
      case "workspace":
        return "Workspace";
      case "personal":
        return "Personal";
      default:
        return "Página";
    }
  };
  
  return (
    <WorkspaceLayout
      userName="Usuario"
      currentPath={[getSectionName(), pageTitle]}
    >
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4">
        {blocks ? (
          <PageEditor
            workspaceName="Second brain"
            pagePath={[getSectionName(), pageTitle]}
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
            lastSaved={lastSaved}
            allowTitleEdit={true}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Cargando contenido...</p>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};

export default DynamicPage;
