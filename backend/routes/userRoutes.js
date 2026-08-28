import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// User Profile Routes (Protected)
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

// User Password Management Route (Protected)
router.route('/change-password')
  .put(protect, changePassword);

export default router;
