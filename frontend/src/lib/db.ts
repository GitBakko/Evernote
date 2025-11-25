import Dexie, { type Table } from 'dexie';

export interface LocalNote {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  userId: string;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
  tags: { tag: { id: string; name: string } }[];
  attachments: { 
    id: string; 
    url: string; 
    filename: string; 
    mimeType: string; 
    size: number;
    version?: number;
    hash?: string;
    isLatest?: boolean;
  }[];
  syncStatus: 'synced' | 'created' | 'updated';
}

export interface LocalNotebook {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'created' | 'updated';
}

export interface LocalTag {
  id: string;
  name: string;
  userId: string;
  syncStatus: 'synced' | 'created' | 'updated';
}

export interface SyncQueueItem {
  id?: number; // Auto-increment
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: 'NOTE' | 'NOTEBOOK' | 'TAG';
  entityId: string;
  data?: any;
  createdAt: number;
}

class AppDatabase extends Dexie {
  notes!: Table<LocalNote>;
  notebooks!: Table<LocalNotebook>;
  tags!: Table<LocalTag>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('EvernoteCloneDB');
    this.version(1).stores({
      notes: 'id, notebookId, updatedAt, syncStatus, isTrashed',
      notebooks: 'id, name, updatedAt, syncStatus',
      tags: 'id, name, syncStatus',
      syncQueue: '++id, type, entity, createdAt'
    });
  }
}

export const db = new AppDatabase();

