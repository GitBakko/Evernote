import { useState, type FormEvent } from 'react';
import { Tag as TagIcon, Trash2, Plus } from 'lucide-react';
import { useTags } from '../../hooks/useTags';
import toast from 'react-hot-toast';

export default function TagsPage() {
  const { tags, createTag, deleteTag } = useTags();
  const [newTagName, setNewTagName] = useState('');

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName.trim());
      setNewTagName('');
      toast.success('Tag created');
    } catch (error) {
      toast.error('Failed to create tag');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await deleteTag(id);
        toast.success('Tag deleted');
      } catch (error) {
        toast.error('Failed to delete tag');
      }
    }
  };

  return (
    <div className="flex-1 h-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="p-8 pb-4 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your tags</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleCreate} className="flex gap-2 mb-8 max-w-md">
          <input
            type="text"
            placeholder="New tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-2">
            <Plus size={18} />
            Add Tag
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags?.map((tag) => (
            <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-gray-700">
                <TagIcon size={18} className="text-emerald-600" />
                <span className="font-medium">{tag.name}</span>
              </div>
              <button 
                onClick={() => handleDelete(tag.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Tag"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {tags?.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                  No tags found. Create one to organize your notes.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
