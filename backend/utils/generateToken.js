import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) containing the user's ID
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

export default generateToken;
