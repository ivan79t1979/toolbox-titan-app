'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Download,
  Upload,
  PlusCircle,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Users,
  NotebookText,
  Edit,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format, parse, parseISO } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

type Meeting = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  attendees: string;
  agenda: string;
};

const defaultMeetings: Meeting[] = [
  { id: '1', title: 'Project Kick-off', date: format(new Date(), 'yyyy-MM-dd'), startTime: '10:00', endTime: '11:00', attendees: 'Alice, Bob, Charlie', agenda: 'Discuss project goals and timeline.' },
  { id: '2', title: 'Weekly Sync', date: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), startTime: '14:00', endTime: '14:30', attendees: 'Team', agenda: 'Review weekly progress and blockers.' },
];

function MeetingForm({ onSave, meeting }: { onSave: (meeting: Meeting) => void; meeting?: Meeting }) {
  const [title, setTitle] = useState(meeting?.title || '');
  const [date, setDate] = useState<Date | undefined>(meeting ? parseISO(meeting.date) : new Date());
  const [startTime, setStartTime] = useState(meeting?.startTime || '09:00');
  const [endTime, setEndTime] = useState(meeting?.endTime || '10:00');
  const [attendees, setAttendees] = useState(meeting?.attendees || '');
  const [agenda, setAgenda] = useState(meeting?.agenda || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
        toast({
            variant: 'destructive',
            title: 'Missing information',
            description: 'Please provide at least a title and a date.',
        })
      return;
    }
    onSave({
      id: meeting?.id || `meeting-${Date.now()}`,
      title,
      date: format(date, 'yyyy-MM-dd'),
      startTime,
      endTime,
      attendees,
      agenda,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Quarterly Review" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
                </PopoverContent>
            </Popover>
        </div>
        <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendees">Attendees</Label>
        <Input id="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="e.g., Alice, Bob, Charlie" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="agenda">Agenda</Label>
        <Textarea id="agenda" value={agenda} onChange={(e) => setAgenda(e.target.value)} placeholder="Meeting points..." />
      </div>
      <DialogFooter>
        <DialogClose asChild>
            <Button type="submit">Save Meeting</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}

export function MeetingPlanner() {
  const [meetings, setMeetings] = useState<Meeting[]>(defaultMeetings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | undefined>(undefined);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleSaveMeeting = (meetingData: Meeting) => {
    setMeetings(prev => {
        const existing = prev.find(m => m.id === meetingData.id);
        if (existing) {
            return prev.map(m => m.id === meetingData.id ? meetingData : m);
        }
        return [...prev, meetingData].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
    setIsFormOpen(false);
    setEditingMeeting(undefined);
  };
  
  const handleEdit = (meeting: Meeting) => {
      setEditingMeeting(meeting);
      setIsFormOpen(true);
  }

  const handleDelete = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };
  
  const openNewMeetingForm = () => {
      setEditingMeeting(undefined);
      setIsFormOpen(true);
  }

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
        let newMeetings: Meeting[];

        if (fileType === 'json') {
          newMeetings = JSON.parse(data as string);
        } else {
          const workbook = fileType === 'xlsx'
              ? XLSX.read(data, { type: 'array' })
              : XLSX.read(data, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          newMeetings = XLSX.utils.sheet_to_json<Meeting>(sheet);
        }

        if (!Array.isArray(newMeetings)) throw new Error('Invalid file structure.');
        setMeetings(newMeetings);
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

  const triggerFileUpload = () => fileInputRef.current?.click();
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

  const exportJSON = () => downloadFile('meeting-planner.json', JSON.stringify(meetings, null, 2), 'application/json');
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(meetings);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('meeting-planner.csv', csv, 'text/csv');
  };
  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(meetings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Meetings');
    XLSX.writeFile(workbook, 'meeting-planner.xlsx');
  };

  const exportPNG = async () => {
    if (!listRef.current) return;
    try {
      const canvas = await html2canvas(listRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'meeting-planner.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
    }
  };
  const exportPDF = () => window.print();

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-list, .printable-list * { visibility: visible; }
          .printable-list { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={openNewMeetingForm}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Meeting
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{editingMeeting ? 'Edit Meeting' : 'Add New Meeting'}</DialogTitle>
                </DialogHeader>
                <MeetingForm onSave={handleSaveMeeting} meeting={editingMeeting} />
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

      <div ref={listRef} className="printable-list space-y-4">
        {meetings.length > 0 ? meetings.map(meeting => (
          <Card key={meeting.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle>{meeting.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {format(parseISO(meeting.date), 'PPP')}</span>
                          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {meeting.startTime} - {meeting.endTime}</span>
                      </CardDescription>
                  </div>
                  <div className="flex gap-2 no-print">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(meeting)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(meeting.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" /> Attendees</h4>
                    <p className="text-muted-foreground">{meeting.attendees}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <div className="space-y-2 w-full">
                    <h4 className="flex items-center gap-2 text-sm font-semibold"><NotebookText className="h-4 w-4" /> Agenda</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{meeting.agenda}</p>
                </div>
            </CardFooter>
          </Card>
        )) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No meetings planned.</p>
            <p className="text-sm text-muted-foreground">Click "Add Meeting" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
