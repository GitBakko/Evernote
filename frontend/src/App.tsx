import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import NotesPage from './features/notes/NotesPage';

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
          <Route path="/notebooks" element={<div>Notebooks (Coming Soon)</div>} />
          <Route path="/tags" element={<div>Tags (Coming Soon)</div>} />
          <Route path="/trash" element={<div>Trash (Coming Soon)</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App
