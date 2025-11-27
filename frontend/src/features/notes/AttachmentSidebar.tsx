import { X, Paperclip, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import AttachmentList from '../../components/editor/AttachmentList';

interface AttachmentSidebarProps {
  attachments: { id: string; url: string; filename: string; mimeType: string; size: number }[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function AttachmentSidebar({ attachments, onClose, onDelete, onAdd }: AttachmentSidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-40 flex flex-col dark:bg-gray-900 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{t('notes.attachments')}</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {attachments.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <Upload size={48} className="mx-auto mb-3 opacity-50" />
            <p className="mb-4">{t('notes.noAttachments')}</p>
            <Button onClick={onAdd} variant="secondary" size="sm">
              {t('notes.addAttachment')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={onAdd} variant="secondary" size="sm" className="w-full mb-4">
              {t('notes.addAttachment')}
            </Button>
            <AttachmentList
              attachments={attachments}
              onDelete={onDelete}
              onAdd={onAdd} // Not used in list mode usually, but passing for compatibility
            />
          </div>
        )}
      </div>
    </div>
  );
}
