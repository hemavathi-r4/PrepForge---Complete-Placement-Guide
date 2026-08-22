import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * Service handling core authentication business logic
 */
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 400;
    throw error;
  }

  // Create new user in database (password is automatically hashed via pre-save hook)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    token
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Explicitly select password field since it is set to select: false in schema
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    },
    token
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email
  };
};

export default {
  registerUser,
  loginUser,
  getUserById
};
