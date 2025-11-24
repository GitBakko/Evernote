import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { Search } from 'lucide-react';
import NoteList from './NoteList';
import Editor from '../../components/editor/Editor';
import { type Note, updateNote, createNote, getNotes } from './noteService';
import { useDebounce } from '../../hooks/useDebounce';

export default function NotesPage() {
  const { selectedNotebookId, selectedTagId } = useOutletContext<{ selectedNotebookId?: string, selectedTagId?: string }>();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', selectedNotebookId, debouncedSearch, selectedTagId],
    queryFn: () => getNotes(selectedNotebookId, debouncedSearch, selectedTagId),
  });

  const queryClient = useQueryClient();
  const debouncedContent = useDebounce(editorContent, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  const selectedNote = notes?.find((n) => n.id === selectedNoteId) || null;

  useEffect(() => {
    if (selectedNote) {
      setEditorContent(selectedNote.content);
      setTitle(selectedNote.title);
    } else {
      setEditorContent('');
      setTitle('');
    }
  }, [selectedNoteId, notes]); // Update when selection changes or notes reload

  const updateMutation = useMutation({
    mutationFn: ({ id, title, content }: { id: string; title: string; content: string }) =>
      updateNote(id, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNoteId(newNote.id);
    },
  });

  useEffect(() => {
    if (selectedNoteId && (debouncedContent !== selectedNote?.content || debouncedTitle !== selectedNote?.title)) {
       // Avoid updating if content hasn't actually changed from what's in the DB (initial load)
       // This check is a bit simplistic, might need refinement to avoid loops, but good for now.
       // Actually, better to just check if it's different from the *current* selectedNote data
       if (selectedNote) {
         updateMutation.mutate({ id: selectedNoteId, title: debouncedTitle, content: debouncedContent });
       }
    }
  }, [debouncedContent, debouncedTitle, selectedNoteId]);

  const handleCreateNote = () => {
    // If a notebook is selected, use it. Otherwise use a default or ask user (for now hardcoded or first available if we had that info)
    // For MVP, if no notebook selected, we might fail or need a default.
    // Let's assume for now we need a notebook ID. 
    // If selectedNotebookId is present, use it.
    if (selectedNotebookId) {
        createMutation.mutate({ title: 'Untitled Note', content: '', notebookId: selectedNotebookId });
    } else {
        // Fallback or error. For now, let's try to create without notebookId if backend supports it (it doesn't usually).
        // We'll handle this by disabling the button or handling it in UI.
        // For this step, let's just use a hardcoded one if missing, or alert.
        alert('Please select a notebook first.');
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-green-500 rounded-md text-sm transition-colors"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
             {notes?.length || 0} notes found
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading notes...</div>
          ) : (
            <NoteList
              notes={notes || []}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
            />
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-white">
        {selectedNoteId ? (
            <>
                <div className="p-6 border-b border-gray-100">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-3xl font-bold text-gray-800 placeholder-gray-300 border-none focus:ring-0 w-full p-0"
                        placeholder="Note Title"
                    />
                    <div className="text-sm text-gray-400 mt-2">
                        Last edited {selectedNote?.updatedAt ? new Date(selectedNote.updatedAt).toLocaleString() : 'Never'}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <Editor content={editorContent} onChange={setEditorContent} />
                </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                <p className="mb-4">Select a note to view or create a new one.</p>
                <button 
                    onClick={handleCreateNote}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Create New Note
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
