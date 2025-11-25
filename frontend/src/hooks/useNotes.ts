import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function useNotes(notebookId?: string, search?: string, tagId?: string) {
  return useLiveQuery(async () => {
    let collection = db.notes.orderBy('updatedAt').reverse();

    if (notebookId) {
      collection = collection.filter(note => note.notebookId === notebookId);
    }

    if (tagId) {
        // This is tricky with Dexie for array of objects.
        // We might need a better schema or just filter in JS for now (small dataset).
        collection = collection.filter(note => note.tags.some(t => t.tag.id === tagId));
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      collection = collection.filter(note => 
        note.title.toLowerCase().includes(lowerSearch) || 
        note.content.toLowerCase().includes(lowerSearch)
      );
    }

    return collection.filter(n => !n.isTrashed).toArray().then(notes => notes.map(n => ({
        ...n,
        tags: n.tags.map(t => ({
            tag: {
                ...t.tag,
                userId: n.userId, // Mock or retrieve
                syncStatus: 'synced' as const // Mock
            }
        }))
    })));
  }, [notebookId, search, tagId]);
}
