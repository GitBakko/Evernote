import { useMutation } from '@tanstack/react-query';
import { createTag, deleteTag } from './tagService';
import { Tag as TagIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useTags } from '../../hooks/useTags';

export default function TagList({ onSelectTag, selectedTagId }: { onSelectTag: (tagId: string | undefined) => void, selectedTagId?: string }) {
  const tags = useTags();
  const isLoading = !tags;
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      // No need to invalidate queries for Dexie hooks, they update automatically
      setIsCreating(false);
      setNewTagName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      // No need to invalidate
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      createMutation.mutate(newTagName);
    }
  };

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading tags...</div>;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
        <button onClick={() => setIsCreating(true)} className="text-gray-400 hover:text-gray-600">
          <Plus size={14} />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="px-4 mb-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag..."
            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-green-500"
            autoFocus
            onBlur={() => !newTagName && setIsCreating(false)}
          />
        </form>
      )}

      <ul>
        {tags?.map((tag) => (
          <li key={tag.id} className="group flex items-center justify-between px-4 py-1 hover:bg-gray-100 cursor-pointer">
            <div 
                className={clsx("flex items-center flex-1 truncate", selectedTagId === tag.id && "font-semibold text-green-700")}
                onClick={() => onSelectTag(selectedTagId === tag.id ? undefined : tag.id)}
            >
              <TagIcon size={14} className="mr-2 text-gray-400" />
              <span className="text-sm text-gray-700 truncate">{tag.name}</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(tag.id); }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
            >
                <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
