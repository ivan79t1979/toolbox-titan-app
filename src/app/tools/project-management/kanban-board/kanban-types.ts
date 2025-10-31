export type Id = string | number;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
  priority?: Priority;
  dueDate?: string; // ISO 8601 string
};
