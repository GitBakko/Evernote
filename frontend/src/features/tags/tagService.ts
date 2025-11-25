import { db } from '../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export interface Tag {
  id: string;
  name: string;
  userId: string;
  syncStatus: 'synced' | 'created' | 'updated';
  _count?: {
    notes: number;
  };
}

export const getTags = async () => {
  return db.tags.orderBy('name').toArray();
};

export const createTag = async (name: string) => {
  const id = uuidv4();
  const newTag = {
    id,
    name,
    userId: 'current-user',
    syncStatus: 'created' as const
  };
  
  await db.tags.add(newTag);
  await db.syncQueue.add({
      type: 'CREATE',
      entity: 'TAG',
      entityId: id,
      data: { name, id },
      createdAt: Date.now()
  });

  return newTag;
};

export const deleteTag = async (id: string) => {
  await db.tags.delete(id);
  await db.syncQueue.add({
      type: 'DELETE',
      entity: 'TAG',
      entityId: id,
      createdAt: Date.now()
  });
};

export const addTagToNote = async (noteId: string, tagId: string) => {
  // For local DB, we update the note's tags array
  const note = await db.notes.get(noteId);
  const tag = await db.tags.get(tagId);
  
  if (note && tag) {
      const updatedTags = [...(note.tags || []), { tag: { id: tag.id, name: tag.name } }];
      await db.notes.update(noteId, { tags: updatedTags, syncStatus: 'updated' });
      // We also need to queue this. 
      // Ideally syncQueue should handle relation updates. 
      // For MVP, maybe we treat it as Note update?
      // Yes, since tags are embedded in Note for now in local DB.
      await db.syncQueue.add({
          type: 'UPDATE',
          entity: 'NOTE',
          entityId: noteId,
          data: { tags: updatedTags }, // This might be tricky for backend if it expects separate endpoint
          createdAt: Date.now()
      });
      // Wait, backend expects /api/tags/note endpoint calls.
      // So we might need a specific sync action for this.
      // Let's ignore complex relation sync for a moment or handle it in syncPush with custom logic.
      // Or better: just call the API directly if online? No, offline first.
      // Let's assume we send the whole note update to PUT /notes/:id and backend handles tags?
      // My backend updateNote implementation might not handle tags.
      // Let's check backend updateNote.
  }
};

export const removeTagFromNote = async (noteId: string, tagId: string) => {
  const note = await db.notes.get(noteId);
  if (note) {
      const updatedTags = note.tags.filter(t => t.tag.id !== tagId);
      await db.notes.update(noteId, { tags: updatedTags, syncStatus: 'updated' });
      // Queue update
  }
};
