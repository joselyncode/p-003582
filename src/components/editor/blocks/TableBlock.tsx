
import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableBlockProps {
  initialContent: string;
  onUpdate: (content: string) => void;
}

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
  
  // Move a column
  const moveColumn = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= tableData.headers.length) return;
    
    const newHeaders = [...tableData.headers];
    const temp = newHeaders[fromIndex];
    newHeaders[fromIndex] = newHeaders[toIndex];
    newHeaders[toIndex] = temp;
    
    const newRows = tableData.rows.map(row => {
      const newRow = [...row];
      const temp = newRow[fromIndex];
      newRow[fromIndex] = newRow[toIndex];
      newRow[toIndex] = temp;
      return newRow;
    });
    
    setTableData({
      headers: newHeaders,
      rows: newRows
    });
  };
  
  // Move a row
  const moveRow = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= tableData.rows.length) return;
    
    const newRows = [...tableData.rows];
    const temp = newRows[fromIndex];
    newRows[fromIndex] = newRows[toIndex];
    newRows[toIndex] = temp;
    
    setTableData({
      ...tableData,
      rows: newRows
    });
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
        <TableHeader>
          <TableRow>
            {/* Row handler column */}
            <TableHead className="w-10 p-0 bg-gray-50"></TableHead>
            
            {/* Headers */}
            {tableData.headers.map((header, colIndex) => (
              <TableHead 
                key={colIndex} 
                className="relative border border-gray-200 bg-gray-50"
                onMouseEnter={() => setShowColumnControls(colIndex)}
                onMouseLeave={() => setShowColumnControls(null)}
              >
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none p-2 min-w-20"
                  onBlur={(e) => handleHeaderChange(colIndex, e.currentTarget.textContent || "")}
                >
                  {header}
                </div>
                
                {/* Column controls (visible on hover) */}
                {showColumnControls === colIndex && (
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 flex bg-white shadow rounded border">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => moveColumn(colIndex, colIndex - 1)} 
                      disabled={colIndex === 0}
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeColumn(colIndex)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </TableHead>
            ))}
            
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
        
        <TableBody>
          {tableData.rows.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex}
              className="hover:bg-gray-50"
              onMouseEnter={() => setShowRowControls(rowIndex)}
              onMouseLeave={() => setShowRowControls(null)}
            >
              {/* Row controls */}
              <TableCell className="w-10 p-0 relative border border-gray-200">
                <div className="flex justify-center items-center h-full cursor-ns-resize">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                
                {/* Row action menu (visible on hover) */}
                {showRowControls === rowIndex && (
                  <div className="absolute -left-7 top-1/2 transform -translate-y-1/2 flex flex-col bg-white shadow rounded border">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => moveRow(rowIndex, rowIndex - 1)}
                      disabled={rowIndex === 0}
                    >
                      <GripVertical className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeRow(rowIndex)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </TableCell>
              
              {/* Row cells */}
              {row.map((cell, colIndex) => (
                <TableCell 
                  key={colIndex} 
                  className="border border-gray-200 p-0"
                  onClick={() => setSelectedCell({row: rowIndex, col: colIndex})}
                >
                  <div 
                    contentEditable
                    suppressContentEditableWarning
                    className={`outline-none p-2 min-h-10 ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-blue-50' : ''}`}
                    onBlur={(e) => handleCellChange(rowIndex, colIndex, e.currentTarget.textContent || "")}
                  >
                    {cell}
                  </div>
                </TableCell>
              ))}
              
              {/* Empty cell for the add column button */}
              <TableCell className="w-10 border border-gray-200"></TableCell>
            </TableRow>
          ))}
          
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
      </Table>
    </div>
  );
};
