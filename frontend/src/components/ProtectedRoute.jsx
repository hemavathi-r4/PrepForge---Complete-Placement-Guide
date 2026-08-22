import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * Wraps any route that requires authentication.
 * - While the session is being restored (loading) → shows a centered spinner
 * - If user is not authenticated              → redirects to /login
 * - If user is authenticated                  → renders children
 *
 * The `state.from` location is passed so LoginPage can redirect back
 * to the originally requested path after a successful login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
