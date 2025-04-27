// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StandupForm from './components/StandupForm';
import TeamView from './components/TeamView';
import HistoryView from './components/HistoryView';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-blue-600">Standup</Link>
              <Link to="/team" className="hover:text-blue-600">Team</Link>
              <Link to="/history" className="hover:text-blue-600">History</Link>
            </>
          ) : (
            <span className="font-bold">Checkpoint</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Hello, {user?.name}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function AuthenticatedRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <div className="max-w-7xl mx-auto p-4">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <AuthenticatedRedirect>
                  <LoginForm />
                </AuthenticatedRedirect>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <AuthenticatedRedirect>
                  <SignupForm />
                </AuthenticatedRedirect>
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <StandupForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <TeamView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryView />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;