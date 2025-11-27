import { Paperclip, X } from 'lucide-react';

interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  version?: number;
}

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  readOnly?: boolean;
}

export default function AttachmentList({ attachments, onDelete, onAdd, readOnly = false }: AttachmentListProps) {
  if (!attachments && !onAdd) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 dark:text-gray-400">
          <Paperclip size={12} />
          Attachments ({attachments?.length || 0})
        </h4>
        {!readOnly && onAdd && (
          <button onClick={onAdd} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium dark:text-emerald-500 dark:hover:text-emerald-400">
            Add File
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {attachments?.map((att) => (
          <li key={att.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100 group dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-xs uppercase dark:bg-gray-700 dark:text-gray-400">
                {att.filename.split('.').pop()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <a
                  href={`http://localhost:3001${att.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 truncate hover:text-emerald-600 hover:underline dark:text-gray-200 dark:hover:text-emerald-400"
                >
                  {att.filename}
                </a>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {(att.size / 1024).toFixed(1)} KB {att.version && `• v${att.version}`}
                </span>
              </div>
            </div>
            {!readOnly && onDelete && (
              <button
                onClick={() => onDelete(att.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-500 dark:hover:text-red-400"
                title="Delete attachment"
              >
                <X size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
