import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Book, Tag, Trash2, Plus, LogOut, Settings, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

import TagList from '../../features/tags/TagList';
import SearchDialog from '../search/SearchDialog';
import { createNote } from '../../features/notes/noteService';
import { useNotebooks } from '../../hooks/useNotebooks';

export default function Sidebar({ onSelectTag, selectedTagId }: { onSelectTag: (id: string | undefined) => void, selectedTagId?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { notebooks, createNotebook } = useNotebooks();

  const handleCreateNote = async () => {
    let defaultNotebookId: string;
    
    if (!notebooks || notebooks.length === 0) {
      const nb = await createNotebook('First Notebook');
      defaultNotebookId = nb.id;
    } else {
      defaultNotebookId = notebooks[0].id;
    }

    try {
      const newNote = await createNote({
        title: '',
        notebookId: defaultNotebookId,
        content: ''
      });
      navigate(`/notes?noteId=${newNote.id}`);
    } catch (error) {
      console.error('Failed to create note', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: Book, label: 'Notebooks', path: '/notebooks' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
  ];

  return (
    <>
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <div className="flex h-screen w-64 flex-col bg-gray-900 text-gray-300">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium text-white">{user?.name || 'User'}</div>
            <div className="truncate text-xs text-gray-500">{user?.email}</div>
          </div>
          <button onClick={logout} className="text-gray-500 hover:text-white" title="Logout">
            <LogOut size={16} />
          </button>
        </div>

        {/* Search & New Note */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <Search size={16} />
            <span>Search</span>
            <span className="ml-auto text-xs text-gray-500 border border-gray-600 rounded px-1">⌘K</span>
          </button>

          <button 
            onClick={handleCreateNote}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            <Plus size={18} />
            New Note
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          
          <div className="mt-6 px-3">
              <TagList onSelectTag={onSelectTag} selectedTagId={selectedTagId} />
          </div>
        </nav>

        {/* Sync Status / Bottom */}
        <div className="border-t border-gray-800 p-4 text-xs text-gray-500 flex justify-between items-center">
          <span>Synced</span>
          <Settings size={14} className="hover:text-white cursor-pointer" />
        </div>
      </div>
    </>
  );
}
