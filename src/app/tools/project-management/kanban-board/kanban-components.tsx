'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { Id, Task, Column } from './kanban-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ColumnProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  addTask: () => void;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, content: string) => void;
  tasks: Task[];
}

export function KanbanColumn({
  column,
  deleteColumn,
  updateColumnTitle,
  addTask,
  tasks,
  deleteTask,
  updateTaskContent,
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
        className="w-full h-[500px] opacity-40 border-2 border-primary bg-background rounded-lg flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full h-fit bg-card rounded-lg flex flex-col border"
    >
      {/* Column title */}
      <CardHeader
        {...attributes}
        {...listeners}
        className="p-3 font-semibold border-b flex flex-row items-center justify-between cursor-grab"
      >
        <div className="flex items-center gap-2">
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
                updateTaskContent={updateTaskContent}
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
  updateTaskContent?: (id: Id, content: string) => void;
}

export function KanbanTaskCard({
  task,
  deleteTask,
  updateTaskContent,
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
  
  const cardStyles = cva("group/item relative flex cursor-grab items-center p-2.5 text-left", {
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
        className={cardStyles({ dragging: "over" })}
      />
    );
  }

  if (editMode && updateTaskContent) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cardStyles({ dragging: "base" })}
      >
        <Textarea
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
           onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) toggleEditMode();
          }}
          className="h-[100px] w-full resize-none"
        />
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
      className={cardStyles({ dragging: "base" })}
    >
      <p className="my-auto h-auto w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {mouseIsOver && deleteTask && (
        <Button
          variant={'ghost'}
          size="icon"
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
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
