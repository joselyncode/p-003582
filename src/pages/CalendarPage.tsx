
import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { usePages } from "@/context/PagesContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

const CalendarPage = () => {
  const { workspace, personal } = usePages();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const userName = "Joselyn Monge";
  const userAvatar = "/images/female-avatar.svg";
  const currentPath = ["Calendario"];

  // Filter workspace pages into workspace and notes categories
  const workspacePages = workspace.filter(page => page.path.includes("/workspace"));
  const notesPages = workspace.filter(page => page.path.includes("/notes"));

  // Combinar todas las páginas en un solo array y añadir fechas simuladas de creación/edición
  const allPages = [...workspacePages, ...notesPages, ...personal].map(page => ({
    ...page,
    lastEditedDate: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
    createdDate: Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000
  }));

  // Función para obtener páginas por fecha
  const getPagesByDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);
    
    return allPages.filter(page => {
      const editDate = new Date(page.lastEditedDate);
      return editDate >= dateStart && editDate <= dateEnd;
    });
  };

  // Páginas para la fecha seleccionada
  const pagesForSelectedDate = getPagesByDate(selectedDate);

  // Función para navegar a días anteriores/siguientes
  const navigateDate = (days: number) => {
    if (!selectedDate) return;
    
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Fechas con actividad (para resaltar en el calendario)
  const datesWithActivity = allPages.map(page => new Date(page.lastEditedDate));

  return (
    <WorkspaceLayout
      userName={userName}
      userAvatar={userAvatar}
      currentPath={currentPath}
    >
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Calendario</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendario */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date);
                    setSelectedDate(date);
                  }}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    highlighted: datesWithActivity
                  }}
                  modifiersStyles={{
                    highlighted: {
                      backgroundColor: "#f0f4ff",
                      fontWeight: "bold"
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Detalle del día */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>
                  {selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM, yyyy") : "Seleccione una fecha"}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pagesForSelectedDate.length > 0 ? (
                  <ul className="space-y-2">
                    {pagesForSelectedDate.map((page, index) => (
                      <li key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <FileText className="h-4 w-4 mr-3 text-gray-500" />
                        <div className="flex-1">
                          <Link to={page.path} className="text-blue-600 hover:underline font-medium">
                            {page.name}
                          </Link>
                          <p className="text-sm text-gray-500">
                            Editado: {format(new Date(page.lastEditedDate), "HH:mm")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay páginas editadas en esta fecha
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default CalendarPage;
