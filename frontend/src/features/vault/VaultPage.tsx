import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVaultStore } from '../../store/vaultStore';
import VaultSetup from './VaultSetup';
import VaultUnlock from './VaultUnlock';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function VaultPage() {
  const { t } = useTranslation();
  const { isSetup, isUnlocked, lockVault } = useVaultStore();
  const [searchQuery, setSearchQuery] = useState('');

  const vaultNotes = useLiveQuery(
    () => db.notes
      .where('notebookId')
      .equals('vault') // Assuming 'vault' is the ID for vault notebook, or we filter by isEncrypted
      .filter(note => {
        if (!searchQuery) return true;
        return note.title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .toArray(),
    [searchQuery]
  );

  // Lock vault on unmount
  useEffect(() => {
    return () => {
      lockVault();
    };
  }, [lockVault]);

  if (!isSetup) {
    return <VaultSetup />;
  }

  if (!isUnlocked) {
    return <VaultUnlock />;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('vault.title')}</h1>
        <Button onClick={() => lockVault()} variant="ghost" size="sm">
          {t('vault.lock')}
        </Button>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm dark:text-white"
          />
        </div>

        <div className="space-y-2">
          {vaultNotes?.map((note) => (
            <Link
              key={note.id}
              to={`/notes?noteId=${note.id}`}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-800"
            >
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">{note.title || t('notes.untitled')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
          {vaultNotes?.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {t('vault.noNotes')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
