/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Centralized API Client (src/services/api.js)
 * ─────────────────────────────────────────────────────────────
 * Provides a unified HTTP request client for all frontend services.
 * Features:
 *   • Resolves base API URL from environment (VITE_API_URL).
 *   • Automatically injects JWT Authorization header if present.
 *   • Sets default JSON headers for request bodies.
 *   • Centralized 401 Unauthorized interceptor that clears stale
 *     tokens and dispatches an auth event.
 *   • Consistent error format { success: false, message, error }.
 *   • Standard HTTP helpers: api.get, api.post, api.put, api.delete.
 * ─────────────────────────────────────────────────────────────
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const TOKEN_KEY = 'prepforge_token';
export const USER_KEY = 'prepforge_current_user';

/**
 * Retrieve the stored JWT token
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Remove stored credentials and clear authentication state
 */
export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Centralized API request wrapper
 * @param {string} endpoint - Relative path (e.g. '/auth/login' or '/questions')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 */
export const apiRequest = async (endpoint, options = {}) => {
  // Ensure endpoint starts with a slash if not provided
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const token = getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is an object and not already stringified, serialize it
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const config = {
    ...options,
    headers: defaultHeaders,
    body
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized centrally
    if (response.status === 401) {
      // Clear invalid credentials
      clearAuthStorage();

      // Dispatch global event for AuthContext / UI listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('prepforge:unauthorized'));
      }
    }

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `Request failed with status ${response.status}`,
        message: data.message || `Request failed with status ${response.status}`,
        status: response.status,
        ...data
      };
    }

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${path}:`, error);
    return {
      success: false,
      error: 'Unable to connect to PrepForge server. Please check your network or ensure backend is running.',
      message: 'Unable to connect to PrepForge server. Please check your network or ensure backend is running.',
      isNetworkError: true
    };
  }
};

/**
 * Convenience methods for HTTP operations
 */
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
  getToken,
  clearAuthStorage,
  API_BASE_URL
};

export default api;
