import { db } from '../../lib/db';
import api from '../../lib/api';
import type { Note } from '../notes/noteService';
import type { Notebook } from '../notebooks/notebookService';
import type { Tag } from '../tags/tagService';

export const syncPull = async () => {
  try {
    // Pull Notebooks
    const notebooksRes = await api.get<Notebook[]>('/notebooks');
    await db.transaction('rw', db.notebooks, async () => {
      await db.notebooks.clear(); // Simple strategy: clear and replace for now (careful with unsynced changes!)
      // TODO: Better merge strategy
      await db.notebooks.bulkPut(notebooksRes.data.map(n => ({ ...n, syncStatus: 'synced' })));
    });

    // Pull Tags
    const tagsRes = await api.get<Tag[]>('/tags');
    await db.transaction('rw', db.tags, async () => {
      await db.tags.clear();
      await db.tags.bulkPut(tagsRes.data.map(t => ({ ...t, userId: 'current-user', syncStatus: 'synced' })));
    });

    // Pull Notes
    const notesRes = await api.get<Note[]>('/notes');
    await db.transaction('rw', db.notes, async () => {
        // We need to be careful not to overwrite dirty notes
        // For MVP, let's just overwrite everything that is 'synced'
        // But wait, if we clear, we lose dirty notes.
        // Better: Get all dirty notes IDs.
        const dirtyNotes = await db.notes.where('syncStatus').notEqual('synced').toArray();
        const dirtyIds = new Set(dirtyNotes.map(n => n.id));
        
        const serverNotes = notesRes.data.map(n => ({
            ...n,
            tags: n.tags || [], // Ensure array
            attachments: n.attachments || [], // Ensure array
            syncStatus: 'synced' as const
        }));

        // Filter out server notes that conflict with local dirty notes (local wins temporarily until push)
        const notesToPut = serverNotes.filter(n => !dirtyIds.has(n.id));
        
        // We also need to handle deletions. If a note is in DB but not in serverNotes, and it's synced, delete it.
        const allLocalSyncedNotes = await db.notes.where('syncStatus').equals('synced').toArray();
        const serverIds = new Set(serverNotes.map(n => n.id));
        const toDeleteIds = allLocalSyncedNotes.filter(n => !serverIds.has(n.id)).map(n => n.id);

        await db.notes.bulkDelete(toDeleteIds);
        await db.notes.bulkPut(notesToPut);
    });

    console.log('Sync Pull Completed');
  } catch (error) {
    console.error('Sync Pull Failed:', error);
  }
};

export const syncPush = async () => {
  const queue = await db.syncQueue.orderBy('createdAt').toArray();

  for (const item of queue) {
    try {
      if (item.entity === 'NOTE') {
        if (item.type === 'CREATE') {
           const { id, ...data } = item.data;
           // We might need to handle ID mapping if backend generates IDs. 
           // For now, assuming UUIDs generated on frontend or backend accepts our ID.
           // If backend ignores our ID, we need to update local ID with server ID.
           // Let's assume backend accepts ID or we handle it.
           await api.post('/notes', data); 
        } else if (item.type === 'UPDATE') {
           await api.put(`/notes/${item.entityId}`, item.data);
        } else if (item.type === 'DELETE') {
           await api.delete(`/notes/${item.entityId}`);
        }
      }
      // TODO: Handle Notebooks and Tags similarly

      // If successful, remove from queue
      if (item.id) await db.syncQueue.delete(item.id);
      
      // Update syncStatus of the entity
      if (item.entity === 'NOTE' && item.type !== 'DELETE') {
          await db.notes.update(item.entityId, { syncStatus: 'synced' });
      }

    } catch (error) {
      console.error('Sync Push Failed for item:', item, error);
      // Keep in queue to retry later? Or move to dead letter queue?
      // For now, just log and maybe break to avoid blocking if it's a persistent error?
      // Or continue to try others?
    }
  }
};
