'use client';

import { useState, useMemo, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  PlusCircle,
  Edit,
  Trash2,
  Download,
  Upload,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  CalendarIcon,
  CheckCircle2,
  XCircle,
  Loader,
  GripVertical,
  Trophy,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, parseISO, isPast } from 'date-fns';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type MilestoneStatus = 'upcoming' | 'in-progress' | 'completed' | 'missed';

type Milestone = {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: MilestoneStatus;
};

const defaultMilestones: Milestone[] = [
  { id: '1', title: 'Project Alpha Launch', dueDate: format(new Date(new Date().setDate(new Date().getDate() + 10)), 'yyyy-MM-dd'), status: 'in-progress' },
  { id: '2', title: 'User Testing Phase', dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'), status: 'upcoming' },
  { id: '3', title: 'Initial Design Mockups', dueDate: format(new Date(new Date().setDate(new Date().getDate() - 5)), 'yyyy-MM-dd'), status: 'completed' },
  { id: '4', title: 'API Integration Deadline', dueDate: format(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd'), status: 'missed' },
];

const statusConfig: Record<MilestoneStatus, { label: string; color: string; icon: React.FC<any> }> = {
  upcoming: { label: 'Upcoming', color: 'bg-blue-500', icon: CalendarIcon },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-500', icon: Loader },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  missed: { label: 'Missed', color: 'bg-red-500', icon: XCircle },
};

function MilestoneForm({ onSave, milestone }: { onSave: (data: Omit<Milestone, 'id'> & { id?: string }) => void; milestone?: Milestone }) {
  const [title, setTitle] = useState(milestone?.title || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(milestone ? parseISO(milestone.dueDate) : new Date());
  const [status, setStatus] = useState<MilestoneStatus>(milestone?.status || 'upcoming');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out all fields.',
      });
      return;
    }
    onSave({
      id: milestone?.id,
      title,
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Milestone Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Finalize Feature Spec" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v: MilestoneStatus) => setStatus(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="submit">Save Milestone</Button></DialogClose>
      </DialogFooter>
    </form>
  );
}

function SortableMilestone({
    milestone,
    handleStatusChange,
    openEditDialog,
    handleDelete
}: {
    milestone: Milestone;
    handleStatusChange: (id: string, status: MilestoneStatus) => void;
    openEditDialog: (milestone: Milestone) => void;
    handleDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: milestone.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    const config = statusConfig[milestone.status];
    const Icon = config.icon;

    return (
        <Card ref={setNodeRef} style={style} className="relative group/milestone">
            <CardContent className="p-4 flex items-center gap-4">
                 <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab no-print absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover/milestone:opacity-100">
                    <GripVertical className="h-5 w-5" />
                </Button>
                <div className={cn("flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white", config.color)}>
                    <Icon className={cn("w-6 h-6", milestone.status === 'in-progress' && 'animate-spin')}/>
                </div>
                <div className="flex-grow">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground">Due: {format(parseISO(milestone.dueDate), 'PPP')}</p>
                </div>
                <div className="flex items-center gap-2 no-print">
                    <Select value={milestone.status} onValueChange={(v: MilestoneStatus) => handleStatusChange(milestone.id, v)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(milestone)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(milestone.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function MilestoneTracker() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | undefined>(undefined);
  
  const printableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const sortedMilestones = useMemo(() => {
    // Keep user-defined order unless sorting by date is preferred. 
    // For drag-and-drop, we use the `milestones` state directly.
    return milestones;
  }, [milestones]);
  
  const handleSaveMilestone = (data: Omit<Milestone, 'id'> & { id?: string }) => {
    const finalData: Milestone = {
        ...data,
        status: isPast(parseISO(data.dueDate)) && data.status !== 'completed' ? 'missed' : data.status,
    } as Milestone;

    setMilestones(prev => {
        if(data.id) { // Editing existing
            return prev.map(m => m.id === data.id ? { ...m, ...finalData, id: data.id } : m);
        } else { // Adding new
            const newMilestone = { ...finalData, id: `ms-${Date.now()}`};
            return [...prev, newMilestone];
        }
    });
    setIsFormOpen(false);
    setEditingMilestone(undefined);
  };
  
  const openEditDialog = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setIsFormOpen(true);
  }

  const openNewDialog = () => {
    setEditingMilestone(undefined);
    setIsFormOpen(true);
  }
  
  const handleDelete = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };
  
  const handleStatusChange = (id: string, status: MilestoneStatus) => {
    setMilestones(milestones.map(m => m.id === id ? {...m, status} : m));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
        setMilestones((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        });
    }
  };

  const exportFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => exportFile('milestone-tracker.json', JSON.stringify(milestones, null, 2), 'application/json');
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(milestones);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    exportFile('milestone-tracker.csv', csv, 'text/csv');
  };
  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(milestones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Milestones');
    XLSX.writeFile(workbook, 'milestone-tracker.xlsx');
  };
  const exportPNG = async () => {
    if (!printableRef.current) return;
    try {
      const canvas = await html2canvas(printableRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'milestone-tracker.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
    }
  };
  const exportPDF = async () => {
    if (!printableRef.current) return;
    try {
        const canvas = await html2canvas(printableRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('milestone-tracker.pdf');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PDF.' });
    }
  };
  const triggerFileUpload = () => fileInputRef.current?.click();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        let newMilestones: Milestone[];

        if (fileType === 'json') {
          newMilestones = JSON.parse(data as string);
        } else {
          const workbook = fileType === 'xlsx' ? XLSX.read(data, { type: 'array' }) : XLSX.read(data, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          newMilestones = XLSX.utils.sheet_to_json<Milestone>(sheet);
        }

        if (!Array.isArray(newMilestones)) throw new Error('Invalid file structure.');
        setMilestones(newMilestones);
        toast({ title: 'Import Successful', description: `${file.name} was imported.` });
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    if (fileType === 'xlsx') reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
  };


  return (
    <div className="space-y-6">
       <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewDialog}><PlusCircle className="mr-2 h-4 w-4" /> Add Milestone</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader><DialogTitle>{editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle></DialogHeader>
                <MilestoneForm onSave={handleSaveMilestone} milestone={editingMilestone} />
            </DialogContent>
        </Dialog>
        
        <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Import from</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={triggerFileUpload}><FileJson className="mr-2 h-4 w-4" /> JSON / CSV / XLSX</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportJSON}><FileJson className="mr-2 h-4 w-4" /> JSON</DropdownMenuItem>
                <DropdownMenuItem onClick={exportCSV}><FileText className="mr-2 h-4 w-4" /> CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportXLSX}><FileSpreadsheet className="mr-2 h-4 w-4" /> XLSX</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPNG}><ImageIcon className="mr-2 h-4 w-4" /> PNG</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}><Printer className="mr-2 h-4 w-4" /> PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".json,.csv,.xlsx" />
        </div>
      </div>

      <div ref={printableRef} className="printable-area space-y-4">
        {sortedMilestones.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedMilestones.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {sortedMilestones.map(milestone => (
                            <SortableMilestone
                                key={milestone.id}
                                milestone={milestone}
                                handleStatusChange={handleStatusChange}
                                openEditDialog={openEditDialog}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Trophy className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No milestones yet.</p>
            <p className="text-sm text-muted-foreground">Click "Add Milestone" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
