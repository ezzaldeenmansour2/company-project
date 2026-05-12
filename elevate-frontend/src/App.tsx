import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Students from './pages/Students';
import Instructors from './pages/Instructors';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useEffect } from 'react';

// مكون لتغليف الصفحات التي تحتاج لـ Sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveTab('dashboard');
    else if (path.includes('/courses') || path.includes('/course/')) setActiveTab('courses');
    else if (path.includes('/students')) setActiveTab('students');
    else if (path.includes('/instructors')) setActiveTab('instructors');
    else if (path.includes('/reports')) setActiveTab('reports');
    else if (path.includes('/settings')) setActiveTab('settings');
  }, [location]);

  return (
    <div className="flex bg-[#0f172a] min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={() => {}} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <Layout>
                <Courses />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/course/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <CourseDetails />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/students" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Students />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/instructors" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Instructors />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
