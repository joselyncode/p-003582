
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
  const [pageNotFound, setPageNotFound] = useState(false);
  
  useEffect(() => {
    if (!pageId) {
      toast({
        title: "Error",
        description: "No se proporcionó un ID de página",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const allPages = [...workspace, ...personal, ...favorites];
    
    const currentPath = `/${section}/${pageId}`;
    let foundPage = allPages.find(page => page.path === currentPath);

    if (!foundPage && section === "favorite") {
      foundPage = allPages.find(page => 
        page.section === "favorite" && 
        (page.path.endsWith(`/${pageId}`) || page.path === currentPath)
      );
    }
    
    if (!foundPage) {
      setPageNotFound(true);
      toast({
        title: "Error",
        description: `No se encontró la página con el ID ${pageId}`,
        variant: "destructive",
      });
      // Delay the navigation slightly to ensure the toast is visible
      setTimeout(() => navigate('/'), 1500);
      return;
    }
    
    setPageTitle(foundPage.name);
    setCurrentPage(foundPage);
    
    if (foundPage.id) {
      const fetchPageContent = async () => {
        try {
          const content = await getPageContent(foundPage.id!);
          if (content) {
            setPageContent(content);
            setBlocks(content.blocks);
            setLastSaved(content.last_edited);
          } else {
            // If no content is found, create an empty page rather than showing an error
            setBlocks([]);
            setLastSaved(Date.now());
          }
        } catch (error) {
          console.error("Error fetching page content:", error);
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
  
  const getSectionName = (): string => {
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
  
  const getBreadcrumbPaths = (): string[] => {
    const sectionName = getSectionName();
    
    if (section === "workspace") {
      return ["Mi Workspace", pageTitle];
    } else if (section === "notes") {
      return ["Mi Workspace", "Notas", pageTitle];
    } else if (section === "personal") {
      return ["Personal", pageTitle];
    } else if (section === "favorite") {
      return ["Favoritos", pageTitle];
    } else {
      return [sectionName, pageTitle];
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

  // If page not found, show a loading state until navigation occurs
  if (pageNotFound) {
    return (
      <WorkspaceLayout
        userName={settings.userName}
        userAvatar={settings.userAvatar}
        currentPath={["Error"]}
      >
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-center h-64">
          <p className="text-gray-500">Redirigiendo al inicio...</p>
        </div>
      </WorkspaceLayout>
    );
  }
  
  return (
    <WorkspaceLayout
      userName={settings.userName}
      userAvatar={settings.userAvatar}
      currentPath={getBreadcrumbPaths()}
      pageId={currentPage?.id}
    >
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4">
        {blocks ? (
          <PageEditor
            workspaceName=""
            pagePath={[]}
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
