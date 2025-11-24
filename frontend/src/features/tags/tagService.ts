import api from '../../lib/api';

export interface Tag {
  id: string;
  name: string;
  _count?: {
    notes: number;
  };
}

export const getTags = async () => {
  const response = await api.get<Tag[]>('/tags');
  return response.data;
};

export const createTag = async (name: string) => {
  const response = await api.post<Tag>('/tags', { name });
  return response.data;
};

export const deleteTag = async (id: string) => {
  await api.delete(`/tags/${id}`);
};

export const addTagToNote = async (noteId: string, tagId: string) => {
  await api.post('/tags/note', { noteId, tagId });
};

export const removeTagFromNote = async (noteId: string, tagId: string) => {
  await api.delete('/tags/note', { data: { noteId, tagId } });
};
