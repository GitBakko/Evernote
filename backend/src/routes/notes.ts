import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as noteService from '../services/note.service';

const createNoteSchema = z.object({
  title: z.string().min(1),
  notebookId: z.string().uuid(),
  content: z.string().optional(),
});

const updateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  notebookId: z.string().uuid().optional(),
  isTrashed: z.boolean().optional(),
});

export default async function noteRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/', async (request, reply) => {
    const { title, notebookId, content } = createNoteSchema.parse(request.body);
    const note = await noteService.createNote(request.user.id, notebookId, title, content);
    return note;
  });

  fastify.get('/', async (request, reply) => {
    const { notebookId, search, tagId } = request.query as { notebookId?: string; search?: string; tagId?: string };
    const notes = await noteService.getNotes(request.user.id, notebookId, search, tagId);
    return notes;
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const note = await noteService.getNote(request.user.id, id);
    if (!note) return reply.status(404).send({ message: 'Note not found' });
    return note;
  });

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateNoteSchema.parse(request.body);
    await noteService.updateNote(request.user.id, id, data);
    return { message: 'Note updated' };
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await noteService.deleteNote(request.user.id, id);
    return { message: 'Note deleted' };
  });
}
