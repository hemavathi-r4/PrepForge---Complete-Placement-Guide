/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Analytics Controller (B6)
 * ─────────────────────────────────────────────────────────────
 *
 * Exposes endpoints for user-specific performance analytics,
 * progress metrics, and dashboard reporting.
 *
 * All endpoints require JWT authentication.
 * User ID is strictly obtained from req.user._id (never from client params/body).
 * ─────────────────────────────────────────────────────────────
 */

import {
  getOverviewService,
  getCategoryAnalyticsService,
  getTopicAnalyticsService,
  getDifficultyAnalyticsService,
  getActivityAnalyticsService,
  getCompanyAnalyticsService
} from '../services/analyticsService.js';

/**
 * @desc    Get dashboard overview metrics for authenticated user
 * @route   GET /api/analytics/overview
 * @access  Private (JWT required)
 */
export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const overview = await getOverviewService(userId);

    return res.status(200).json({
      success: true,
      overview,
      data: overview
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get category-wise breakdown (DSA, SQL, APTITUDE, CORE) for authenticated user
 * @route   GET /api/analytics/category
 * @access  Private (JWT required)
 */
export const getCategoryAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const categories = await getCategoryAnalyticsService(userId);

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get topic-wise breakdown for authenticated user
 * @route   GET /api/analytics/topic
 * @access  Private (JWT required)
 */
export const getTopicAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const topics = await getTopicAnalyticsService(userId);

    return res.status(200).json({
      success: true,
      count: topics.length,
      topics,
      data: topics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get difficulty-wise breakdown (Easy, Medium, Hard) for authenticated user
 * @route   GET /api/analytics/difficulty
 * @access  Private (JWT required)
 */
export const getDifficultyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const difficulty = await getDifficultyAnalyticsService(userId);

    return res.status(200).json({
      success: true,
      difficulty,
      data: difficulty
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get continuous daily activity timeline for authenticated user
 * @route   GET /api/analytics/activity
 * @access  Private (JWT required)
 */
export const getActivityAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { days } = req.query;
    const activity = await getActivityAnalyticsService(userId, days);

    return res.status(200).json({
      success: true,
      days: activity.length,
      activity,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get company-wise breakdown for authenticated user
 * @route   GET /api/analytics/company
 * @access  Private (JWT required)
 */
export const getCompanyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const companies = await getCompanyAnalyticsService(userId);

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
      data: companies
    });
  } catch (error) {
    next(error);
  }
};
