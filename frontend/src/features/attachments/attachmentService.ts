import api from '../../lib/api';
import { db } from '../../lib/db';

export const uploadAttachment = async (noteId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // For MVP, we upload directly to backend even if offline-first?
  // Or we store in IndexedDB as Blob?
  // Storing large blobs in IndexedDB can be heavy.
  // Let's try to upload immediately if online.
  // If offline, we could queue it, but handling file uploads in sync queue is complex.
  // Let's assume online-only for attachments for now, or simple retry.
  
  try {
      const res = await api.post(`/attachments?noteId=${noteId}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      
      // Update local note with new attachment
      const attachment = res.data;
      const note = await db.notes.get(noteId);
      if (note) {
          const updatedAttachments = [...(note.attachments || []), attachment];
          await db.notes.update(noteId, { attachments: updatedAttachments, syncStatus: 'updated' });
      }
      
      return attachment;
  } catch (error) {
      console.error('Upload failed', error);
      throw error;
  }
};

export const deleteAttachment = async (noteId: string, attachmentId: string) => {
    await api.delete(`/attachments/${attachmentId}`);
    
    const note = await db.notes.get(noteId);
    if (note) {
        const updatedAttachments = (note.attachments || []).filter(a => a.id !== attachmentId);
        await db.notes.update(noteId, { attachments: updatedAttachments, syncStatus: 'updated' });
    }
};
