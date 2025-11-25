import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import NotesPage from './features/notes/NotesPage';
import NotebooksPage from './features/notebooks/NotebooksPage';
import TagsPage from './features/tags/TagsPage';
import TrashPage from './features/trash/TrashPage';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/notes" replace />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notebooks" element={<NotebooksPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
