import api from '../../lib/api';

export interface Notebook {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    notes: number;
  };
}

export const getNotebooks = async () => {
  const res = await api.get<Notebook[]>('/notebooks');
  return res.data;
};

export const createNotebook = async (name: string) => {
  const res = await api.post<Notebook>('/notebooks', { name });
  return res.data;
};

export const updateNotebook = async (id: string, name: string) => {
  const res = await api.put(`/notebooks/${id}`, { name });
  return res.data;
};

export const deleteNotebook = async (id: string) => {
  const res = await api.delete(`/notebooks/${id}`);
  return res.data;
};
