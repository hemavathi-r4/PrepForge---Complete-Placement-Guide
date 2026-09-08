/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend User & Profile Service
 * ─────────────────────────────────────────────────────────────
 * Connects frontend Profile & Settings views to the Node.js/Express
 * User Management Backend (/api/users).
 * ─────────────────────────────────────────────────────────────
 */

import api, { USER_KEY } from './api';

/**
 * Fetch authenticated user profile details from backend
 * @returns {Promise<{ success: boolean, user?: Object, error?: string }>}
 */
export const getProfile = async () => {
  const data = await api.get('/users/profile');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch user profile'
    };
  }

  return {
    success: true,
    user: data.user
  };
};

/**
 * Update authenticated user's profile details
 * @param {Object} profileData
 * @returns {Promise<{ success: boolean, user?: Object, message?: string, error?: string }>}
 */
export const updateProfile = async (profileData) => {
  const data = await api.put('/users/profile', profileData);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to update profile'
    };
  }

  // Also update local cached user if present
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return {
    success: true,
    user: data.user,
    message: data.message || 'Profile updated successfully'
  };
};

/**
 * Change authenticated user's password
 * @param {{ currentPassword: string, newPassword: string }} param0
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export const changePassword = async ({ currentPassword, newPassword }) => {
  const data = await api.put('/users/change-password', { currentPassword, newPassword });

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to change password'
    };
  }

  return {
    success: true,
    message: data.message || 'Password changed successfully'
  };
};

export const userService = {
  getProfile,
  updateProfile,
  changePassword
};

export default userService;
