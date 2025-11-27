import { X, FileText, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useNotes } from '../../hooks/useNotes';
import { Button } from '../../components/ui/Button';

interface TagNotesSidebarProps {
  tagId: string;
  tagName: string;
  onClose: () => void;
}

export default function TagNotesSidebar({ tagId, tagName, onClose }: TagNotesSidebarProps) {
  const { t } = useTranslation();
  const notes = useNotes(undefined, undefined, tagId);

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col dark:bg-gray-900 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between dark:border-gray-800">
        <div>
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{tagName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notes?.length || 0} {t('sidebar.notes').toLowerCase()}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notes?.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p>{t('tags.noNotes')}</p>
          </div>
        ) : (
          notes?.map((note) => (
            <Link
              key={note.id}
              to={`/notes?noteId=${note.id}`}
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h3 className="font-medium text-gray-900 mb-1 truncate dark:text-white">
                {note.title || t('notes.untitled')}
              </h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2 dark:text-gray-400">
                {note.content.replace(/<[^>]*>/g, '') || t('notes.noContent')}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {format(new Date(note.updatedAt), 'MMM d, yyyy')}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
