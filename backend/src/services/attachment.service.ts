import prisma from '../plugins/prisma';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import { MultipartFile } from '@fastify/multipart';

const pump = util.promisify(pipeline);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

export const saveAttachment = async (file: MultipartFile, noteId: string) => {
  const originalFilename = file.filename;
  const extension = path.extname(originalFilename);
  const filename = `${uuidv4()}${extension}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await pump(file.file, fs.createWriteStream(filepath));

  const attachment = await prisma.attachment.create({
    data: {
      noteId,
      url: `/uploads/${filename}`, // We'll serve this statically or via route
      filename: originalFilename,
      mimeType: file.mimetype,
      size: 0, // TODO: Get file size
    },
  });

  return attachment;
};

export const getAttachments = async (noteId: string) => {
  return prisma.attachment.findMany({
    where: { noteId },
  });
};

export const deleteAttachment = async (id: string) => {
  const attachment = await prisma.attachment.findUnique({ where: { id } });
  if (!attachment) return;

  // Delete from disk
  const filename = path.basename(attachment.url);
  const filepath = path.join(UPLOAD_DIR, filename);
  
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }

  return prisma.attachment.delete({ where: { id } });
};
