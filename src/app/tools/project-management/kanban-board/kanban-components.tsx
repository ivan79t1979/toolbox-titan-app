'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { Id, Task, Column, Priority } from './kanban-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, PlusCircle, Trash2, CalendarIcon, Flag } from 'lucide-react';
import React, { useState } from 'react';
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

interface ColumnProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  addTask: () => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, updatedProperties: Partial<Task>) => void;
  tasks: Task[];
}

export function KanbanColumn({
  column,
  deleteColumn,
  updateColumnTitle,
  addTask,
  tasks,
  deleteTask,
  updateTask,
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
      className="w-[350px] h-fit max-h-full bg-card rounded-lg flex flex-col border"
    >
      {/* Column title */}
      <CardHeader
        {...attributes}
        {...listeners}
        className="p-3 font-semibold border-b flex flex-row items-center justify-between cursor-grab"
      >
        <div className="flex items-center gap-2">
            <GripVertical className="text-muted-foreground" />
            {!editMode && <div onClick={() => setEditMode(true)} className="flex-1">{column.title}</div>}
            {editMode && (
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
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
            <KanbanTaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
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
}

const priorityConfig: Record<Priority, { label: string; color: string; iconColor: string }> = {
    low: { label: 'Low', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400', iconColor: 'text-blue-500' },
    medium: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400', iconColor: 'text-yellow-500' },
    high: { label: 'High', color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400', iconColor: 'text-orange-500' },
    urgent: { label: 'Urgent', color: 'bg-red-500/20 text-red-700 dark:text-red-400', iconColor: 'text-red-500' },
}

export function KanbanTaskCard({
  task,
  deleteTask,
  updateTask,
}: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
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
        {...attributes}
        {...listeners}
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
      </div>

      {mouseIsOver && deleteTask && (
        <Button
          variant={'ghost'}
          size="icon"
          className="absolute right-1 top-1 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}
