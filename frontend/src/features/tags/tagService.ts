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
  // Check for duplicate name
  const existing = await db.tags.where('name').equals(name).first();
  if (existing) {
    throw new Error('A tag with this name already exists.');
  }

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
      // Check if tag is already associated
      if (note.tags?.some(t => t.tag.id === tagId)) {
          return; // Already associated
      }

      const updatedTags = [...(note.tags || []), { tag: { id: tag.id, name: tag.name } }];
      await db.notes.update(noteId, { tags: updatedTags, syncStatus: 'updated' });
      
      await db.syncQueue.add({
          type: 'UPDATE',
          entity: 'NOTE',
          entityId: noteId,
          data: { tags: updatedTags }, 
          createdAt: Date.now()
      });
  }
};

export const removeTagFromNote = async (noteId: string, tagId: string) => {
  const note = await db.notes.get(noteId);
  if (note) {
      const updatedTags = note.tags.filter(t => t.tag.id !== tagId);
      await db.notes.update(noteId, { tags: updatedTags, syncStatus: 'updated' });
      // Queue update
      await db.syncQueue.add({
          type: 'UPDATE',
          entity: 'NOTE',
          entityId: noteId,
          data: { tags: updatedTags }, 
          createdAt: Date.now()
      });
  }
};
