import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { PageEditor } from "@/components/editor/PageEditor";
import { usePages, PageSection, PageContent, Block } from "@/context/PagesContext";
import { useToast } from "@/components/ui/use-toast";
import { useSettings } from "@/hooks/use-settings";

interface DynamicPageProps {
  section: PageSection;
}

const DynamicPage = ({ section }: DynamicPageProps) => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSettings();
  const { workspace, personal, favorites, getPageContent, updatePageContent, updatePageTitle } = usePages();
  
  const [pageTitle, setPageTitle] = useState("Cargando...");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [blocks, setBlocks] = useState<Block[] | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<any>(null);
  
  useEffect(() => {
    const allPages = [...workspace, ...personal, ...favorites];
    
    const currentPath = `/${section}/${pageId}`;
    const foundPage = allPages.find(page => page.path === currentPath);
    
    if (!foundPage) {
      toast({
        title: "Error",
        description: `No se encontró la página en la ruta ${currentPath}`,
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    setPageTitle(foundPage.name);
    setCurrentPage(foundPage);
    
    if (foundPage.id) {
      const fetchPageContent = async () => {
        const content = await getPageContent(foundPage.id!);
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
  
  const getSectionName = () => {
    switch (section) {
      case "notes":
        return "Notas";
      case "workspace":
        return "Workspace";
      case "personal":
        return "Personal";
      case "favorite":
        return "Favoritos";
      default:
        return "Página";
    }
  };
  
  const getWorkspaceName = () => {
    switch (section) {
      case "notes":
      case "personal":
      case "favorite":
        return "Mi Workspace";
      case "workspace":
        return "Workspace";
      default:
        return "Mi Workspace";
    }
  };
  
  const handleTitleChange = async (newTitle: string) => {
    if (newTitle && newTitle !== pageTitle && currentPage?.id) {
      setPageTitle(newTitle);
      
      const success = await updatePageTitle(currentPage.id, newTitle);
      
      if (success) {
        const newPath = `/${section}/${newTitle.toLowerCase().replace(/\s+/g, '-')}`;
        navigate(newPath);
      }
    }
  };
  
  return (
    <WorkspaceLayout
      userName={settings.userName}
      currentPath={[getSectionName(), pageTitle]}
      pageId={currentPage?.id}
    >
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4">
        {blocks ? (
          <PageEditor
            workspaceName={getWorkspaceName()}
            pagePath={[getSectionName(), pageTitle]}
            blocks={blocks}
            onBlocksChange={handleBlocksChange}
            lastSaved={lastSaved}
            allowTitleEdit={true}
            initialTitle={pageTitle}
            onTitleChange={handleTitleChange}
            pageId={currentPage?.id}
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
