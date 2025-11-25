import prisma from '../plugins/prisma';

export const createNote = async (userId: string, notebookId: string, title: string, content: string = '') => {
  return prisma.note.create({
    data: {
      title,
      content,
      userId,
      notebookId,
    },
  });
};

export const getNotes = async (userId: string, notebookId?: string, search?: string, tagId?: string) => {
  return prisma.note.findMany({
    where: {
      userId,
      ...(notebookId ? { notebookId } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search } }, // SQLite default is case-insensitive usually, but Prisma might not be.
          { content: { contains: search } },
        ]
      } : {}),
      isTrashed: false,
    },
    orderBy: { updatedAt: 'desc' },
    include: { 
      tags: { include: { tag: true } },
      attachments: {
        where: { isLatest: true }
      }
    }
  });
};

export const getNote = async (userId: string, id: string) => {
  return prisma.note.findFirst({
    where: { id, userId },
    include: { 
      tags: { include: { tag: true } },
      attachments: {
        where: { isLatest: true }
      }
    }
  });
};

export const updateNote = async (userId: string, id: string, data: { title?: string; content?: string; notebookId?: string; isTrashed?: boolean }) => {
  return prisma.note.updateMany({
    where: { id, userId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const deleteNote = async (userId: string, id: string) => {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
};
