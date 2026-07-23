import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { SheetProgressProvider } from "./context/SheetProgressContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import DSASheetPage from "./pages/DSASheetPage";
import SQLSheetPage from "./pages/SQLSheetPage";
import CSFundamentalsPage from "./pages/CSFundamentalsPage";
import CompanySheetsPage from "./pages/CompanySheetsPage";

/**
 * GuestRoute — redirects already-authenticated users away from
 * auth pages (/login, /signup) to the dashboard.
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // AuthProvider handles the full-screen spinner via ProtectedRoute

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>

      {/* ── Public ─────────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/dsa-sheet" element={<DSASheetPage />} />
      <Route path="/sql-sheet" element={<SQLSheetPage />} />
      <Route path="/cs-fundamentals" element={<CSFundamentalsPage />} />
      <Route path="/company-sheets" element={<CompanySheetsPage />} />

      {/* ── Auth pages (redirect to dashboard if logged in) */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestRoute>
            <SignupPage />
          </GuestRoute>
        }
      />

      {/* ── Protected ───────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Route>
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <SheetProgressProvider>
        <AppRoutes />
      </SheetProgressProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
