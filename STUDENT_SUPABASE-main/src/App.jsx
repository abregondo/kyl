import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import StudentsPage from './pages/StudentsPage';
import AddStudentPage from './pages/AddStudentPage';
import SubjectsPage from './pages/SubjectsPage';
import AddSubjectPage from './pages/AddSubjectPage';
import GradesPage from './pages/GradesPage';
import AddGradePage from './pages/AddGradePage';
import Landing from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to students page */}
        <Route path="/" element={<Landing />} />
        
        {/* Students Routes */}
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/AddStudent" element={<AddStudentPage />} />
        
        {/* Subjects Routes */}
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/AddSubject" element={<AddSubjectPage />} />
        
        {/* Grades Routes */}
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/AddGrade" element={<AddGradePage />} />
        
        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/students" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
