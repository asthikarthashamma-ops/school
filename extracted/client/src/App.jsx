import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// Sidebar & Topbar Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page Views
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentManagement from './pages/Admin/StudentManagement';
import TeacherManagement from './pages/Admin/TeacherManagement';
import BiometricSimulator from './pages/Admin/BiometricSimulator';
import FeeManagement from './pages/Admin/FeeManagement';
import TimetableManagement from './pages/Admin/TimetableManagement';
import ExamManagement from './pages/Admin/ExamManagement';
import ReportsPage from './pages/Admin/ReportsPage';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';
import ParentDashboard from './pages/Parent/ParentDashboard';
import TransportManager from './pages/Admin/TransportManager';

// ----------------------------------------------------
// PROTECTED CORE ROUTING WRAPPER
// ----------------------------------------------------
const ProtectedLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Drawer Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main pane content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Floating Toasts Panel */}
      <ToastContainer />
    </div>
  );
};

// ----------------------------------------------------
// DYNAMIC DASHBOARD PORTAL SELECTOR
// ----------------------------------------------------
const DashboardSelector = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// ----------------------------------------------------
// FLOATING TOASTS MOUNT CONTAINER
// ----------------------------------------------------
const ToastContainer = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`rounded-2xl border p-4 shadow-xl flex items-center justify-between transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-150 text-green-700 dark:bg-emerald-950/90 dark:border-green-900 dark:text-green-300'
              : 'bg-red-50 border-red-150 text-red-700 dark:bg-red-950/90 dark:border-red-900 dark:text-red-300'
          }`}
        >
          <span className="text-xs font-semibold leading-relaxed">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

// ----------------------------------------------------
// MAIN ROUTER MAPS
// ----------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Authentications */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardSelector />} />
              
              {/* Admin Gateways */}
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/teachers" element={<TeacherManagement />} />
              <Route path="/biometric-simulator" element={<BiometricSimulator />} />
              <Route path="/fees" element={<FeeManagement />} />
              <Route path="/timetable" element={<TimetableManagement />} />
              <Route path="/exams" element={<ExamManagement />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* Teacher shortcuts maps */}
              <Route path="/teacher-marks" element={<TeacherDashboard />} />
              <Route path="/teacher-schedule" element={<TeacherDashboard />} />

              {/* Student shortcuts maps */}
              <Route path="/student-grades" element={<StudentDashboard />} />
              <Route path="/student-timetable" element={<StudentDashboard />} />

              {/* Parent shortcuts maps */}
              <Route path="/parent-fees" element={<ParentDashboard />} />
              <Route path="/transport" element={<TransportManager />} />
            </Route>

            {/* Fallbacks redirects */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
