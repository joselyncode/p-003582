
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Docs from "./pages/Docs";
import Workspace from "./pages/Workspace";
import Notes from "./pages/Notes";
import Personal from "./pages/Personal";
import Todos from "./pages/Todos";
import { PagesProvider } from "./context/PagesContext";
import DynamicPage from "./pages/DynamicPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PagesProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/todos" element={<Todos />} />
              {/* Rutas dinámicas para páginas creadas por el usuario */}
              <Route path="/notes/:pageId" element={<DynamicPage section="notes" />} />
              <Route path="/workspace/:pageId" element={<DynamicPage section="workspace" />} />
              <Route path="/personal/:pageId" element={<DynamicPage section="personal" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PagesProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
