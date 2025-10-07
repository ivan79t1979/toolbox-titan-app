'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Download,
  Upload,
  Play,
  StopCircle,
  Pause,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  Trash2,
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
import jsPDF from 'jspdf';

type TimeEntry = {
  id: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  duration: string; // HH:MM:SS
};

// Helper to format seconds into HH:MM:SS
const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map((v) => v.toString().padStart(2, '0'))
    .join(':');
};

const defaultEntries: TimeEntry[] = [
    { id: '1', description: 'Initial project setup', startTime: new Date(Date.now() - 3600000).toISOString(), endTime: new Date(Date.now() - 1800000).toISOString(), duration: '00:30:00' },
    { id: '2', description: 'Component library research', startTime: new Date(Date.now() - 5400000).toISOString(), endTime: new Date(Date.now() - 3600000).toISOString(), duration: '00:30:00' }
]


export function TimeTracker() {
  const [entries, setEntries] = useState<TimeEntry[]>(defaultEntries);
  const [currentTask, setCurrentTask] = useState('');
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!currentTask.trim()) {
      toast({
        variant: 'destructive',
        title: 'Task description is required',
        description: 'Please enter a task before starting the timer.',
      });
      return;
    }
    setIsActive(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);

    if (startTime) {
        const newEntry: TimeEntry = {
          id: `entry-${Date.now()}`,
          description: currentTask,
          startTime: startTime.toISOString(),
          endTime: new Date().toISOString(),
          duration: formatDuration(timer),
        };

        setEntries((prev) => [newEntry, ...prev]);
    }
    
    setCurrentTask('');
    setTimer(0);
    setStartTime(null);
  }, [currentTask, startTime, timer]);

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };
  
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

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
        let newEntries: TimeEntry[];
        if (fileType === 'json') {
          newEntries = JSON.parse(data as string);
        } else if (fileType === 'csv') {
          const workbook = XLSX.read(data as string, { type: 'string' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          newEntries = XLSX.utils.sheet_to_json<TimeEntry>(sheet);
        } else if (fileType === 'xlsx') {
          const workbook = XLSX.read(data as ArrayBuffer, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          newEntries = XLSX.utils.sheet_to_json<TimeEntry>(sheet);
        } else {
          throw new Error(`Unsupported file type: .${fileType}`);
        }
        
        if (!Array.isArray(newEntries)) throw new Error('Invalid file structure.');
        setEntries(newEntries);

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
  
  const exportJSON = () => downloadFile('time-tracker.json', JSON.stringify(entries, null, 2), 'application/json');
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('time-tracker.csv', csv, 'text/csv');
  };
  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');
    XLSX.writeFile(workbook, 'time-tracker.xlsx');
  };
  
  const exportPNG = async () => {
    if (!listRef.current) return;
    try {
      // Get the computed background color
      const computedStyle = window.getComputedStyle(document.body);
      const bgColor = computedStyle.backgroundColor;
      
      const canvas = await html2canvas(listRef.current, { 
        scale: 2,
        backgroundColor: bgColor,
      });
      const link = document.createElement('a');
      link.download = 'time-tracker.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PNG.' });
    }
  };
  
  const exportPDF = async () => {
    if (!listRef.current) return;
    try {
        const canvas = await html2canvas(listRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('time-tracker.pdf');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export as PDF.' });
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
       <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-list, .printable-list * { visibility: visible; }
            .printable-list { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
            .no-print { display: none !important; }
        }
      `}</style>

      <Card className="no-print">
        <CardHeader>
          <CardTitle>What are you working on?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-2">
          <div className="flex-grow">
            <Input
              placeholder="e.g., Designing the new dashboard"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              disabled={isActive}
              className="text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-mono font-bold w-32 text-center bg-muted rounded-md p-2">
              {formatDuration(timer)}
            </div>
            {!isActive ? (
                <Button onClick={startTimer} size="lg" className="w-32">
                    <Play className="mr-2" /> Start
                </Button>
            ) : (
                <div className="flex gap-2">
                    {isPaused ? (
                        <Button onClick={resumeTimer} size="lg" variant="outline">
                            <Play className="mr-2" /> Resume
                        </Button>
                    ) : (
                        <Button onClick={pauseTimer} size="lg" variant="outline">
                            <Pause className="mr-2" /> Pause
                        </Button>
                    )}
                    <Button onClick={stopTimer} size="lg" className="bg-red-600 hover:bg-red-700">
                        <StopCircle className="mr-2" /> Stop
                    </Button>
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
                <CardTitle>Time Entries</CardTitle>
                <CardDescription>A log of your tracked time.</CardDescription>
            </div>
            <div className="flex gap-2 no-print">
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
        </CardHeader>
        <CardContent>
          <div ref={listRef} className="printable-list">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="no-print"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries.length > 0 ? entries.map(entry => (
                        <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.description}</TableCell>
                            <TableCell>{new Date(entry.startTime).toLocaleTimeString()}</TableCell>
                            <TableCell>{new Date(entry.endTime).toLocaleTimeString()}</TableCell>
                            <TableCell>{entry.duration}</TableCell>
                            <TableCell className="text-right no-print">
                                <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No entries yet. Start the timer to log your first task.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
