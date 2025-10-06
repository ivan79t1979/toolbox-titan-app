'use client';

import { useState, useMemo, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { KanbanColumn, KanbanTaskCard } from './kanban-components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Download,
  Upload,
  PlusCircle,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image,
  Printer,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Id, Column, Task } from './kanban-types';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const defaultCols: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const defaultTasks: Task[] = [
  { id: '1', columnId: 'todo', content: 'Brainstorm new feature ideas', priority: 'medium', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString() },
  { id: '2', columnId: 'todo', content: 'Design the user interface mockups', priority: 'high' },
  { id: '3', columnId: 'inprogress', content: 'Develop the authentication flow', priority: 'urgent', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() },
  { id: '4', columnId: 'done', content: 'Set up the project repository' },
  { id: '5', columnId: 'done', content: 'Deploy the landing page', priority: 'low' },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  
  const boardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Column') {
      setActiveColumn(active.data.current.column);
      return;
    }
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveATask = active.data.current?.type === 'Task';
    if (!isActiveATask) return;

    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    setTasks((currentTasks) => {
      const activeIndex = currentTasks.findIndex((t) => t.id === active.id);
      const activeTask = currentTasks[activeIndex];

      if (isOverATask) {
        let overIndex = currentTasks.findIndex((t) => t.id === over.id);
        if (activeTask.columnId !== currentTasks[overIndex].columnId) {
          currentTasks[activeIndex].columnId = currentTasks[overIndex].columnId;
          return arrayMove(currentTasks, activeIndex, overIndex);
        }
        return arrayMove(currentTasks, activeIndex, overIndex);
      }

      if (isOverAColumn) {
        if (activeTask.columnId !== over.id) {
          currentTasks[activeIndex].columnId = over.id as Id;
          return arrayMove(currentTasks, activeIndex, activeIndex);
        }
      }
      return currentTasks;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) {
      setColumns((currentColumns) => {
        const activeColumnIndex = currentColumns.findIndex(c => c.id === active.id);
        const overColumnIndex = currentColumns.findIndex(c => c.id === over.id);
        return arrayMove(currentColumns, activeColumnIndex, overColumnIndex);
      });
    }
  };

  const addTask = (columnId: Id) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      columnId,
      content: `New Task`,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId: Id) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };
  
  const updateTask = (taskId: Id, updatedProperties: Partial<Task>) => {
    setTasks(tasks.map(task => task.id === taskId ? {...task, ...updatedProperties} : task));
  };

  const addColumn = () => {
    if (!newColumnTitle.trim()) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Column title cannot be empty.",
        });
        return;
    }
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: newColumnTitle,
    };
    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
  };

  const deleteColumn = (columnId: Id) => {
    if (columns.length <= 1) {
        toast({ variant: "destructive", title: "Cannot delete last column"});
        return;
    }
    setColumns(columns.filter(c => c.id !== columnId));
    setTasks(tasks.filter(t => t.columnId !== columnId));
  };

  const updateColumnTitle = (columnId: Id, title: string) => {
    setColumns(columns.map(col => col.id === columnId ? {...col, title} : col));
  };

  // --- Import / Export ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("File could not be read.");
        if (fileType === 'json') {
          importJSON(data as string);
        } else if (fileType === 'csv') {
          importCSV(data as string);
        } else if (fileType === 'xlsx') {
          importXLSX(data as ArrayBuffer);
        } else {
            throw new Error(`Unsupported file type: .${fileType}`);
        }
        toast({title: "Import Successful", description: `${file.name} was imported.`});
      } catch (error: any) {
        toast({ variant: "destructive", title: "Import Failed", description: error.message });
      } finally {
        // Reset file input
        if(fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    
    if (fileType === 'xlsx') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const importJSON = (jsonData: string) => {
    const { columns: newColumns, tasks: newTasks } = JSON.parse(jsonData);
    if (!Array.isArray(newColumns) || !Array.isArray(newTasks)) {
      throw new Error("Invalid JSON structure.");
    }
    setColumns(newColumns);
    setTasks(newTasks);
  };

  const importCSV = (csvData: string) => {
    const workbook = XLSX.read(csvData, { type: 'string' });
    processWorkbook(workbook);
  };

  const importXLSX = (arrayBuffer: ArrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    processWorkbook(workbook);
  };
  
  const processWorkbook = (workbook: XLSX.WorkBook) => {
    const tasksSheet = workbook.Sheets[workbook.SheetNames[0]];
    const newTasks = XLSX.utils.sheet_to_json<Task>(tasksSheet);
    const newColumns = [...new Set(newTasks.map(t => t.columnId))].map(id => ({id, title: columns.find(c => c.id === id)?.title || (id as string)}));
    
    // Add columns that might exist in the import file but not on the board
    const existingColIds = new Set(columns.map(c => c.id));
    const uniqueNewCols = newColumns.filter(c => !existingColIds.has(c.id));
    
    setTasks(newTasks);
    setColumns([...columns, ...uniqueNewCols]);
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const data = JSON.stringify({ columns, tasks }, null, 2);
    downloadFile('kanban-board.json', data, 'application/json');
  };

  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('kanban-board.csv', csv, 'text/csv');
  };

  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'kanban-board.xlsx');
  };
  
  const exportPNG = async () => {
    if (!boardRef.current) return;
    try {
        const canvas = await html2canvas(boardRef.current, { scale: 2 });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'kanban-board.png';
        link.href = image;
        link.click();
    } catch (error) {
        toast({variant: "destructive", title: "Export Failed", description: "Could not export board as PNG."});
    }
  };

  const exportPDF = () => {
    // This uses the browser's print-to-pdf functionality
    window.print();
  };

  return (
    <div className="space-y-4">
       <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-board, .printable-board * { visibility: visible; }
            .printable-board { position: absolute; left: 0; top: 0; width: 100%; }
            header, .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex gap-2">
            <Input 
              placeholder="New Column Title" 
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="w-48"
            />
            <Button onClick={addColumn}><PlusCircle className="mr-2"/>Add Column</Button>
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><Upload className="mr-2" /> Import</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Import from</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={triggerFileUpload}>
                  <FileJson className="mr-2" /> JSON / CSV / XLSX
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><Download className="mr-2" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2" /> JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2" /> CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportXLSX}><FileSpreadsheet className="mr-2" /> XLSX</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPNG}><Image className="mr-2" /> PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}><Printer className="mr-2" /> PDF</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
             <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".json,.csv,.xlsx"
            />
        </div>
      </div>
      
      <div ref={boardRef} className="printable-board">
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
        >
            <div className="grid auto-cols-fr grid-flow-col gap-4 overflow-x-auto">
                <SortableContext items={columnsId} strategy={horizontalListSortingStrategy}>
                    {columns.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        column={col}
                        deleteColumn={deleteColumn}
                        updateColumnTitle={updateColumnTitle}
                        addTask={() => addTask(col.id)}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                    />
                    ))}
                </SortableContext>
            </div>
            {typeof document !== 'undefined' && createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <KanbanColumn
                            column={activeColumn}
                            deleteColumn={deleteColumn}
                            updateColumnTitle={updateColumnTitle}
                            addTask={() => addTask(activeColumn.id)}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter(
                                (task) => task.columnId === activeColumn.id
                            )}
                        />
                    )}
                    {activeTask && (
                        <KanbanTaskCard task={activeTask} />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
      </div>
    </div>
  );
}
