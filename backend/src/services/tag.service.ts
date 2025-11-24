import prisma from '../plugins/prisma';

export const createTag = async (userId: string, name: string) => {
  return prisma.tag.create({
    data: {
      name,
      userId,
    },
  });
};

export const getTags = async (userId: string) => {
  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { notes: true } } }
  });
};

export const deleteTag = async (userId: string, id: string) => {
  return prisma.tag.deleteMany({
    where: { id, userId },
  });
};

export const addTagToNote = async (userId: string, noteId: string, tagId: string) => {
  // Verify ownership
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  const tag = await prisma.tag.findFirst({ where: { id: tagId, userId } });
  
  if (!note || !tag) throw new Error('Note or Tag not found');

  return prisma.tagsOnNotes.create({
    data: {
      noteId,
      tagId,
    },
  });
};

export const removeTagFromNote = async (userId: string, noteId: string, tagId: string) => {
   // Verify ownership implicitly via deleteMany
   return prisma.tagsOnNotes.deleteMany({
     where: {
       noteId,
       tagId,
       note: { userId }, // Ensure note belongs to user
     }
   });
};
