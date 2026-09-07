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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'prepforge_token';

/**
 * Helper: Build Authorization header from stored JWT token.
 */
const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

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
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch analytics overview',
        overview: null
      };
    }

    return {
      success: true,
      overview: data.overview || data.data
    };
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      overview: null
    };
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/category`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch category analytics',
        categories: []
      };
    }

    return {
      success: true,
      categories: data.categories || data.data || []
    };
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      categories: []
    };
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/topic`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch topic analytics',
        topics: []
      };
    }

    return {
      success: true,
      topics: data.topics || data.data || []
    };
  } catch (error) {
    console.error('Error fetching topic analytics:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      topics: []
    };
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/difficulty`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch difficulty analytics',
        difficulty: []
      };
    }

    return {
      success: true,
      difficulty: data.difficulty || data.data || []
    };
  } catch (error) {
    console.error('Error fetching difficulty analytics:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      difficulty: []
    };
  }
};

/**
 * Fetch continuous daily activity timeline for the authenticated user.
 *
 * @param {number} [days=30] - Number of days to retrieve
 * @returns {{ success: boolean, activity?: Array<{ date: string, questionsSolved: number }>, error?: string }}
 */
export const getActivityAnalytics = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/activity?days=${days}`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch activity analytics',
        activity: []
      };
    }

    return {
      success: true,
      activity: data.activity || data.data || []
    };
  } catch (error) {
    console.error('Error fetching activity analytics:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      activity: []
    };
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/company`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch company analytics',
        companies: []
      };
    }

    return {
      success: true,
      companies: data.companies || data.data || []
    };
  } catch (error) {
    console.error('Error fetching company analytics:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      companies: []
    };
  }
};
