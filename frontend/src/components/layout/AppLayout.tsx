import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';

export default function AppLayout() {
  const { token } = useAuthStore();
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | undefined>();
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar 
        onSelectNotebook={(id) => { setSelectedNotebookId(id); setSelectedTagId(undefined); }} 
        selectedNotebookId={selectedNotebookId}
        onSelectTag={(id) => { setSelectedTagId(id); setSelectedNotebookId(undefined); }}
        selectedTagId={selectedTagId}
      />
      <div className="flex-1 flex overflow-hidden">
        <Outlet context={{ selectedNotebookId, selectedTagId }} />
      </div>
    </div>
  );
}
