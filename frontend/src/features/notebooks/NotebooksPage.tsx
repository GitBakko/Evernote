import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { useNotebooks } from '../../hooks/useNotebooks';
import NotebookList from './NotebookList';
import toast from 'react-hot-toast';

export default function NotebooksPage() {
  const { notebooks, createNotebook, updateNotebook, deleteNotebook } = useNotebooks();
  const [isCreating, setIsCreating] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;

    try {
      await createNotebook(newNotebookName.trim());
      setNewNotebookName('');
      setIsCreating(false);
      toast.success('Notebook created');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create notebook');
    }
  };

  const handleRename = async (id: string, name: string) => {
      try {
          await updateNotebook(id, name);
          toast.success('Notebook renamed');
      } catch (error) {
          toast.error('Failed to rename notebook');
      }
  };

  const handleDelete = async (id: string) => {
      try {
          await deleteNotebook(id);
          toast.success('Notebook deleted');
      } catch (error) {
          toast.error('Failed to delete notebook');
      }
  };

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-8 pb-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Notebooks</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your notebooks</p>
        </div>
        <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
        >
            <Plus size={20} />
            New Notebook
        </button>
      </div>

      {isCreating && (
          <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-center">
              <form onSubmit={handleCreate} className="flex gap-2 w-full max-w-md">
                  <input 
                    type="text" 
                    placeholder="Notebook name..."
                    value={newNotebookName}
                    onChange={(e) => setNewNotebookName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Create</button>
                  <button type="button" onClick={() => setIsCreating(false)} className="text-gray-500 px-4 py-2 hover:text-gray-700">Cancel</button>
              </form>
          </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <NotebookList 
            notebooks={notebooks || []} 
            onRename={handleRename}
            onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
