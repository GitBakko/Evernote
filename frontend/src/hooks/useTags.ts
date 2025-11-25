import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function useTags() {
  return useLiveQuery(() => db.tags.orderBy('name').toArray());
}
