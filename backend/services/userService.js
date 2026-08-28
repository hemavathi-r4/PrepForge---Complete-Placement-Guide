import User from '../models/User.js';

/**
 * Get profile details of the authenticated user
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    college: user.college || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    github: user.github || '',
    linkedin: user.linkedin || '',
    leetcode: user.leetcode || '',
    codeforces: user.codeforces || '',
    codechef: user.codechef || '',
    geeksforgeeks: user.geeksforgeeks || '',
    createdAt: user.createdAt
  };
};

/**
 * Update authenticated user's profile with mass-assignment protection
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Whitelist allowable fields to prevent mass assignment / tampering
  const allowedFields = [
    'name',
    'college',
    'bio',
    'avatar',
    'github',
    'linkedin',
    'leetcode',
    'codeforces',
    'codechef',
    'geeksforgeeks'
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = typeof updateData[field] === 'string' ? updateData[field].trim() : updateData[field];
    }
  });

  await user.save();

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    college: user.college || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    github: user.github || '',
    linkedin: user.linkedin || '',
    leetcode: user.leetcode || '',
    codeforces: user.codeforces || '',
    codechef: user.codechef || '',
    geeksforgeeks: user.geeksforgeeks || '',
    createdAt: user.createdAt
  };
};

/**
 * Change authenticated user's password securely
 * @param {string} userId
 * @param {{ currentPassword: string, newPassword: string }} param1
 * @returns {Promise<boolean>}
 */
export const changeUserPassword = async (userId, { currentPassword, newPassword }) => {
  // Explicitly select password field to verify against stored bcrypt hash
  const user = await User.findById(userId).select('+password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  // Validate new password rules
  if (!newPassword || newPassword.length < 6) {
    const error = new Error('New password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  // Assign new password; pre-save hook in User model will hash it
  user.password = newPassword;
  await user.save();

  return true;
};

export default {
  getUserProfile,
  updateUserProfile,
  changeUserPassword
};
