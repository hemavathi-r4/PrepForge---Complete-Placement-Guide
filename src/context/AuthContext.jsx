import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true on first mount while restoring session
  const [error,   setError]   = useState(null);

  // ── Derived state ─────────────────────────────────────────
  const isAuthenticated = user !== null;

  // ── Restore session on app load ───────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const res = await authService.getSession();
      // res.data is null when no session — that is fine
      setUser(res.data);
      setLoading(false);
    };
    restoreSession();
  }, []);

  // ── Clear error helper (call from forms to reset error) ───
  const clearError = useCallback(() => setError(null), []);

  // ── signup ────────────────────────────────────────────────
  /**
   * @param {{ name, email, password }} fields
   * @returns {Promise<boolean>} true on success
   */
  const signup = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.signup({ name, email, password });
      if (!res.success) {
        setError(res.error);
        return false;
      }
      setUser(res.data);
      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── login ─────────────────────────────────────────────────
  /**
   * @param {{ email, password, rememberMe? }} fields
   * @returns {Promise<boolean>} true on success
   */
  const login = async ({ email, password, rememberMe = false }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password, rememberMe });
      if (!res.success) {
        setError(res.error);
        return false;
      }
      setUser(res.data);
      return true;
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── logout ────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── forgotPassword ────────────────────────────────────────
  /**
   * @param {{ email }} fields
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  const forgotPassword = async ({ email }) => {
    const res = await authService.forgotPassword({ email });
    return {
      success: res.success,
      message: res.success ? res.data.message : res.error,
    };
  };

  // ── Context value ─────────────────────────────────────────
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    clearError,
    signup,
    login,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
