'use client';

import { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Download,
  Upload,
  PlusCircle,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image,
  Printer,
  Trash2,
  GripVertical,
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
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

type Task = {
  id: string;
  content: string;
  completed: boolean;
};

const defaultTasks: Task[] = [
  { id: '1', content: 'Create a new project plan', completed: false },
  { id: '2', content: 'Review the design mockups', completed: false },
  { id: '3', content: 'Schedule a team meeting', completed: true },
];

function SortableTaskItem({
  task,
  toggleTask,
  deleteTask,
}: {
  task: Task;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 rounded-md bg-muted/30 p-3 transition-colors hover:bg-muted/60"
    >
      <Button
        variant="ghost"
        size="icon"
        {...attributes}
        {...listeners}
        className="h-7 w-7 cursor-grab no-print"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={cn(
          'flex-grow cursor-pointer',
          task.completed && 'text-muted-foreground line-through'
        )}
      >
        {task.content}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 no-print"
        onClick={() => deleteTask(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [newTaskContent, setNewTaskContent] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContent.trim(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskContent('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  // --- Import / Export ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        if (fileType === 'json') {
          const newTasks = JSON.parse(data as string);
          if (!Array.isArray(newTasks))
            throw new Error('Invalid JSON structure.');
          setTasks(newTasks);
        } else if (fileType === 'csv') {
          const workbook = XLSX.read(data as string, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const newTasks = XLSX.utils.sheet_to_json<Task>(sheet);
          setTasks(newTasks);
        } else if (fileType === 'xlsx') {
          const workbook = XLSX.read(data as ArrayBuffer, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const newTasks = XLSX.utils.sheet_to_json<Task>(sheet);
          setTasks(newTasks);
        } else {
          throw new Error(`Unsupported file type: .${fileType}`);
        }
        toast({
          title: 'Import Successful',
          description: `${file.name} was imported.`,
        });
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Import Failed',
          description: error.message,
        });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    if (fileType === 'xlsx') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => fileInputRef.current?.click();

  const downloadFile = (
    filename: string,
    content: string,
    mimeType: string
  ) => {
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
    const data = JSON.stringify(tasks, null, 2);
    downloadFile('todo-list.json', data, 'application/json');
  };

  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('todo-list.csv', csv, 'text/csv');
  };

  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'todo-list.xlsx');
  };

  const exportPNG = async () => {
    if (!listRef.current) return;
    try {
      const canvas = await html2canvas(listRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'todo-list.png';
      link.href = image;
      link.click();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Could not export list as PNG.',
      });
    }
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-list, .printable-list * { visibility: visible; }
            .printable-list { position: absolute; left: 0; top: 0; width: 100%; padding: 2rem; }
            .no-print { display: none !important; }
        }
      `}</style>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4 no-print">
            <CardTitle>My Tasks</CardTitle>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" /> Import
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Import from</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={triggerFileUpload}>
                    <FileJson className="mr-2 h-4 w-4" /> JSON / CSV / XLSX
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export as</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportJSON}>
                    <FileJson className="mr-2 h-4 w-4" /> JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportCSV}>
                    <FileText className="mr-2 h-4 w-4" /> CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportXLSX}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> XLSX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportPNG}>
                    <Image className="mr-2 h-4 w-4" /> PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportPDF}>
                    <Printer className="mr-2 h-4 w-4" /> PDF
                  </DropdownMenuItem>
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
          <form onSubmit={handleAddTask} className="mt-4 flex gap-2 no-print">
            <Input
              placeholder="Add a new task..."
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
            />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-between text-sm text-muted-foreground">
            <span>Pending: {pendingCount}</span>
            <span>Completed: {completedCount}</span>
          </div>
          <div ref={listRef} className="printable-list space-y-2">
            {tasks.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                  {tasks.map((task) => (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      toggleTask={toggleTask}
                      deleteTask={deleteTask}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed">
                <p className="text-muted-foreground">
                  No tasks yet. Add one above!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
