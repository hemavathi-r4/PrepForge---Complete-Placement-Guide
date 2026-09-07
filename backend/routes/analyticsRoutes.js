import express from 'express';
import {
  getOverview,
  getCategoryAnalytics,
  getTopicAnalytics,
  getDifficultyAnalytics,
  getActivityAnalytics,
  getCompanyAnalytics
} from '../controllers/analyticsController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes require JWT authentication
router.use(protect);

// Analytics endpoints
router.get('/overview', getOverview);
router.get('/category', getCategoryAnalytics);
router.get('/topic', getTopicAnalytics);
router.get('/difficulty', getDifficultyAnalytics);
router.get('/activity', getActivityAnalytics);
router.get('/company', getCompanyAnalytics);

export default router;
