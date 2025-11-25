import { type Note } from './noteService';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { FileText } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export default function NoteList({ notes, selectedNoteId, onSelectNote }: NoteListProps) {
  if (!notes || notes.length === 0) {
    return <div className="p-4 text-gray-500 text-sm text-center mt-10">No notes found.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={clsx(
            'cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 group',
            selectedNoteId === note.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent pl-5'
          )}
        >
          <h3 className={clsx('mb-1 text-sm font-semibold truncate', selectedNoteId === note.id ? 'text-emerald-900' : 'text-gray-900')}>
            {note.title || 'Untitled Note'}
          </h3>
          <p className="mb-2 line-clamp-2 text-xs text-gray-500 h-8">
            {note.content ? note.content.replace(/<[^>]*>?/gm, '') : 'No content'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
            {note.tags && note.tags.length > 0 && (
              <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                <FileText size={10} />
                <span className="text-[10px]">{note.tags.length}</span>
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
