import { registerUser, loginUser, getUserById } from '../services/authService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const result = await registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe
};
