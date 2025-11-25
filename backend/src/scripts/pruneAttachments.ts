import prisma from '../plugins/prisma';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const MAX_VERSIONS = 3;

async function pruneAttachments() {
  console.log('Starting attachment pruning...');

  // Get all attachments that are NOT the latest version
  // We only care about history cleaning, so we can ignore isLatest=true for deletion candidates
  // But to count correctly, we need to know how many versions exist.
  
  // Let's get all attachments, ordered by noteId, filename, and version DESC
  const allAttachments = await prisma.attachment.findMany({
    orderBy: [
      { noteId: 'asc' },
      { filename: 'asc' },
      { version: 'desc' }
    ]
  });

  let currentGroupKey = '';
  let versionCount = 0;
  let deletedCount = 0;
  let freedSpace = 0;

  for (const attachment of allAttachments) {
    const key = `${attachment.noteId}_${attachment.filename}`;

    if (key !== currentGroupKey) {
      // New group
      currentGroupKey = key;
      versionCount = 1; // This is the first one (highest version because of sort)
    } else {
      versionCount++;
    }

    if (versionCount > MAX_VERSIONS) {
      // This version is older than the allowed limit
      console.log(`Pruning attachment: ${attachment.filename} (v${attachment.version}) - Note: ${attachment.noteId}`);
      
      // Delete from disk
      const filename = path.basename(attachment.url);
      const filepath = path.join(UPLOAD_DIR, filename);
      
      try {
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          freedSpace += stats.size;
          fs.unlinkSync(filepath);
        } else {
            console.warn(`File not found on disk: ${filepath}`);
        }

        // Delete from DB
        await prisma.attachment.delete({
          where: { id: attachment.id }
        });
        
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete attachment ${attachment.id}:`, error);
      }
    }
  }

  console.log('Pruning completed.');
  console.log(`Deleted ${deletedCount} old attachment versions.`);
  console.log(`Freed ${(freedSpace / 1024 / 1024).toFixed(2)} MB of space.`);
}

pruneAttachments()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
