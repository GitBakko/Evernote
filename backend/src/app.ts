import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import authRoutes from './routes/auth';
import notebookRoutes from './routes/notebooks';
import noteRoutes from './routes/notes';
import tagRoutes from './routes/tags';
import './types';

const server = fastify({
  logger: true
});

// Plugins
server.register(cors, { 
  origin: true // Allow all for dev
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret'
});

server.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(notebookRoutes, { prefix: '/api/notebooks' });
server.register(noteRoutes, { prefix: '/api/notes' });
server.register(tagRoutes, { prefix: '/api/tags' });

// Health Check
server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
