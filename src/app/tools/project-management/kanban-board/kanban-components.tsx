'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { Id, Task, Column, Priority, Attachment, AttachmentType } from './kanban-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GripVertical,
  PlusCircle,
  Trash2,
  CalendarIcon,
  Flag,
  Move,
  Edit,
  Paperclip,
  Image as ImageIcon,
  AudioWaveform,
  Video,
  File as FileIcon,
  MapPin,
  Download,
  Upload,
  Camera,
  Mic,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';

interface ColumnProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  addTask: () => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, updatedProperties: Partial<Task>) => void;
  tasks: Task[];
  isMobile?: boolean;
  allColumns?: Column[];
}

export function KanbanColumn({
  column,
  deleteColumn,
  updateColumnTitle,
  addTask,
  tasks,
  deleteTask,
  updateTask,
  isMobile,
  allColumns = [],
}: ColumnProps) {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    attributes: {
      'aria-roledescription': 'sortable column',
    },
    disabled: isMobile,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[350px] h-[500px] opacity-40 border-2 border-primary bg-background rounded-lg flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full md:w-[350px] shrink-0 h-fit max-h-full bg-card rounded-lg flex flex-col border"
    >
      {/* Column title */}
      <CardHeader
        {...attributes}
        {...listeners}
        className="p-3 font-semibold border-b flex flex-row items-center justify-between cursor-grab group"
      >
        <div className="flex items-center gap-2">
            {!isMobile && <GripVertical className="text-muted-foreground" />}
            {!editMode ? (
              <div onClick={() => setEditMode(true)} className="flex items-center gap-2 flex-1">
                {column.title}
                <Edit className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <Input
                  value={column.title}
                  onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                  autoFocus
                  onBlur={() => setEditMode(false)}
                  onKeyDown={(e) => {
                  if (e.key === 'Enter') setEditMode(false);
                  }}
              />
            )}
        </div>
        <Button
          onClick={() => deleteColumn(column.id)}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Column task container */}
      <CardContent className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy} disabled={isMobile}>
            {tasks.map((task) => (
            <KanbanTaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
                isMobile={isMobile}
                allColumns={allColumns}
            />
            ))}
        </SortableContext>
      </CardContent>
      {/* Column footer */}
      <div className="p-2 border-t">
        <Button
          onClick={addTask}
          variant="ghost"
          className="flex gap-2 items-center w-full"
        >
          <PlusCircle />
          Add task
        </Button>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  deleteTask?: (id: Id) => void;
  updateTask?: (id: Id, updatedProperties: Partial<Task>) => void;
  isMobile?: boolean;
  allColumns?: Column[];
}

const priorityConfig: Record<Priority, { label: string; color: string; iconColor: string }> = {
    low: { label: 'Low', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400', iconColor: 'text-blue-500' },
    medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', iconColor: 'text-yellow-500' },
    high: { label: 'High', color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400', iconColor: 'text-orange-500' },
    urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-700 dark:text-red-400', iconColor: 'text-red-500' },
}

const attachmentConfig: Record<AttachmentType, { icon: React.FC<any> }> = {
    IMAGE: { icon: ImageIcon },
    AUDIO: { icon: AudioWaveform },
    VIDEO: { icon: Video },
    DOCUMENT: { icon: FileIcon },
    FILE: { icon: FileIcon },
    LOCATION: { icon: MapPin },
};

function AttachmentBadge({ attachment }: { attachment: Attachment }) {
    const Icon = attachmentConfig[attachment.type]?.icon || FileIcon;
    const isLocation = attachment.type === 'LOCATION';
    const isMedia = ['IMAGE', 'AUDIO', 'VIDEO'].includes(attachment.type);

    const handleClick = (e: React.MouseEvent) => {
        if (isLocation || isMedia) {
            e.stopPropagation();
            window.open(attachment.url, '_blank');
        }
    };
    
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = attachment.url;
        link.download = attachment.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Badge variant="secondary" className="group/attachment items-center gap-1.5 cursor-pointer" onClick={handleClick}>
            <Icon className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{attachment.name}</span>
            {!isLocation && (
              <button onClick={handleDownload} className="ml-1 opacity-0 group-hover/attachment:opacity-100 transition-opacity">
                <Download className="h-3 w-3" />
              </button>
            )}
        </Badge>
    )
}

export function KanbanTaskCard({
  task,
  deleteTask,
  updateTask,
  isMobile,
  allColumns = [],
}: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefAudio = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  const fileInputRefDoc = useRef<HTMLInputElement>(null);
  const fileInputRefFile = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (editMode) {
      const getPermissions = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing media devices:', error);
          setHasCameraPermission(false);
        }
      };
      getPermissions();
    }
  }, [editMode]);


  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode || isMobile,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  
  const handleAddAttachment = (attachment: Attachment) => {
    if (!updateTask) return;
    const newAttachments = [...(task.attachments || []), attachment];
    updateTask(task.id, { attachments: newAttachments });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: AttachmentType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        handleAddAttachment({ id: `att-${Date.now()}`, type, name: file.name, url });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLocationAdd = () => {
    const location = prompt("Enter a location or address:");
    if (location) {
        handleAddAttachment({
            id: `att-${Date.now()}`,
            type: 'LOCATION',
            name: location,
            url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
        });
    }
  };


  const cardStyles = cva("group/item relative flex flex-col cursor-grab p-2.5 text-left gap-2", {
      variants: {
        dragging: {
          over: "ring-2 opacity-30",
          base: "bg-background",
        },
      },
    }
  );

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(cardStyles({ dragging: "over" }), 'h-[100px]')}
      />
    );
  }

  if (editMode && updateTask) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(cardStyles({ dragging: "base" }), 'cursor-default')}
      >
        <Textarea
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onChange={(e) => updateTask(task.id, { content: e.target.value })}
          className="h-[100px] w-full resize-none"
        />
        <div className="flex items-center justify-between gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4"/>
                        {task.dueDate ? format(parseISO(task.dueDate), 'MMM d') : 'No Date'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={task.dueDate ? parseISO(task.dueDate) : undefined}
                        onSelect={(date) => updateTask(task.id, {dueDate: date?.toISOString()})}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Select onValueChange={(p: Priority) => updateTask(task.id, { priority: p })} value={task.priority}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    {(Object.keys(priorityConfig) as Priority[]).map(p => (
                        <SelectItem key={p} value={p}>
                            <div className="flex items-center gap-2">
                                <Flag className={cn("w-4 h-4", priorityConfig[p].iconColor)} />
                                {priorityConfig[p].label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        
        {/* Attachments */}
        <div className="space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm"><Paperclip className="w-4 h-4 mr-2" /> Add Attachment</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                  <DropdownMenuSubTrigger><ImageIcon className="mr-2 h-4 w-4" />Image</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => fileInputRefImage.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                        <input type="file" ref={fileInputRefImage} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'IMAGE')} />
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => toast({title: "Coming soon!"})}><Camera className="mr-2 h-4 w-4" />Capture</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
              </DropdownMenuSub>
               <DropdownMenuSub>
                  <DropdownMenuSubTrigger><AudioWaveform className="mr-2 h-4 w-4" />Audio</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => fileInputRefAudio.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                        <input type="file" ref={fileInputRefAudio} className="hidden" accept="audio/*" onChange={(e) => handleFileChange(e, 'AUDIO')} />
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => toast({title: "Coming soon!"})}><Mic className="mr-2 h-4 w-4" />Record</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
              </DropdownMenuSub>
               <DropdownMenuSub>
                  <DropdownMenuSubTrigger><Video className="mr-2 h-4 w-4" />Video</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => fileInputRefVideo.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload
                        <input type="file" ref={fileInputRefVideo} className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'VIDEO')} />
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => toast({title: "Coming soon!"})}><Camera className="mr-2 h-4 w-4" />Record</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => fileInputRefDoc.current?.click()}>
                <FileIcon className="mr-2 h-4 w-4"/> Document
                <input type="file" ref={fileInputRefDoc} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFileChange(e, 'DOCUMENT')} />
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => fileInputRefFile.current?.click()}>
                <FileIcon className="mr-2 h-4 w-4"/> Other File
                <input type="file" ref={fileInputRefFile} className="hidden" onChange={(e) => handleFileChange(e, 'FILE')} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationAdd()}><MapPin className="mr-2 h-4 w-4"/>Location</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Media Access Required</AlertTitle>
              <AlertDescription>Please allow camera and microphone access to use recording features.</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2">
              {task.attachments?.map(att => <AttachmentBadge key={att.id} attachment={att} />)}
          </div>
        </div>

        <Button onClick={toggleEditMode} size="sm" className="mt-2">Done</Button>
      </div>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
      className={cn(cardStyles({ dragging: "base" }))}
    >
      <p className="my-auto h-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      
      <div className="flex items-center gap-2 flex-wrap">
          {task.priority && (
              <Badge variant="outline" className={cn('gap-1.5', priorityConfig[task.priority].color)}>
                  <Flag className={cn("w-3 h-3", priorityConfig[task.priority].iconColor)}/>
                  {priorityConfig[task.priority].label}
              </Badge>
          )}
          {task.dueDate && (
              <Badge variant="outline" className="gap-1.5">
                  <CalendarIcon className="w-3 h-3"/>
                  {format(parseISO(task.dueDate), 'MMM d')}
              </Badge>
          )}
          {task.attachments?.map(att => <AttachmentBadge key={att.id} attachment={att} />)}
      </div>

      {(mouseIsOver || isMobile) && (
        <div className="absolute right-1 top-1 flex">
          {isMobile && updateTask && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Move className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allColumns.map((col) => (
                  <DropdownMenuItem
                    key={col.id}
                    disabled={col.id === task.columnId}
                    onClick={() => updateTask(task.id, { columnId: col.id })}
                  >
                    Move to {col.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {deleteTask && (
             <Button
              variant={'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
