export type Id = string | number;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type AttachmentType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'FILE' | 'LOCATION';

export type Attachment = {
  id: string;
  type: AttachmentType;
  name: string;
  url: string; // data URI for files, or a google maps link for location
};


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
  attachments?: Attachment[];
};
