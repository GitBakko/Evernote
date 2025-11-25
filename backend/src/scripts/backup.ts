import fs from 'fs';
import path from 'path';

const BACKUP_ROOT = path.join(__dirname, '../../backups');
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
// Assuming default SQLite path. In production with Postgres, we'd use pg_dump.
const DB_PATH = path.join(__dirname, '../../prisma/dev.db'); 

if (!fs.existsSync(BACKUP_ROOT)) {
  fs.mkdirSync(BACKUP_ROOT, { recursive: true });
}

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(BACKUP_ROOT, timestamp);
  
  console.log(`Creating backup at ${backupDir}...`);
  fs.mkdirSync(backupDir, { recursive: true });

  // Copy DB
  if (fs.existsSync(DB_PATH)) {
    console.log('Backing up database...');
    fs.copyFileSync(DB_PATH, path.join(backupDir, 'dev.db'));
  } else {
    console.warn('Database file not found at default location:', DB_PATH);
    // In a real app, we should parse process.env.DATABASE_URL
  }

  // Copy Uploads
  if (fs.existsSync(UPLOAD_DIR)) {
    console.log('Backing up uploads...');
    const uploadsBackupDir = path.join(backupDir, 'uploads');
    fs.mkdirSync(uploadsBackupDir);
    
    // Recursive copy
    fs.cpSync(UPLOAD_DIR, uploadsBackupDir, { recursive: true });
  }

  console.log('Backup completed successfully.');
}

backup().catch(console.error);
