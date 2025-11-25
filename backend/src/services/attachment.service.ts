import prisma from '../plugins/prisma';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import util from 'util';
import { v4 as uuidv4 } from 'uuid';
import { MultipartFile } from '@fastify/multipart';
import crypto from 'crypto';

const pump = util.promisify(pipeline);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const saveAttachment = async (file: MultipartFile, noteId: string) => {
  const originalFilename = file.filename;
  const extension = path.extname(originalFilename);
  const storageFilename = `${uuidv4()}${extension}`;
  const filepath = path.join(UPLOAD_DIR, storageFilename);

  // Create hash and write stream
  const hash = crypto.createHash('sha256');
  const writeStream = fs.createWriteStream(filepath);
  let size = 0;

  // Pass through stream to calculate hash and size while writing
  await new Promise((resolve, reject) => {
    file.file.on('data', (chunk) => {
      hash.update(chunk);
      size += chunk.length;
    });
    
    file.file.pipe(writeStream)
      .on('finish', () => resolve(true))
      .on('error', reject);
  });

  const fileHash = hash.digest('hex');

  // Check for existing latest version
  const existingLatest = await prisma.attachment.findFirst({
    where: {
      noteId,
      filename: originalFilename,
      isLatest: true,
    },
  });

  if (existingLatest) {
    // Idempotency check: if content is identical, return existing
    if (existingLatest.hash === fileHash) {
      // Delete the duplicate file we just wrote
      fs.unlinkSync(filepath);
      return existingLatest;
    }

    // Mark old version as not latest
    await prisma.attachment.update({
      where: { id: existingLatest.id },
      data: { isLatest: false },
    });

    // Create new version
    return prisma.attachment.create({
      data: {
        noteId,
        url: `/uploads/${storageFilename}`,
        filename: originalFilename,
        mimeType: file.mimetype,
        size,
        version: existingLatest.version + 1,
        hash: fileHash,
        isLatest: true,
      },
    });
  }

  // Create first version
  return prisma.attachment.create({
    data: {
      noteId,
      url: `/uploads/${storageFilename}`,
      filename: originalFilename,
      mimeType: file.mimetype,
      size,
      version: 1,
      hash: fileHash,
      isLatest: true,
    },
  });
};

export const getAttachments = async (noteId: string) => {
  return prisma.attachment.findMany({
    where: { 
      noteId,
      isLatest: true // Only return latest versions by default
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getAttachmentHistory = async (noteId: string, filename: string) => {
  return prisma.attachment.findMany({
    where: {
      noteId,
      filename
    },
    orderBy: { version: 'desc' }
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

  // If we delete the latest, should we promote the previous one?
  // For now, simple delete. Ideally, we might want to "restore" previous version or delete all versions.
  // Let's assume deleting a specific attachment ID just deletes that version.
  // If the user wants to delete the "file", they might expect all versions to go.
  // But the UI usually shows the list of files.
  
  return prisma.attachment.delete({ where: { id } });
};
