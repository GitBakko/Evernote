import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function useNotebooks() {
  return useLiveQuery(() => db.notebooks.orderBy('name').toArray());
}
