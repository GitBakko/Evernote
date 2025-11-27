import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  title: string;
  description: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  title,
  description,
}: DeleteConfirmationDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);

  const isMatch = inputValue === itemName;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <p className="font-medium">{t('common.warning')}</p>
        </div>

        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('common.typeToConfirm', { name: itemName })}
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={itemName}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (isMatch) {
                onConfirm();
                onClose();
              }
            }}
            disabled={!isMatch}
            data-testid="confirm-delete-button"
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
