import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as tagService from '../services/tag.service';

const createTagSchema = z.object({
  name: z.string().min(1),
});

const addTagToNoteSchema = z.object({
  noteId: z.string().uuid(),
  tagId: z.string().uuid(),
});

export default async function tagRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', fastify.authenticate);

  fastify.post('/', async (request, reply) => {
    const { name } = createTagSchema.parse(request.body);
    try {
        const tag = await tagService.createTag(request.user.id, name);
        return tag;
    } catch (e: any) {
        if (e.code === 'P2002') {
            return reply.status(409).send({ message: 'Tag already exists' });
        }
        throw e;
    }
  });

  fastify.get('/', async (request, reply) => {
    const tags = await tagService.getTags(request.user.id);
    return tags;
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await tagService.deleteTag(request.user.id, id);
    return { message: 'Tag deleted' };
  });

  fastify.post('/note', async (request, reply) => {
      const { noteId, tagId } = addTagToNoteSchema.parse(request.body);
      await tagService.addTagToNote(request.user.id, noteId, tagId);
      return { message: 'Tag added to note' };
  });

  fastify.delete('/note', async (request, reply) => {
      const { noteId, tagId } = addTagToNoteSchema.parse(request.body);
      await tagService.removeTagFromNote(request.user.id, noteId, tagId);
      return { message: 'Tag removed from note' };
  });
}
