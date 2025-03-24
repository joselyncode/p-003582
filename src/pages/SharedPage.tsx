
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageEditor } from "@/components/editor/PageEditor";
import { Header } from "@/components/navigation/Header";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageContent, Block } from "@/context/PagesContext";

type SharePermission = 'view' | 'edit' | 'comment';

const SharedPage = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pageTitle, setPageTitle] = useState("Página compartida");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [blocks, setBlocks] = useState<Block[] | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<SharePermission>('view');
  const [commentsOpen, setCommentsOpen] = useState(false);
  
  useEffect(() => {
    if (!pageId) {
      navigate('/');
      return;
    }
    
    const fetchSharedPage = async () => {
      setIsLoading(true);
      try {
        // First, check if the page exists and is shared
        const { data: pageShareData, error: pageShareError } = await supabase
          .from('page_shares')
          .select('*, pages:page_id(*)')
          .eq('page_id', pageId)
          .single();
          
        if (pageShareError) {
          throw new Error('Esta página no existe o no está compartida');
        }
        
        if (!pageShareData.is_link_enabled) {
          throw new Error('El enlace para compartir está desactivado');
        }
        
        setPermission(pageShareData.permission as SharePermission);
        
        if (pageShareData.pages) {
          setPageTitle(pageShareData.pages.name);
        }
        
        // Now fetch the page content
        const { data: contentData, error: contentError } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_id', pageId)
          .single();
          
        if (contentError) {
          throw new Error('No se pudo cargar el contenido de la página');
        }
        
        setPageContent(contentData);
        setBlocks(contentData.blocks as Block[]);
        setLastSaved(contentData.last_edited);
        
      } catch (error: any) {
        console.error('Error fetching shared page:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo cargar la página compartida",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSharedPage();
  }, [pageId, navigate, toast]);
  
  const handleBlocksChange = async (newBlocks: Block[]) => {
    // Only allow changes if permission is edit
    if (permission !== 'edit' || !pageContent) {
      return;
    }
    
    setBlocks(newBlocks);
    
    try {
      const updatedContent: PageContent = {
        ...pageContent,
        blocks: newBlocks,
        last_edited: Date.now()
      };
      
      const { error } = await supabase
        .from('page_content')
        .update({
          blocks: newBlocks,
          last_edited: Date.now()
        })
        .eq('page_id', pageId);
        
      if (error) {
        throw error;
      }
      
      setLastSaved(updatedContent.last_edited);
    } catch (error) {
      console.error('Error updating blocks:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    }
  };
  
  const toggleComments = () => {
    if (permission === 'view') {
      toast({
        description: "No tienes permisos para comentar en esta página",
        variant: "destructive",
      });
      return;
    }
    
    setCommentsOpen(!commentsOpen);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          currentPath={["Página compartida"]}
          pageId={pageId}
        />
        <div className="flex items-center justify-center flex-grow">
          <p className="text-gray-500">Cargando página compartida...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        currentPath={[pageTitle]}
        pageId={pageId}
        onCommentsClick={toggleComments}
        commentsOpen={commentsOpen}
      />
      
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-4">
            {blocks ? (
              <PageEditor
                workspaceName=""
                pagePath={[]}
                blocks={blocks}
                onBlocksChange={handleBlocksChange}
                lastSaved={lastSaved}
                allowTitleEdit={false}
                initialTitle={pageTitle}
                readOnly={permission === 'view' || permission === 'comment'}
                pageId={pageId}
                isSharedPage={true}
                showComments={commentsOpen && (permission === 'edit' || permission === 'comment')}
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No se encontró contenido en esta página</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SharedPage;
