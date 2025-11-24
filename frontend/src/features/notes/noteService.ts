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
  tags: { tag: Tag }[];
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

export const createNote = async (title: string, notebookId: string, content?: string) => {
  const res = await api.post<Note>('/notes', { title, notebookId, content });
  return res.data;
};

export const updateNote = async (id: string, data: Partial<Note>) => {
  const res = await api.put(`/notes/${id}`, data);
  return res.data;
};

export const deleteNote = async (id: string) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};
