import prisma from '../plugins/prisma';

export const createNotebook = async (userId: string, name: string) => {
  return prisma.notebook.create({
    data: {
      name,
      userId,
    },
  });
};

export const getNotebooks = async (userId: string) => {
  return prisma.notebook.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { notes: true } } }
  });
};

export const getNotebook = async (userId: string, id: string) => {
  return prisma.notebook.findFirst({
    where: { id, userId },
  });
};

export const updateNotebook = async (userId: string, id: string, name: string) => {
  return prisma.notebook.updateMany({
    where: { id, userId },
    data: { name },
  });
};

export const deleteNotebook = async (userId: string, id: string) => {
  // Optional: Check if empty or cascade delete. Prisma schema handles cascade if configured, 
  // but here we might want to prevent deleting non-empty notebooks or move notes to trash.
  // For MVP, we'll allow deletion which cascades via Prisma relation if set, or we rely on DB constraint.
  // Default Prisma relation is restrictive unless specified. Let's assume we want to delete notes too or handle it.
  // For now, simple delete.
  return prisma.notebook.deleteMany({
    where: { id, userId },
  });
};
