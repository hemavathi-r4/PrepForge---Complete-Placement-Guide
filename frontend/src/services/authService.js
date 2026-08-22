/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Authentication Service
 * ─────────────────────────────────────────────────────────────
 * Connects frontend components to the Node.js/Express JWT Auth Backend.
 *
 * Security Note:
 * Storing the JWT in localStorage is a development-stage implementation
 * for ease of iteration and client state persistence across reloads.
 * In a production deployment, this can be upgraded to secure, httpOnly
 * sameSite cookies to protect against XSS token extraction.
 * ─────────────────────────────────────────────────────────────
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'prepforge_token';
const USER_KEY = 'prepforge_current_user';

/**
 * Get stored JWT token
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Register a new user with real backend
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Registration failed'
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
  } catch (error) {
    console.error('Registration API Error:', error);
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your connection.'
    };
  }
};

/**
 * Login existing user with real backend
 * @param {{ email: string, password: string }} data
 */
export const login = async ({ email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Invalid email or password'
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
  } catch (error) {
    console.error('Login API Error:', error);
    return {
      success: false,
      error: 'Unable to connect to authentication server. Please check your connection.'
    };
  }
};

/**
 * Logout user by clearing stored JWT and session state
 * JWT authentication is stateless on backend; logout is handled client-side.
 */
export const logout = async () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
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

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Token is invalid or expired
      logout();
      return { success: false, user: null, error: data.message };
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Fetch Current User Error:', error);
    // Return cached user if server temporarily unreachable or return error
    const cachedUserStr = localStorage.getItem(USER_KEY);
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return { success: !!cachedUser, user: cachedUser };
  }
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken
};

export default authService;
