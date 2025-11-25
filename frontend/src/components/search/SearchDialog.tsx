import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Book, Tag as TagIcon } from 'lucide-react';
import { db, type LocalNote, type LocalNotebook, type LocalTag } from '../../lib/db';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  notes: LocalNote[];
  notebooks: LocalNotebook[];
  tags: LocalTag[];
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ notes: [], notebooks: [], tags: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults({ notes: [], notebooks: [], tags: [] });
        return;
      }

      const lowerQuery = query.toLowerCase();

      // Search Notes (Title or Content)
      const notes = await db.notes
        .filter(n => 
          !n.isTrashed && (
            n.title.toLowerCase().includes(lowerQuery) || 
            n.content.toLowerCase().includes(lowerQuery)
          )
        )
        .limit(5)
        .toArray();

      // Search Notebooks
      const notebooks = await db.notebooks
        .filter(n => n.name.toLowerCase().includes(lowerQuery))
        .limit(3)
        .toArray();

      // Search Tags
      const tags = await db.tags
        .filter(t => t.name.toLowerCase().includes(lowerQuery))
        .limit(3)
        .toArray();

      setResults({ notes, notebooks, tags });
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" 
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes, notebooks, tags..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-2">
          {!query && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Type to search across your workspace
            </div>
          )}

          {query && results.notes.length === 0 && results.notebooks.length === 0 && results.tags.length === 0 && (
             <div className="p-8 text-center text-gray-400 text-sm">
               No results found for "{query}"
             </div>
          )}

          {/* Notes */}
          {results.notes.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</h3>
              {results.notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => handleNavigate(`/notes/${note.id}`)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left group"
                >
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-gray-900 truncate">{note.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                        {note.content.replace(/<[^>]*>?/gm, '').substring(0, 60)}...
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Notebooks */}
          {results.notebooks.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notebooks</h3>
              {results.notebooks.map(notebook => (
                <button
                  key={notebook.id}
                  onClick={() => handleNavigate(`/notebooks`)} // Ideally filter by notebook
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left group"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Book size={18} />
                  </div>
                  <div className="font-medium text-gray-900 truncate">{notebook.name}</div>
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {results.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
              {results.tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleNavigate(`/tags`)} // Ideally filter by tag
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-left group"
                >
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <TagIcon size={18} />
                  </div>
                  <div className="font-medium text-gray-900 truncate">{tag.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-2 border-t border-gray-100 text-xs text-gray-400 flex justify-between px-4">
            <span>Search powered by local DB</span>
            <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
