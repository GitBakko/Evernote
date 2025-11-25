import { Paperclip, X } from 'lucide-react';

interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
}

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

export default function AttachmentList({ attachments, onDelete, readonly = false }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Paperclip size={12} />
        Attachments ({attachments.length})
      </h4>
      <ul className="space-y-2">
        {attachments.map((att) => (
          <li key={att.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100 group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                {att.filename.split('.').pop()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <a 
                  href={`http://localhost:3001${att.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 truncate hover:text-emerald-600 hover:underline"
                >
                  {att.filename}
                </a>
                <span className="text-xs text-gray-400">
                  {(att.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            {!readonly && onDelete && (
              <button 
                onClick={() => onDelete(att.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
