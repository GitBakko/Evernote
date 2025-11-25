import api from '../../lib/api';
import type { Tag } from '../tags/tagService';


export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  userId: string;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: { tag: Tag }[];
  attachments?: { id: string; url: string; filename: string; mimeType: string; size: number }[];
}

export const getNotes = async (notebookId?: string, search?: string, tagId?: string) => {
  const params = new URLSearchParams();
  if (notebookId) params.append('notebookId', notebookId);
  if (search) params.append('search', search);
  if (tagId) params.append('tagId', tagId);

  const response = await api.get<Note[]>(`/notes?${params.toString()}`);
  return response.data;
};

export const getNote = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

import { db } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export const createNote = async (data: { title: string; notebookId: string; content?: string }) => {
  const id = uuidv4();
  const newNote = {
    id,
    ...data,
    content: data.content || '',
    userId: 'current-user', // We need the user ID here. Ideally passed or retrieved from store.
    isTrashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    attachments: [],
    syncStatus: 'created' as const
  };

  await db.notes.add(newNote);
  await db.syncQueue.add({
      type: 'CREATE',
      entity: 'NOTE',
      entityId: id,
      data: { ...data, id }, // Send ID to backend if supported
      createdAt: Date.now()
  });

  return newNote;
};

export const updateNote = async (id: string, data: Partial<Note>) => {
  await db.notes.update(id, { ...data, updatedAt: new Date().toISOString(), syncStatus: 'updated' });
  await db.syncQueue.add({
      type: 'UPDATE',
      entity: 'NOTE',
      entityId: id,
      data,
      createdAt: Date.now()
  });
  return db.notes.get(id);
};

export const deleteNote = async (id: string) => {
  await db.notes.update(id, { isTrashed: true, syncStatus: 'updated' }); // Soft delete locally
  // Or hard delete? If soft delete, we update.
  // If we want to really delete:
  // await db.notes.delete(id);
  
  await db.syncQueue.add({
      type: 'DELETE',
      entity: 'NOTE',
      entityId: id,
      createdAt: Date.now()
  });
};
