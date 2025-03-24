
import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, GripVertical, Move } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndContext, DragEndEvent, 
  PointerSensor, useSensor, useSensors, 
  closestCenter } from '@dnd-kit/core';
import { SortableContext, 
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableBlockProps {
  initialContent: string;
  onUpdate: (content: string) => void;
}

// SortableColumnHeader component
const SortableColumnHeader = ({ header, index, onHeaderChange }: { 
  header: string, 
  index: number, 
  onHeaderChange: (index: number, value: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `col-${index}`,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableHead 
      ref={setNodeRef}
      style={style}
      className="relative border border-gray-200 bg-gray-50"
    >
      <div className="flex items-center">
        <div 
          className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border rounded"
          {...attributes}
          {...listeners}
        >
          <Move className="h-4 w-4 text-gray-400" />
        </div>
        
        <div 
          contentEditable
          suppressContentEditableWarning
          className="outline-none p-2 min-w-20 w-full"
          onBlur={(e) => onHeaderChange(index, e.currentTarget.textContent || "")}
        >
          {header}
        </div>
      </div>
    </TableHead>
  );
};

// SortableRow component
const SortableRow = ({ 
  row, 
  rowIndex, 
  headers, 
  onCellChange 
}: { 
  row: string[], 
  rowIndex: number, 
  headers: string[],
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `row-${rowIndex}`,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow 
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50"
    >
      {/* Row handle for drag and drop */}
      <TableCell className="w-10 p-0 relative border border-gray-200">
        <div 
          className="flex justify-center items-center h-full cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </TableCell>
      
      {/* Row cells */}
      {row.map((cell, colIndex) => (
        <TableCell 
          key={colIndex} 
          className="border border-gray-200 p-0"
        >
          <div 
            contentEditable
            suppressContentEditableWarning
            className="outline-none p-2 min-h-10"
            onBlur={(e) => onCellChange(rowIndex, colIndex, e.currentTarget.textContent || "")}
          >
            {cell}
          </div>
        </TableCell>
      ))}
      
      {/* Empty cell for the add column button */}
      <TableCell className="w-10 border border-gray-200"></TableCell>
    </TableRow>
  );
};

export const TableBlock: React.FC<TableBlockProps> = ({ initialContent, onUpdate }) => {
  // Parse the table data from the JSON string or create a default empty table
  const parseTableData = (): TableData => {
    try {
      return JSON.parse(initialContent) as TableData;
    } catch (e) {
      return {
        headers: ["Column 1", "Column 2", "Column 3"],
        rows: [["", "", ""], ["", "", ""]]
      };
    }
  };
  
  const [tableData, setTableData] = useState<TableData>(parseTableData);
  const [showColumnControls, setShowColumnControls] = useState<number | null>(null);
  const [showRowControls, setShowRowControls] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Save table data when it changes
  useEffect(() => {
    onUpdate(JSON.stringify(tableData));
  }, [tableData, onUpdate]);
  
  // Handle cell content editing
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    
    setTableData({
      ...tableData,
      rows: newRows
    });
  };
  
  // Handle header content editing
  const handleHeaderChange = (colIndex: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[colIndex] = value;
    
    setTableData({
      ...tableData,
      headers: newHeaders
    });
  };
  
  // Add a new column
  const addColumn = () => {
    const newHeaders = [...tableData.headers, `Column ${tableData.headers.length + 1}`];
    const newRows = tableData.rows.map(row => [...row, ""]);
    
    setTableData({
      headers: newHeaders,
      rows: newRows
    });
  };
  
  // Remove a column
  const removeColumn = (colIndex: number) => {
    if (tableData.headers.length <= 1) return; // Prevent removing the last column
    
    const newHeaders = tableData.headers.filter((_, index) => index !== colIndex);
    const newRows = tableData.rows.map(row => 
      row.filter((_, index) => index !== colIndex)
    );
    
    setTableData({
      headers: newHeaders,
      rows: newRows
    });
    
    setShowColumnControls(null);
  };
  
  // Add a new row
  const addRow = () => {
    const newRow = Array(tableData.headers.length).fill("");
    
    setTableData({
      ...tableData,
      rows: [...tableData.rows, newRow]
    });
  };
  
  // Remove a row
  const removeRow = (rowIndex: number) => {
    if (tableData.rows.length <= 1) return; // Prevent removing the last row
    
    const newRows = tableData.rows.filter((_, index) => index !== rowIndex);
    
    setTableData({
      ...tableData,
      rows: newRows
    });
    
    setShowRowControls(null);
  };
  
  // Handle column drag end
  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      
      const activeIndex = parseInt(activeId.replace('col-', ''));
      const overIndex = parseInt(overId.replace('col-', ''));
      
      // Move the column
      const newHeaders = [...tableData.headers];
      const [movedHeader] = newHeaders.splice(activeIndex, 1);
      newHeaders.splice(overIndex, 0, movedHeader);
      
      // Move the column data in each row
      const newRows = tableData.rows.map(row => {
        const newRow = [...row];
        const [movedCell] = newRow.splice(activeIndex, 1);
        newRow.splice(overIndex, 0, movedCell);
        return newRow;
      });
      
      setTableData({
        headers: newHeaders,
        rows: newRows
      });
    }
  };
  
  // Handle row drag end
  const handleRowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      
      const activeIndex = parseInt(activeId.replace('row-', ''));
      const overIndex = parseInt(overId.replace('row-', ''));
      
      // Move the row
      const newRows = [...tableData.rows];
      const [movedRow] = newRows.splice(activeIndex, 1);
      newRows.splice(overIndex, 0, movedRow);
      
      setTableData({
        ...tableData,
        rows: newRows
      });
    }
  };

  return (
    <div className="relative overflow-x-auto my-2 group">
      {/* Table options bar */}
      <div className="flex items-center justify-between mb-1 p-1 bg-gray-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-sm font-medium text-gray-500">Options</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <span>Table actions</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={addRow}>
              Add row
            </DropdownMenuItem>
            <DropdownMenuItem onClick={addColumn}>
              Add column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main table */}
      <Table className="border-collapse border border-gray-200">
        {/* Column headers with drag & drop */}
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleColumnDragEnd}
        >
          <TableHeader>
            <TableRow>
              {/* Empty header for row handles column */}
              <TableHead className="w-10 p-0 bg-gray-50"></TableHead>
              
              {/* Sortable Headers */}
              <SortableContext 
                items={tableData.headers.map((_, i) => `col-${i}`)} 
                strategy={horizontalListSortingStrategy}
              >
                {tableData.headers.map((header, colIndex) => (
                  <SortableColumnHeader 
                    key={colIndex}
                    header={header}
                    index={colIndex}
                    onHeaderChange={handleHeaderChange}
                  />
                ))}
              </SortableContext>
              
              {/* Add column button */}
              <TableHead className="w-10 p-0 bg-gray-50">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-full w-full rounded-none text-gray-400 hover:text-gray-600"
                  onClick={addColumn}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
        </DndContext>
        
        {/* Table rows with drag & drop */}
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleRowDragEnd}
        >
          <TableBody>
            <SortableContext 
              items={tableData.rows.map((_, i) => `row-${i}`)} 
              strategy={verticalListSortingStrategy}
            >
              {tableData.rows.map((row, rowIndex) => (
                <SortableRow 
                  key={rowIndex}
                  row={row}
                  rowIndex={rowIndex}
                  headers={tableData.headers}
                  onCellChange={handleCellChange}
                />
              ))}
            </SortableContext>
            
            {/* Add row button */}
            <TableRow>
              <TableCell 
                colSpan={tableData.headers.length + 2} 
                className="p-0 border border-gray-200"
              >
                <Button 
                  variant="ghost" 
                  className="h-10 w-full rounded-none text-gray-400 hover:text-gray-600"
                  onClick={addRow}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </DndContext>
      </Table>
    </div>
  );
};

