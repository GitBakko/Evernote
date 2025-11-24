import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Book, Tag, Trash2, Plus, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

import TagList from '../../features/tags/TagList';
import { useQueryClient } from '@tanstack/react-query'; // Assuming this import path

export default function Sidebar({ onSelectNotebook, selectedNotebookId, onSelectTag, selectedTagId }: { onSelectNotebook: (id: string | undefined) => void, selectedNotebookId?: string, onSelectTag: (id: string | undefined) => void, selectedTagId?: string }) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: Book, label: 'Notebooks', path: '/notebooks' },
    { icon: Tag, label: 'Tags', path: '/tags' },
    { icon: Trash2, label: 'Trash', path: '/trash' },
  ];

  return (
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

      {/* New Note Button */}
      <div className="p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
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
      </nav>

      {/* Sync Status / Bottom */}
      <div className="border-t border-gray-800 p-4 text-xs text-gray-500 flex justify-between items-center">
        <span>Synced</span>
        <Settings size={14} className="hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}
