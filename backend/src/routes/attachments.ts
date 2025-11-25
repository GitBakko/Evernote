import { FastifyInstance } from 'fastify';
import { saveAttachment, getAttachments, deleteAttachment } from '../services/attachment.service';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

export async function attachmentRoutes(app: FastifyInstance) {
  app.post('/api/attachments', { preValidation: [app.authenticate] }, async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: 'No file uploaded' });
    }

    // We expect noteId as a field, but multipart handling is tricky.
    // fastify-multipart handles fields and files.
    // Let's assume noteId is passed as a query param for simplicity or we parse fields.
    // But request.file() returns the first file.
    // If we use request.parts(), we can iterate.
    // For MVP, let's use query param for noteId.
    
    // Actually, let's try to get the noteId from the fields if possible, 
    // but request.file() consumes the stream.
    // Let's use query param: POST /api/attachments?noteId=...
    
    const { noteId } = request.query as { noteId: string };
    if (!noteId) {
        return reply.status(400).send({ message: 'noteId is required' });
    }

    const attachment = await saveAttachment(data, noteId);
    return attachment;
  });

  app.get('/api/attachments/:noteId', { preValidation: [app.authenticate] }, async (request, reply) => {
    const { noteId } = request.params as { noteId: string };
    const attachments = await getAttachments(noteId);
    return attachments;
  });

  app.delete('/api/attachments/:id', { preValidation: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await deleteAttachment(id);
    return { message: 'Attachment deleted' };
  });
  
  // Serve static files
  // Ideally this should be handled by a static file plugin or Nginx.
  // For MVP, let's create a route to stream the file.
  app.get('/uploads/:filename', async (request, reply) => {
      const { filename } = request.params as { filename: string };
      const filepath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filepath)) {
          const stream = fs.createReadStream(filepath);
          return reply.send(stream);
      } else {
          return reply.status(404).send({ message: 'File not found' });
      }
  });
}
