
import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { usePages } from "@/context/PagesContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AllPages = () => {
  const { workspace, notes, personal } = usePages();
  const [searchQuery, setSearchQuery] = useState("");
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Todas las páginas"];

  // Combinar todas las páginas en un solo array
  const allPages = [...workspace, ...notes, ...personal].map(page => ({
    ...page,
    lastEdited: page.lastEdited || Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  }));

  // Filtrar páginas según la búsqueda
  const filteredPages = allPages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Todas las páginas</h1>
        
        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            className="pl-10 py-2"
            placeholder="Buscar páginas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabla de páginas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Última edición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
                filteredPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={page.path} className="flex items-center hover:underline text-blue-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        {page.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {page.path.includes("/workspace") 
                        ? "Workspace" 
                        : page.path.includes("/notes") 
                          ? "Notas" 
                          : page.path.includes("/personal") 
                            ? "Personal" 
                            : "Otro"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(page.lastEdited), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    No se encontraron páginas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default AllPages;
