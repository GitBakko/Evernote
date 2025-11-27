import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { createNotebook, updateNotebook, deleteNotebook } from '../features/notebooks/notebookService';

export function useNotebooks() {
  const notebooks = useLiveQuery(async () => {
    const allNotebooks = await db.notebooks.orderBy('name').toArray();
    const notebooksWithCounts = await Promise.all(allNotebooks.map(async (n) => {
      const count = await db.notes
        .where('notebookId').equals(n.id)
        .filter(note => !note.isTrashed)
        .count();
      return { ...n, count };
    }));
    return notebooksWithCounts;
  });

  return {
    notebooks,
    createNotebook,
    updateNotebook,
    deleteNotebook
  };
}
