import { db } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';
import type { LocalNotebook } from '../../lib/db';

export type Notebook = LocalNotebook;

export const getNotebooks = async () => {
  return db.notebooks.orderBy('name').toArray();
};

export const createNotebook = async (name: string) => {
  const id = uuidv4();
  const newNotebook: LocalNotebook = {
    id,
    name,
    userId: 'current-user', // Placeholder
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'created'
  };

  await db.notebooks.add(newNotebook);
  await db.syncQueue.add({
    type: 'CREATE',
    entity: 'NOTEBOOK',
    entityId: id,
    data: { id, name },
    createdAt: Date.now()
  });

  return newNotebook;
};

export const updateNotebook = async (id: string, name: string) => {
  await db.notebooks.update(id, { name, updatedAt: new Date().toISOString(), syncStatus: 'updated' });
  await db.syncQueue.add({
    type: 'UPDATE',
    entity: 'NOTEBOOK',
    entityId: id,
    data: { name },
    createdAt: Date.now()
  });
};

export const deleteNotebook = async (id: string) => {
  await db.notebooks.delete(id);
  await db.syncQueue.add({
    type: 'DELETE',
    entity: 'NOTEBOOK',
    entityId: id,
    createdAt: Date.now()
  });
};
