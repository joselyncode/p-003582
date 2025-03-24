import React, { useState, useRef, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, GripVertical, Move, Copy, Eraser, Paintbrush } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
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
  rowColors: string[];
  columnColors: string[];
}

interface TableBlockProps {
  initialContent: string;
  onUpdate: (content: string) => void;
}

// Define available colors
const COLORS = [
  { name: "Default", value: "" },
  { name: "Gray", value: "bg-gray-100" },
  { name: "Red", value: "bg-red-100" },
  { name: "Orange", value: "bg-orange-100" },
  { name: "Yellow", value: "bg-yellow-100" },
  { name: "Green", value: "bg-green-100" },
  { name: "Blue", value: "bg-blue-100" },
  { name: "Purple", value: "bg-purple-100" },
  { name: "Pink", value: "bg-pink-100" },
];

// SortableColumnHeader component
const SortableColumnHeader = ({ 
  header, 
  index, 
  onHeaderChange, 
  onRemoveColumn, 
  onInsertColumn, 
  onDuplicateColumn, 
  onClearColumn,
  onSetColumnColor,
  columnColor
}: { 
  header: string, 
  index: number, 
  onHeaderChange: (index: number, value: string) => void,
  onRemoveColumn: (index: number) => void,
  onInsertColumn: (index: number, position: 'before' | 'after') => void,
  onDuplicateColumn: (index: number) => void,
  onClearColumn: (index: number) => void,
  onSetColumnColor: (index: number, color: string) => void,
  columnColor: string
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
      className={`relative border border-gray-200 ${columnColor || 'bg-gray-50'}`}
    >
      <div className="flex items-center">
        <div className="w-full">
          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div 
                  className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm border rounded"
                  {...attributes}
                  {...listeners}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDuplicateColumn(index)}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Duplicate column</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onClearColumn(index)}>
                  <Eraser className="mr-2 h-4 w-4" />
                  <span>Clear contents</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Paintbrush className="mr-2 h-4 w-4" />
                    <span>Set column color</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {COLORS.map((color) => (
                      <DropdownMenuItem 
                        key={color.name} 
                        onClick={() => onSetColumnColor(index, color.value)}
                        className="flex items-center"
                      >
                        <div className={`w-4 h-4 mr-2 rounded border ${color.value || 'bg-white'}`}></div>
                        <span>{color.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onInsertColumn(index, 'before')}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Insert left</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onInsertColumn(index, 'after')}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Insert right</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onRemoveColumn(index)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete column</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      </div>
    </TableHead>
  );
};

// SortableRow component
const SortableRow = ({ 
  row, 
  rowIndex, 
  headers, 
  onCellChange,
  onRemoveRow,
  onInsertRow,
  onDuplicateRow,
  onClearRow,
  onSetRowColor,
  rowColor,
  columnColors
}: { 
  row: string[], 
  rowIndex: number, 
  headers: string[],
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void,
  onRemoveRow: (index: number) => void,
  onInsertRow: (index: number, position: 'before' | 'after') => void,
  onDuplicateRow: (index: number) => void,
  onClearRow: (index: number) => void,
  onSetRowColor: (index: number, color: string) => void,
  rowColor: string,
  columnColors: string[]
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
      className={`${rowColor} hover:bg-opacity-80`}
    >
      <TableCell className="w-10 p-0 relative border border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div 
              className="flex justify-center items-center h-full cursor-grab"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onDuplicateRow(rowIndex)}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicate row</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClearRow(rowIndex)}>
              <Eraser className="mr-2 h-4 w-4" />
              <span>Clear contents</span>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Paintbrush className="mr-2 h-4 w-4" />
                <span>Set row color</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {COLORS.map((color) => (
                  <DropdownMenuItem 
                    key={color.name} 
                    onClick={() => onSetRowColor(rowIndex, color.value)}
                    className="flex items-center"
                  >
                    <div className={`w-4 h-4 mr-2 rounded border ${color.value || 'bg-white'}`}></div>
                    <span>{color.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onInsertRow(rowIndex, 'before')}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Insert above</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onInsertRow(rowIndex, 'after')}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Insert below</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onRemoveRow(rowIndex)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete row</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      
      {row.map((cell, colIndex) => (
        <TableCell 
          key={colIndex} 
          className={`border border-gray-200 p-0 ${columnColors[colIndex] || ''}`}
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
      
      <TableCell className="w-10 border border-gray-200"></TableCell>
    </TableRow>
  );
};

export const TableBlock: React.FC<TableBlockProps> = ({ initialContent, onUpdate }) => {
  const parseTableData = (): TableData => {
    try {
      const parsed = JSON.parse(initialContent);
      return {
        headers: parsed.headers || ["Column 1", "Column 2", "Column 3"],
        rows: parsed.rows || [["", "", ""], ["", "", ""]],
        rowColors: parsed.rowColors || Array(parsed.rows?.length || 2).fill(""),
        columnColors: parsed.columnColors || Array(parsed.headers?.length || 3).fill(""),
      };
    } catch (e) {
      return {
        headers: ["Column 1", "Column 2", "Column 3"],
        rows: [["", "", ""], ["", "", ""]],
        rowColors: ["", ""],
        columnColors: ["", "", ""]
      };
    }
  };
  
  const [tableData, setTableData] = useState<TableData>(parseTableData);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  useEffect(() => {
    onUpdate(JSON.stringify(tableData));
  }, [tableData, onUpdate]);
  
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    
    setTableData({
      ...tableData,
      rows: newRows
    });
  };
  
  const handleHeaderChange = (colIndex: number, value: string) => {
    const newHeaders = [...tableData.headers];
    newHeaders[colIndex] = value;
    
    setTableData({
      ...tableData,
      headers: newHeaders
    });
  };
  
  const addColumn = () => {
    const newHeaders = [...tableData.headers, `Column ${tableData.headers.length + 1}`];
    const newRows = tableData.rows.map(row => [...row, ""]);
    const newColumnColors = [...tableData.columnColors, ""];
    
    setTableData({
      ...tableData,
      headers: newHeaders,
      rows: newRows,
      columnColors: newColumnColors
    });
  };
  
  const removeColumn = (colIndex: number) => {
    if (tableData.headers.length <= 1) return;
    
    const newHeaders = tableData.headers.filter((_, index) => index !== colIndex);
    const newRows = tableData.rows.map(row => 
      row.filter((_, index) => index !== colIndex)
    );
    const newColumnColors = tableData.columnColors.filter((_, index) => index !== colIndex);
    
    setTableData({
      ...tableData,
      headers: newHeaders,
      rows: newRows,
      columnColors: newColumnColors
    });
  };
  
  const insertColumn = (colIndex: number, position: 'before' | 'after') => {
    const insertIndex = position === 'before' ? colIndex : colIndex + 1;
    const newColumnName = `Column ${tableData.headers.length + 1}`;
    
    const newHeaders = [...tableData.headers];
    newHeaders.splice(insertIndex, 0, newColumnName);
    
    const newRows = tableData.rows.map(row => {
      const newRow = [...row];
      newRow.splice(insertIndex, 0, "");
      return newRow;
    });
    
    const newColumnColors = [...tableData.columnColors];
    newColumnColors.splice(insertIndex, 0, "");
    
    setTableData({
      ...tableData,
      headers: newHeaders,
      rows: newRows,
      columnColors: newColumnColors
    });
  };
  
  const duplicateColumn = (colIndex: number) => {
    const columnHeader = tableData.headers[colIndex];
    const newColumnName = `${columnHeader} (copy)`;
    
    const newHeaders = [...tableData.headers];
    newHeaders.splice(colIndex + 1, 0, newColumnName);
    
    const newRows = tableData.rows.map(row => {
      const newRow = [...row];
      newRow.splice(colIndex + 1, 0, row[colIndex]);
      return newRow;
    });
    
    const newColumnColors = [...tableData.columnColors];
    newColumnColors.splice(colIndex + 1, 0, tableData.columnColors[colIndex]);
    
    setTableData({
      ...tableData,
      headers: newHeaders,
      rows: newRows,
      columnColors: newColumnColors
    });
  };
  
  const clearColumn = (colIndex: number) => {
    const newRows = tableData.rows.map(row => {
      const newRow = [...row];
      newRow[colIndex] = "";
      return newRow;
    });
    
    setTableData({
      ...tableData,
      rows: newRows
    });
  };
  
  const setColumnColor = (colIndex: number, color: string) => {
    const newColumnColors = [...tableData.columnColors];
    newColumnColors[colIndex] = color;
    
    setTableData({
      ...tableData,
      columnColors: newColumnColors
    });
  };
  
  const addRow = () => {
    const newRow = Array(tableData.headers.length).fill("");
    const newRowColors = [...tableData.rowColors, ""];
    
    setTableData({
      ...tableData,
      rows: [...tableData.rows, newRow],
      rowColors: newRowColors
    });
  };
  
  const removeRow = (rowIndex: number) => {
    if (tableData.rows.length <= 1) return;
    
    const newRows = tableData.rows.filter((_, index) => index !== rowIndex);
    const newRowColors = tableData.rowColors.filter((_, index) => index !== rowIndex);
    
    setTableData({
      ...tableData,
      rows: newRows,
      rowColors: newRowColors
    });
  };
  
  const insertRow = (rowIndex: number, position: 'before' | 'after') => {
    const insertIndex = position === 'before' ? rowIndex : rowIndex + 1;
    const newRow = Array(tableData.headers.length).fill("");
    
    const newRows = [...tableData.rows];
    newRows.splice(insertIndex, 0, newRow);
    
    const newRowColors = [...tableData.rowColors];
    newRowColors.splice(insertIndex, 0, "");
    
    setTableData({
      ...tableData,
      rows: newRows,
      rowColors: newRowColors
    });
  };
  
  const duplicateRow = (rowIndex: number) => {
    const rowToDuplicate = tableData.rows[rowIndex];
    
    const newRows = [...tableData.rows];
    newRows.splice(rowIndex + 1, 0, [...rowToDuplicate]);
    
    const newRowColors = [...tableData.rowColors];
    newRowColors.splice(rowIndex + 1, 0, tableData.rowColors[rowIndex]);
    
    setTableData({
      ...tableData,
      rows: newRows,
      rowColors: newRowColors
    });
  };
  
  const clearRow = (rowIndex: number) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex] = Array(tableData.headers.length).fill("");
    
    setTableData({
      ...tableData,
      rows: newRows
    });
  };
  
  const setRowColor = (rowIndex: number, color: string) => {
    const newRowColors = [...tableData.rowColors];
    newRowColors[rowIndex] = color;
    
    setTableData({
      ...tableData,
      rowColors: newRowColors
    });
  };
  
  const handleColumnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      
      const activeIndex = parseInt(activeId.replace('col-', ''));
      const overIndex = parseInt(overId.replace('col-', ''));
      
      const newHeaders = [...tableData.headers];
      const [movedHeader] = newHeaders.splice(activeIndex, 1);
      newHeaders.splice(overIndex, 0, movedHeader);
      
      const newRows = tableData.rows.map(row => {
        const newRow = [...row];
        const [movedCell] = newRow.splice(activeIndex, 1);
        newRow.splice(overIndex, 0, movedCell);
        return newRow;
      });
      
      const newColumnColors = [...tableData.columnColors];
      const [movedColor] = newColumnColors.splice(activeIndex, 1);
      newColumnColors.splice(overIndex, 0, movedColor);
      
      setTableData({
        ...tableData,
        headers: newHeaders,
        rows: newRows,
        columnColors: newColumnColors
      });
    }
  };
  
  const handleRowDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      
      const activeIndex = parseInt(activeId.replace('row-', ''));
      const overIndex = parseInt(overId.replace('row-', ''));
      
      const newRows = [...tableData.rows];
      const [movedRow] = newRows.splice(activeIndex, 1);
      newRows.splice(overIndex, 0, movedRow);
      
      const newRowColors = [...tableData.rowColors];
      const [movedColor] = newRowColors.splice(activeIndex, 1);
      newRowColors.splice(overIndex, 0, movedColor);
      
      setTableData({
        ...tableData,
        rows: newRows,
        rowColors: newRowColors
      });
    }
  };

  return (
    <div className="relative overflow-x-auto my-2 group">
      <div className="flex items-center justify-between mb-1 p-1 bg-gray-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-sm font-medium text-gray-500 sr-only">Options</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <span>Table actions</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add row</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={addColumn}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add column</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table className="border-collapse border border-gray-200">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleColumnDragEnd}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 p-0 bg-gray-50"></TableHead>
              
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
                    onRemoveColumn={removeColumn}
                    onInsertColumn={insertColumn}
                    onDuplicateColumn={duplicateColumn}
                    onClearColumn={clearColumn}
                    onSetColumnColor={setColumnColor}
                    columnColor={tableData.columnColors[colIndex]}
                  />
                ))}
              </SortableContext>
              
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
                  onRemoveRow={removeRow}
                  onInsertRow={insertRow}
                  onDuplicateRow={duplicateRow}
                  onClearRow={clearRow}
                  onSetRowColor={setRowColor}
                  rowColor={tableData.rowColors[rowIndex]}
                  columnColors={tableData.columnColors}
                />
              ))}
            </SortableContext>
            
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
