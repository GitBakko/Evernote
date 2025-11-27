import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useVaultStore } from '../../store/vaultStore';
import { hashPin } from '../../utils/crypto';
import { Button } from '../../components/ui/Button';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VaultSetup() {
  const { t } = useTranslation();
  const setupVault = useVaultStore(state => state.setupVault);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      toast.error(t('vault.pinTooShort'));
      return;
    }
    if (pin !== confirmPin) {
      toast.error(t('vault.pinMismatch'));
      return;
    }

    const hashed = hashPin(pin);
    setupVault(hashed, pin);
    toast.success(t('vault.setupSuccess'));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full inline-flex mb-4">
          <Lock size={32} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('vault.setupTitle')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('vault.setupDescription')}</p>

        <form onSubmit={handleSetup} className="space-y-4">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('vault.enterPin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <input
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder={t('vault.confirmPin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Button type="submit" variant="primary" className="w-full">
            {t('vault.setupButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}
