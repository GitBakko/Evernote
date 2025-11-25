import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Book, Edit2, Trash2 } from 'lucide-react';
import type { Notebook } from './notebookService';

interface NotebookListProps {
  notebooks: Notebook[];
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export default function NotebookList({ notebooks, onRename, onDelete }: NotebookListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (notebook: Notebook) => {
    setEditingId(notebook.id);
    setEditName(notebook.name);
  };

  const handleRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      setEditingId(null);
    }
  };

  if (!notebooks || notebooks.length === 0) {
    return <div className="p-8 text-center text-gray-500">No notebooks found. Create one to get started.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notebooks.map((notebook) => (
        <div key={notebook.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group relative">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Book size={20} />
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => startEditing(notebook)}
                className="p-1 text-gray-400 hover:text-emerald-600 rounded"
                title="Rename"
               >
                 <Edit2 size={16} />
               </button>
               <button 
                onClick={() => {
                    if(window.confirm('Are you sure you want to delete this notebook?')) {
                        onDelete(notebook.id);
                    }
                }}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Delete"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </div>

          {editingId === notebook.id ? (
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-emerald-500 rounded px-2 py-1 text-sm focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename();
                        if (e.key === 'Escape') setEditingId(null);
                    }}
                />
                <button onClick={handleRename} className="text-xs bg-emerald-600 text-white px-2 rounded">Save</button>
            </div>
          ) : (
            <h3 className="font-semibold text-gray-800 truncate" title={notebook.name}>{notebook.name}</h3>
          )}
          
          <div className="mt-4 flex justify-between items-end text-xs text-gray-500">
            <span>Updated {formatDistanceToNow(new Date(notebook.updatedAt), { addSuffix: true })}</span>
            {/* <span>{notebook._count?.notes || 0} notes</span> */}
          </div>
        </div>
      ))}
    </div>
  );
}
