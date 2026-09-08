/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Authentication Service
 * ─────────────────────────────────────────────────────────────
 * Connects frontend components to the Node.js/Express JWT Auth Backend.
 * Uses centralized api client for unified requests and token management.
 * ─────────────────────────────────────────────────────────────
 */

import api, { TOKEN_KEY, USER_KEY, getToken, clearAuthStorage } from './api';

export { getToken, clearAuthStorage };

/**
 * Register a new user with real backend
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = async ({ name, email, password }) => {
  const data = await api.post('/auth/register', { name, email, password });

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Registration failed'
    };
  }

  // Persist JWT and user info for session persistence
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return {
    success: true,
    user: data.user,
    token: data.token,
    message: data.message
  };
};

/**
 * Login existing user with real backend
 * @param {{ email: string, password: string }} data
 */
export const login = async ({ email, password }) => {
  const data = await api.post('/auth/login', { email, password });

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Invalid email or password'
    };
  }

  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return {
    success: true,
    user: data.user,
    token: data.token,
    message: data.message
  };
};

/**
 * Logout user by clearing stored JWT and session state
 */
export const logout = async () => {
  clearAuthStorage();
  return { success: true };
};

/**
 * Validate token and fetch current user profile from GET /api/auth/me
 */
export const getCurrentUser = async () => {
  const token = getToken();

  if (!token) {
    return { success: false, user: null };
  }

  const data = await api.get('/auth/me');

  if (!data.success) {
    clearAuthStorage();
    return { success: false, user: null, error: data.message || data.error };
  }

  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  return { success: true, user: data.user };
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  clearAuthStorage
};

export default authService;
