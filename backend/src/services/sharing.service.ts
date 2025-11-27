import prisma from '../plugins/prisma';
import { Permission } from '@prisma/client';

export const shareNote = async (ownerId: string, noteId: string, targetEmail: string, permission: Permission) => {
  // Verify ownership
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note || note.userId !== ownerId) {
    throw new Error('Note not found or access denied');
  }

  // Find target user
  const targetUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.id === ownerId) {
    throw new Error('Cannot share with yourself');
  }

  // Create or update share
  return prisma.sharedNote.upsert({
    where: {
      noteId_userId: {
        noteId,
        userId: targetUser.id,
      },
    },
    update: {
      permission,
    },
    create: {
      noteId,
      userId: targetUser.id,
      permission,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const revokeNoteShare = async (ownerId: string, noteId: string, targetUserId: string) => {
  // Verify ownership
  const note = await prisma.note.findUnique({
    where: { id: noteId },
  });

  if (!note || note.userId !== ownerId) {
    throw new Error('Note not found or access denied');
  }

  return prisma.sharedNote.delete({
    where: {
      noteId_userId: {
        noteId,
        userId: targetUserId,
      },
    },
  });
};

export const getSharedNotes = async (userId: string) => {
  return prisma.sharedNote.findMany({
    where: {
      userId,
    },
    include: {
      note: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const shareNotebook = async (ownerId: string, notebookId: string, targetEmail: string, permission: Permission) => {
  // Verify ownership
  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId },
  });

  if (!notebook || notebook.userId !== ownerId) {
    throw new Error('Notebook not found or access denied');
  }

  // Find target user
  const targetUser = await prisma.user.findUnique({
    where: { email: targetEmail },
  });

  if (!targetUser) {
    throw new Error('User not found');
  }

  if (targetUser.id === ownerId) {
    throw new Error('Cannot share with yourself');
  }

  // Create or update share
  return prisma.sharedNotebook.upsert({
    where: {
      notebookId_userId: {
        notebookId,
        userId: targetUser.id,
      },
    },
    update: {
      permission,
    },
    create: {
      notebookId,
      userId: targetUser.id,
      permission,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const revokeNotebookShare = async (ownerId: string, notebookId: string, targetUserId: string) => {
  // Verify ownership
  const notebook = await prisma.notebook.findUnique({
    where: { id: notebookId },
  });

  if (!notebook || notebook.userId !== ownerId) {
    throw new Error('Notebook not found or access denied');
  }

  return prisma.sharedNotebook.delete({
    where: {
      notebookId_userId: {
        notebookId,
        userId: targetUserId,
      },
    },
  });
};

export const getSharedNotebooks = async (userId: string) => {
  return prisma.sharedNotebook.findMany({
    where: {
      userId,
    },
    include: {
      notebook: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};
