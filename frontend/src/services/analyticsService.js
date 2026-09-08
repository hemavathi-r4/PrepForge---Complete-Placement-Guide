/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Analytics Service (B6)
 * ─────────────────────────────────────────────────────────────
 * Communicates with the backend REST API at /api/analytics.
 * All endpoints require a valid JWT Bearer token.
 *
 * Endpoints covered:
 *   GET /api/analytics/overview    — Dashboard overview summary & streak stats
 *   GET /api/analytics/category    — Category breakdown (DSA, SQL, APTITUDE, CORE)
 *   GET /api/analytics/topic       — Topic-wise progress breakdown
 *   GET /api/analytics/difficulty  — Difficulty-wise breakdown (Easy, Medium, Hard)
 *   GET /api/analytics/activity    — Continuous daily activity timeline
 *   GET /api/analytics/company     — Company-wise question solve metrics
 * ─────────────────────────────────────────────────────────────
 */

import api from './api';

/**
 * Fetch dashboard overview analytics for the authenticated user.
 *
 * Returns:
 *   { totalQuestions, totalSolved, overallPercentage, currentStreak,
 *     longestStreak, todaySolved, thisWeekSolved, thisMonthSolved }
 *
 * @returns {{ success: boolean, overview?: object, error?: string }}
 */
export const getAnalyticsOverview = async () => {
  const data = await api.get('/analytics/overview');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch analytics overview',
      overview: null
    };
  }

  return {
    success: true,
    overview: data.overview || data.data
  };
};

/**
 * Fetch category-wise breakdown (DSA, SQL, APTITUDE, CORE) for the authenticated user.
 *
 * Returns array of:
 *   { category, total, solved, unsolved, percentage }
 *
 * @returns {{ success: boolean, categories?: Array, error?: string }}
 */
export const getCategoryAnalytics = async () => {
  const data = await api.get('/analytics/category');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch category analytics',
      categories: []
    };
  }

  return {
    success: true,
    categories: data.categories || data.data || []
  };
};

/**
 * Fetch topic-wise progress breakdown for the authenticated user.
 *
 * Returns array of:
 *   { topic, total, solved, unsolved, percentage }
 *
 * @returns {{ success: boolean, topics?: Array, error?: string }}
 */
export const getTopicAnalytics = async () => {
  const data = await api.get('/analytics/topic');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch topic analytics',
      topics: []
    };
  }

  return {
    success: true,
    topics: data.topics || data.data || []
  };
};

/**
 * Fetch difficulty-wise progress breakdown (Easy, Medium, Hard) for the authenticated user.
 *
 * Returns array of:
 *   { difficulty, total, solved, unsolved, percentage }
 *
 * @returns {{ success: boolean, difficulty?: Array, error?: string }}
 */
export const getDifficultyAnalytics = async () => {
  const data = await api.get('/analytics/difficulty');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch difficulty analytics',
      difficulty: []
    };
  }

  return {
    success: true,
    difficulty: data.difficulty || data.data || []
  };
};

/**
 * Fetch continuous daily activity timeline for the authenticated user.
 *
 * @param {number} [days=30] - Number of days to retrieve
 * @returns {{ success: boolean, activity?: Array<{ date: string, questionsSolved: number }>, error?: string }}
 */
export const getActivityAnalytics = async (days = 30) => {
  const data = await api.get(`/analytics/activity?days=${days}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch activity analytics',
      activity: []
    };
  }

  return {
    success: true,
    activity: data.activity || data.data || []
  };
};

/**
 * Fetch company-wise progress breakdown for the authenticated user.
 *
 * Returns array of:
 *   { company, slug, total, solved, unsolved, percentage }
 *
 * @returns {{ success: boolean, companies?: Array, error?: string }}
 */
export const getCompanyAnalytics = async () => {
  const data = await api.get('/analytics/company');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch company analytics',
      companies: []
    };
  }

  return {
    success: true,
    companies: data.companies || data.data || []
  };
};

export const analyticsService = {
  getAnalyticsOverview,
  getCategoryAnalytics,
  getTopicAnalytics,
  getDifficultyAnalytics,
  getActivityAnalytics,
  getCompanyAnalytics
};

export default analyticsService;
