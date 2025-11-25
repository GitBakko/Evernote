import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import prisma from '../plugins/prisma';
import '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        notebooks: {
          create: {
            name: 'First Notebook',
          }
        }
      },
    });

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, email: true, name: true }
    });
    return user;
  });
}
