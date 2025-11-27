import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function usePinnedNotes() {
  return useLiveQuery(async () => {
    return await db.notes
      .filter(note => !!note.isPinned && !note.isTrashed)
      .reverse()
      .sortBy('updatedAt');
  });
}
