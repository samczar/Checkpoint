// frontend/src/App.tsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import StandupForm from "./components/StandupForm";
import TeamView from "./components/TeamView";
import HistoryView from "./components/HistoryView";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Button } from "./components/ui/button";
import { ToastProvider } from "@/contexts/ToastContext";

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`${
                  currentPath === "/"
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                Standup
              </Link>
              <Link
                to="/team"
                className={`${
                  currentPath.startsWith("/team")
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                Team
              </Link>
              <Link
                to="/history"
                className={`${
                  currentPath.startsWith("/history")
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                History
              </Link>
            </>
          ) : (
            <span className="font-bold">Checkpoint</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Hello, {user?.name}</span>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-600 hover:text-blue-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-zinc-900 text-white px-4 py-2 rounded hover:bg-zinc-700"
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
      <ToastProvider>
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
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
