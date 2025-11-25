import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import NoteList from './NoteList';
import Editor from '../../components/editor/Editor';
import { updateNote, createNote } from './noteService';
import { useDebounce } from '../../hooks/useDebounce';
import AttachmentList from '../../components/editor/AttachmentList';
import { uploadAttachment, deleteAttachment } from '../attachments/attachmentService';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useNotes } from '../../hooks/useNotes';

export default function NotesPage() {
  const { selectedNotebookId, selectedTagId } = useOutletContext<{ selectedNotebookId?: string, selectedTagId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNoteId = searchParams.get('noteId');
  
  const setSelectedNoteId = (id: string | null) => {
    if (id) {
      setSearchParams({ noteId: id });
    } else {
      setSearchParams({});
    }
  };

  const [editorContent, setEditorContent] = useState('');
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const notes = useNotes(selectedNotebookId, debouncedSearch, selectedTagId);
  const isLoading = !notes; // Dexie returns undefined initially while loading

  const queryClient = useQueryClient();
  const debouncedContent = useDebounce(editorContent, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  const selectedNote = notes?.find((n) => n.id === selectedNoteId);

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
      updateNote(id, { title, content }),
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
       if (selectedNote) {
         updateMutation.mutate({ id: selectedNoteId, title: debouncedTitle, content: debouncedContent });
       }
    }
  }, [debouncedContent, debouncedTitle, selectedNoteId]);



  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!selectedNoteId) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Upload files
    for (const file of files) {
        try {
            await uploadAttachment(selectedNoteId, file);
            toast.success(`Uploaded ${file.name}`);
        } catch (error) {
            console.error('Failed to upload', file.name, error);
            toast.error(`Failed to upload ${file.name}`);
        }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
      if (!selectedNoteId) return;
      try {
          await deleteAttachment(selectedNoteId, attachmentId);
      } catch (error) {
          console.error('Failed to delete attachment', error);
      }
  };

  const handleCreateNote = () => {
    if (selectedNotebookId) {
        createMutation.mutate({ title: 'Untitled Note', content: '', notebookId: selectedNotebookId });
    } else {
        alert('Please select a notebook first.');
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Note List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
      
      {/* Editor Area */}
      <div 
        className={clsx("flex-1 flex flex-col h-full relative", isDragging && "bg-emerald-50 border-2 border-dashed border-emerald-500")}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedNoteId ? (
          <>
            <div className="border-b border-gray-200 p-6 pb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>Last edited {new Date(selectedNote?.updatedAt || Date.now()).toLocaleString()}</span>
                {selectedNote?.tags && selectedNote.tags.length > 0 && (
                    <div className="flex gap-1 ml-2">
                        {selectedNote.tags.map(t => (
                            <span key={t.tag.id} className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">#{t.tag.name}</span>
                        ))}
                    </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <Editor
                  content={editorContent}
                  onChange={setEditorContent}
                  editable={true}
                />
                
                <div className="px-8 pb-8">
                    <AttachmentList 
                        attachments={selectedNote?.attachments || []} 
                        onDelete={handleDeleteAttachment}
                    />
                </div>
            </div>
            
            {isDragging && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 pointer-events-none">
                    <div className="text-2xl font-bold text-emerald-600">Drop files to attach</div>
                </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 flex-col">
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
