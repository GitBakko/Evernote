import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as sharingService from '../services/sharing.service';
import { Permission } from '@prisma/client';

const shareSchema = z.object({
  email: z.string().email(),
  permission: z.nativeEnum(Permission).optional().default('READ'),
});

import * as noteService from '../services/note.service';

export default async function sharingRoutes(fastify: FastifyInstance) {
  // Public Note Access
  fastify.get('/public/:shareId', async (request, reply) => {
    const { shareId } = request.params as { shareId: string };
    const note = await noteService.getPublicNote(shareId);
    if (!note) return reply.status(404).send({ message: 'Note not found' });
    return note;
  });

  fastify.addHook('onRequest', fastify.authenticate);

  // Share Note
  fastify.post('/notes/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { email, permission } = shareSchema.parse(request.body);

    try {
      const result = await sharingService.shareNote(request.user.id, id, email, permission);
      return result;
    } catch (error: any) {
      if (error.message === 'User not found') {
        return reply.status(404).send({ message: 'User not found' });
      }
      if (error.message === 'Note not found or access denied') {
        return reply.status(403).send({ message: 'Access denied' });
      }
      throw error;
    }
  });

  // Revoke Note Share
  fastify.delete('/notes/:id/:userId', async (request, reply) => {
    const { id, userId } = request.params as { id: string; userId: string };

    try {
      await sharingService.revokeNoteShare(request.user.id, id, userId);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'P2025') { // Record to delete does not exist
        return { success: true };
      }
      throw error;
    }
  });

  // Get Shared Notes
  fastify.get('/notes', async (request, reply) => {
    const notes = await sharingService.getSharedNotes(request.user.id);
    return notes;
  });

  // Share Notebook
  fastify.post('/notebooks/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { email, permission } = shareSchema.parse(request.body);

    try {
      const result = await sharingService.shareNotebook(request.user.id, id, email, permission);
      return result;
    } catch (error: any) {
      if (error.message === 'User not found') {
        return reply.status(404).send({ message: 'User not found' });
      }
      if (error.message === 'Notebook not found or access denied') {
        return reply.status(403).send({ message: 'Access denied' });
      }
      throw error;
    }
  });

  // Revoke Notebook Share
  fastify.delete('/notebooks/:id/:userId', async (request, reply) => {
    const { id, userId } = request.params as { id: string; userId: string };

    try {
      await sharingService.revokeNotebookShare(request.user.id, id, userId);
      return { success: true };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return { success: true };
      }
      throw error;
    }
  });

  // Get Shared Notebooks
  fastify.get('/notebooks', async (request, reply) => {
    const notebooks = await sharingService.getSharedNotebooks(request.user.id);
    return notebooks;
  });
}
