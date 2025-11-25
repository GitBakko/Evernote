import { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { restoreNote, permanentlyDeleteNote } from '../notes/noteService';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function TrashPage() {
  const notes = useNotes(undefined, undefined, undefined, true); // onlyTrashed = true
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    try {
      await restoreNote(id);
      toast.success('Note restored');
      if (selectedNoteId === id) setSelectedNoteId(null);
    } catch (error) {
      toast.error('Failed to restore note');
    }
  };

  const handleDeleteForever = async (id: string) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await permanentlyDeleteNote(id);
        toast.success('Note deleted forever');
        if (selectedNoteId === id) setSelectedNoteId(null);
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Trash List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Trash</h2>
          <p className="text-xs text-gray-500">{notes?.length || 0} deleted notes</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes?.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Trash is empty</div>
          ) : (
            notes?.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-50 ${
                  selectedNoteId === note.id ? 'bg-red-50 border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent pl-5'
                }`}
              >
                <h3 className="mb-1 text-sm font-semibold truncate text-gray-900">
                  {note.title || 'Untitled Note'}
                </h3>
                <p className="mb-2 line-clamp-2 text-xs text-gray-500 h-8">
                  {note.content ? note.content.replace(/<[^>]*>?/gm, '') : 'No content'}
                </p>
                <div className="text-xs text-gray-400">
                  Deleted {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview & Actions */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedNoteId ? (
          <div className="flex-1 flex flex-col p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-red-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {notes?.find(n => n.id === selectedNoteId)?.title || 'Untitled Note'}
                        </h2>
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertTriangle size={16} />
                            <span>This note is in the trash</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleRestore(selectedNoteId)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                            <RefreshCw size={16} />
                            Restore
                        </button>
                        <button 
                            onClick={() => handleDeleteForever(selectedNoteId)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            Delete Forever
                        </button>
                    </div>
                </div>
                <div className="p-8 overflow-y-auto prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: notes?.find(n => n.id === selectedNoteId)?.content || '' }} />
                </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a note to view options
          </div>
        )}
      </div>
    </div>
  );
}
