import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVaultStore } from '../../store/vaultStore';
import { hashPin } from '../../utils/crypto';
import { Button } from '../../components/ui/Button';
import { Lock, Unlock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VaultUnlock() {
  const { t } = useTranslation();
  const { pinHash, unlockVault } = useVaultStore();
  const [pin, setPin] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const hashed = hashPin(pin);
    if (hashed === pinHash) {
      unlockVault(pin);
      toast.success(t('vault.unlocked'));
    } else {
      toast.error(t('vault.incorrectPin'));
      setPin('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full inline-flex mb-4">
          <Lock size={32} className="text-gray-600 dark:text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('vault.lockedTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('vault.lockedDescription')}</p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('vault.enterPin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <Button type="submit" variant="primary" className="w-full">
            <Unlock size={18} className="mr-2" />
            {t('vault.unlockButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
