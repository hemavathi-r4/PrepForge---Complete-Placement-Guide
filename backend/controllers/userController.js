import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword
} from '../services/userService.js';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private (Protected by authMiddleware)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private (Protected by authMiddleware)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      college,
      bio,
      avatar,
      github,
      linkedin,
      leetcode,
      codeforces,
      codechef,
      geeksforgeeks
    } = req.body;

    // Validation: name cannot be empty if provided
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    const updatedUser = await updateUserProfile(req.user._id, {
      name,
      college,
      bio,
      avatar,
      github,
      linkedin,
      leetcode,
      codeforces,
      codechef,
      geeksforgeeks
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @desc    Change authenticated user's password
 * @route   PUT /api/users/change-password
 * @access  Private (Protected by authMiddleware)
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    await changeUserPassword(req.user._id, {
      currentPassword,
      newPassword
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword
};
