import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Profile } from './pages/Profile';
import { Calendar } from './pages/Calendar';

function PrivateRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function AppRoutes() {
  const {
    isAuthenticated
  } = useAuth();
  return <Routes>
    <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<PrivateRoute>
      <Dashboard />
    </PrivateRoute>} />
    <Route path="/tasks" element={<PrivateRoute>
      <Tasks />
    </PrivateRoute>} />
    <Route path="/calendar" element={<PrivateRoute>
      <Calendar />
    </PrivateRoute>} />
    <Route path="/profile" element={<PrivateRoute>
      <Profile />
    </PrivateRoute>} />
  </Routes>;
}

export function App() {
  return <AuthProvider>
    <CalendarProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CalendarProvider>
  </AuthProvider>;
}