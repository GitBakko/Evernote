import { useEffect } from 'react';
import { syncPull, syncPush } from '../features/sync/syncService';
import { useAuthStore } from '../store/authStore';

export function useSync() {
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const sync = async () => {
      console.log('Starting sync...');
      await syncPush();
      await syncPull();
      console.log('Sync completed');
    };

    // Initial sync
    sync();

    // Periodic sync (every 30 seconds)
    const intervalId = setInterval(sync, 30000);

    return () => clearInterval(intervalId);
  }, [token]);
}
