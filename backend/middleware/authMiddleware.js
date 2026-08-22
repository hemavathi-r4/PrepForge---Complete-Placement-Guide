import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes by verifying JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract Bearer token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, missing token'
        });
      }

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database excluding password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      // Attach user object to request
      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

export default protect;
