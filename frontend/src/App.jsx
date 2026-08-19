import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPage from './pages/PrivacyPage';
import AuditLogPage from './pages/AuditLogPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentManagement from './pages/StudentManagement';
import StudentProfile from './pages/StudentProfile';
import PredictionStudio from './pages/PredictionStudio';
import InterventionsPage from './pages/InterventionsPage';
import CSVImportPage from './pages/CSVImportPage';
import ReportsPage from './pages/ReportsPage';
import StudentPortal from './pages/StudentPortal';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'Student' ? '/student/dashboard' : '/admin/dashboard'} replace />;
  }

  return children;
};

// Root index redirect handler
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <LoginPage />;
  }
  return <Navigate to={user.role === 'Student' ? '/student/dashboard' : '/admin/dashboard'} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Requirement 2: First Screen Must Be Login Page */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Student Protected Routes (Requirement 4, 43) */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/academic" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/documents" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/report" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student/interventions" element={<ProtectedRoute allowedRoles={['Student']}><StudentPortal /></ProtectedRoute>} />
      <Route path="/student-portal" element={<ProtectedRoute allowedRoles={['Student', 'Admin', 'Faculty']}><StudentPortal /></ProtectedRoute>} />

      {/* Admin / Faculty Protected Routes (Requirement 5, 43) */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><AdminDashboard /></ProtectedRoute>} />

      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><StudentManagement /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><StudentManagement /></ProtectedRoute>} />

      <Route path="/admin/students/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/students/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><StudentProfile /></ProtectedRoute>} />

      <Route path="/admin/predictions" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><PredictionStudio /></ProtectedRoute>} />
      <Route path="/predict" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><PredictionStudio /></ProtectedRoute>} />

      <Route path="/admin/interventions" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><InterventionsPage /></ProtectedRoute>} />
      <Route path="/interventions" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><InterventionsPage /></ProtectedRoute>} />

      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><ReportsPage /></ProtectedRoute>} />

      <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><AuditLogPage /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><AuditLogPage /></ProtectedRoute>} />

      <Route path="/csv-import" element={<ProtectedRoute allowedRoles={['Admin', 'Faculty']}><CSVImportPage /></ProtectedRoute>} />

      {/* Fallback Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
