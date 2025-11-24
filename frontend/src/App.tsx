import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import NotesPage from './features/notes/NotesPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/notes" replace />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="notebooks" element={<div className="p-8">Notebooks Placeholder</div>} />
        <Route path="tags" element={<div className="p-8">Tags Placeholder</div>} />
        <Route path="trash" element={<div className="p-8">Trash Placeholder</div>} />
      </Route>
    </Routes>
  )
}

export default App
