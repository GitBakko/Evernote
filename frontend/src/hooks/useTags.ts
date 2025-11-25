import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { createTag, deleteTag } from '../features/tags/tagService';

export function useTags() {
  const tags = useLiveQuery(() => db.tags.orderBy('name').toArray());
  
  return {
    tags,
    createTag,
    deleteTag
  };
}
