import express from 'express';
import {
  updateQuestionProgress,
  getUserProgress,
  getQuestionProgress,
  getProgressSummary,
  getStreak,
  getActivity
} from '../controllers/progressController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require JWT authentication
router.use(protect);

// Specific named routes MUST come before parameterized routes to avoid conflicts
router.get('/summary', getProgressSummary);
router.get('/streak', getStreak);
router.get('/activity', getActivity);

// User progress list
router.get('/', getUserProgress);

// Per-question progress
router.put('/:questionId', updateQuestionProgress);
router.get('/:questionId', getQuestionProgress);

export default router;
