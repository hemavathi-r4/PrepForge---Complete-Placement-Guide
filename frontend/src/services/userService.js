/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend User & Profile Service
 * ─────────────────────────────────────────────────────────────
 * Connects frontend Profile & Settings views to the Node.js/Express
 * User Management Backend (/api/users).
 * ─────────────────────────────────────────────────────────────
 */

import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to build auth headers
 */
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Fetch authenticated user profile details from backend
 * @returns {Promise<{ success: boolean, user?: Object, error?: string }>}
 */
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch user profile'
      };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('Fetch Profile API Error:', error);
    return {
      success: false,
      error: 'Unable to connect to server. Please check your network connection.'
    };
  }
};

/**
 * Update authenticated user's profile details
 * @param {Object} profileData
 * @returns {Promise<{ success: boolean, user?: Object, message?: string, error?: string }>}
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to update profile'
      };
    }

    // Also update local cached user if present
    if (data.user) {
      localStorage.setItem('prepforge_current_user', JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      message: data.message || 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Update Profile API Error:', error);
    return {
      success: false,
      error: 'Unable to save profile changes. Please check your connection.'
    };
  }
};

/**
 * Change authenticated user's password
 * @param {{ currentPassword: string, newPassword: string }} param0
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to change password'
      };
    }

    return {
      success: true,
      message: data.message || 'Password changed successfully'
    };
  } catch (error) {
    console.error('Change Password API Error:', error);
    return {
      success: false,
      error: 'Unable to change password. Please check your network connection.'
    };
  }
};

export const userService = {
  getProfile,
  updateProfile,
  changePassword
};

export default userService;
