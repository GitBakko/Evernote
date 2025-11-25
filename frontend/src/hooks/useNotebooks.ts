import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { createNotebook, updateNotebook, deleteNotebook } from '../features/notebooks/notebookService';

export function useNotebooks() {
  const notebooks = useLiveQuery(() => db.notebooks.orderBy('name').toArray());

  return {
    notebooks,
    createNotebook,
    updateNotebook,
    deleteNotebook
  };
}
