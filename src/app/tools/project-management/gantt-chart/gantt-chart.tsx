'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import {
  addDays,
  differenceInDays,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  PlusCircle,
  FileJson,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Printer,
  Trash2,
  CalendarIcon,
} from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

type Task = {
  id: string;
  name: string;
  start: string; // ISO string
  end:string; // ISO string
  progress: number; // 0-100
};

const defaultTasks: Task[] = [
  { id: 'task-1', name: 'Requirement Analysis', start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(), progress: 100 },
  { id: 'task-2', name: 'UI/UX Design', start: new Date(new Date().getFullYear(), new Date().getMonth(), 3).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(), progress: 80 },
  { id: 'task-3', name: 'API Development', start: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString(), progress: 60 },
  { id: 'task-4', name: 'Frontend Implementation', start: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString(), progress: 40 },
  { id: 'task-5', name: 'Testing & QA', start: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 30).toISOString(), progress: 10 },
  { id: 'task-6', name: 'Deployment', start: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString(), end: new Date(new Date().getFullYear(), new Date().getMonth(), 30).toISOString(), progress: 0 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const startDate = format(parseISO(data.start), 'MMM d, yyyy');
      const endDate = format(parseISO(data.end), 'MMM d, yyyy');
      return (
        <div className="bg-background border shadow-sm rounded-lg p-3 text-sm">
          <p className="font-bold">{data.name}</p>
          <p>Start: {startDate}</p>
          <p>End: {endDate}</p>
          <p>Progress: {data.progress}%</p>
        </div>
      );
    }
    return null;
};

export function GanttChart() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { chartData, domain, ticks, monthStarts } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      return {
        chartData: [],
        domain: [start.getTime(), end.getTime()],
        ticks: eachDayOfInterval({ start, end }).map(d => d.getTime()),
        monthStarts: [start.getTime()]
      };
    }

    const allDates = tasks.flatMap(t => [parseISO(t.start), parseISO(t.end)]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    const domainStart = startOfMonth(minDate);
    const domainEnd = endOfMonth(maxDate);

    const chartTasks = tasks.map(task => {
        const start = parseISO(task.start);
        const end = parseISO(task.end);
        const startOffset = differenceInDays(start, domainStart);
        const duration = differenceInDays(end, start) + 1;
        return {
          ...task,
          range: [startOffset, startOffset + duration],
          name: task.name
        };
      }).reverse(); // Reverse for correct Y-axis order in chart

    const days = eachDayOfInterval({ start: domainStart, end: domainEnd });
    
    const calculatedMonthStarts: number[] = [];
    const calculatedTicks = days.map(day => {
      if (day.getDate() === 1) {
        calculatedMonthStarts.push(day.getTime());
      }
      return day.getTime();
    });

    return {
      chartData: chartTasks,
      domain: [domainStart.getTime(), domainEnd.getTime()],
      ticks: calculatedTicks,
      monthStarts: calculatedMonthStarts,
    };
  }, [tasks]);

  const handleTaskChange = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const addTask = () => {
    const lastTask = tasks[tasks.length - 1];
    const newStart = lastTask ? addDays(parseISO(lastTask.end), 1) : new Date();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: 'New Task',
      start: newStart.toISOString(),
      end: addDays(newStart, 4).toISOString(),
      progress: 0,
    };
    setTasks([...tasks, newTask]);
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileType = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('File could not be read.');
        let newTasks: Task[];
        if (fileType === 'json') {
          newTasks = JSON.parse(data as string);
        } else {
            const workbook = fileType === 'xlsx' ? XLSX.read(data, {type: 'array'}) : XLSX.read(data, {type: 'string'});
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            newTasks = XLSX.utils.sheet_to_json<Task>(sheet);
        }
        
        if (!Array.isArray(newTasks)) throw new Error('Invalid file structure.');
        setTasks(newTasks);
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
  
  const exportJSON = () => downloadFile('gantt-chart.json', JSON.stringify(tasks, null, 2), 'application/json');
  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    downloadFile('gantt-chart.csv', csv, 'text/csv');
  };
  const exportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, 'gantt-chart.xlsx');
  };
  
  const exportPNG = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: null });
      const link = document.createElement('a');
      link.download = 'gantt-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Export Failed', description: 'Could not export chart as PNG.' });
    }
  };
  const exportPDF = () => window.print();

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
            body * { visibility: hidden; }
            .printable-chart, .printable-chart * { visibility: visible; }
            .printable-chart { position: absolute; left: 0; top: 0; width: 100%; padding: 1rem; }
            .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="flex justify-end gap-2 no-print">
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

      <Card>
        <CardContent className="p-4 printable-chart" ref={chartRef}>
          <ResponsiveContainer width="100%" height={tasks.length * 50 + 60}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              barCategoryGap="35%"
            >
              <XAxis
                type="number"
                domain={domain}
                ticks={ticks}
                tickFormatter={(tick) => format(new Date(tick), 'd')}
                scale="time"
                interval="preserveStartEnd"
                stroke="hsl(var(--muted-foreground))"
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tickLine={false}
                axisLine={false}
                stroke="hsl(var(--foreground))"
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--muted) / 0.3)'}} />
              
              {monthStarts.map(monthStart => (
                  <ReferenceLine 
                      key={monthStart}
                      x={monthStart}
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 3"
                      label={{ value: format(new Date(monthStart), 'MMM yyyy'), position: 'top', fill: 'hsl(var(--muted-foreground))', fontSize: 12, dy: -10 }}
                  />
              ))}
               <ReferenceLine x={startOfDay(new Date()).getTime()} stroke="hsl(var(--primary))" strokeWidth={2} label={{ value: 'Today', position: 'top', fill: 'hsl(var(--primary))' }} />

              <Bar dataKey="range" stackId="a" fill="transparent" isAnimationActive={false}>
                  <LabelList dataKey="name" position="left" offset={10} className="fill-foreground" />
              </Bar>
              <Bar dataKey={(data) => {
                  const duration = data.range[1] - data.range[0];
                  return duration * (data.progress / 100);
                }} stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} isAnimationActive={false} />
                <Bar dataKey={(data) => {
                    const duration = data.range[1] - data.range[0];
                    return duration * (1 - (data.progress / 100));
                }} stackId="a" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 4, 4]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="no-print">
        <CardHeader><CardTitle>Task List</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Task Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Progress (%)</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Input
                      value={task.name}
                      onChange={(e) => handleTaskChange(task.id, 'name', e.target.value)}
                      className="border-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(parseISO(task.start), 'MMM d, yyyy')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={parseISO(task.start)} onSelect={(date) => handleTaskChange(task.id, 'start', date?.toISOString())} />
                        </PopoverContent>
                    </Popover>
                  </TableCell>
                   <TableCell>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(parseISO(task.end), 'MMM d, yyyy')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={parseISO(task.end)} onSelect={(date) => handleTaskChange(task.id, 'end', date?.toISOString())} />
                        </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={task.progress}
                      onChange={(e) => handleTaskChange(task.id, 'progress', parseInt(e.target.value, 10))}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </TableCell>
                   <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addTask} className="mt-4"><PlusCircle className="mr-2 h-4 w-4"/>Add Task</Button>
        </CardContent>
      </Card>
    </div>
  );
}
