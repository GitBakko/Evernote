import { useQuery } from '@tanstack/react-query';
import { getNotes, type Note } from './noteService';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { FileText } from 'lucide-react';

interface NoteListProps {
  selectedNoteId?: string;
  onSelectNote: (note: Note) => void;
  notebookId?: string;
}

export default function NoteList({ selectedNoteId, onSelectNote, notebookId }: NoteListProps) {
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', notebookId],
    queryFn: () => getNotes(notebookId),
  });

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading notes...</div>;
  }

  if (!notes || notes.length === 0) {
    return <div className="p-4 text-gray-500">No notes found.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto border-r border-gray-200 bg-white">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={clsx(
            'cursor-pointer border-b border-gray-100 p-4 transition-colors hover:bg-gray-50',
            selectedNoteId === note.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'
          )}
        >
          <h3 className={clsx('mb-1 text-sm font-semibold', selectedNoteId === note.id ? 'text-emerald-900' : 'text-gray-900')}>
            {note.title || 'Untitled Note'}
          </h3>
          <p className="mb-2 line-clamp-2 text-xs text-gray-500">
            {note.content.replace(/<[^>]*>?/gm, '') || 'No content'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
            {note.tags && note.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <FileText size={12} />
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
