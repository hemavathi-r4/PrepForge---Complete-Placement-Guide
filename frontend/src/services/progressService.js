/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Progress Service
 * ─────────────────────────────────────────────────────────────
 * Communicates with the backend REST API at /api/progress.
 * All endpoints require a valid JWT Bearer token (user must be logged in).
 *
 * Endpoints covered:
 *   PUT  /api/progress/:questionId     — Mark a question solved/unsolved
 *   GET  /api/progress                 — Get full progress list for user
 *   GET  /api/progress/:questionId     — Get progress for a single question
 *   GET  /api/progress/summary         — Category-wise + overall progress summary
 *   GET  /api/progress/streak          — Current streak, longest streak, today activity
 *   GET  /api/progress/activity        — Recent daily activity log
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
 * Mark a question as solved or unsolved for the authenticated user.
 *
 * @param {string} questionId  - MongoDB _id or customId of the question
 * @param {boolean} solved     - true = solved, false = unsolved
 * @returns {{ success: boolean, progress?: object, error?: string }}
 */
export const markQuestionSolved = async (questionId, solved) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/${questionId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ solved })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to update progress'
      };
    }

    return {
      success: true,
      progress: data.progress,
      message: data.message
    };
  } catch (error) {
    console.error(`Error updating progress for question ${questionId}:`, error);
    return {
      success: false,
      error: 'Unable to connect to server. Progress saved locally only.'
    };
  }
};

/**
 * Fetch the full list of progress records for the authenticated user.
 *
 * @returns {{ success: boolean, progress?: Array, error?: string }}
 */
export const getUserProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch progress',
        progress: []
      };
    }

    return {
      success: true,
      progress: data.progress || []
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      progress: []
    };
  }
};

/**
 * Fetch the progress status for a single question for the authenticated user.
 *
 * @param {string} questionId  - MongoDB _id or customId
 * @returns {{ success: boolean, progress?: object, error?: string }}
 */
export const getQuestionProgress = async (questionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/${questionId}`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch question progress',
        progress: null
      };
    }

    return {
      success: true,
      progress: data.progress
    };
  } catch (error) {
    console.error(`Error fetching progress for question ${questionId}:`, error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      progress: null
    };
  }
};

/**
 * Fetch overall + category-wise progress summary for the authenticated user.
 *
 * Returns:
 *   { totalSolved, totalQuestions, overallPercentage,
 *     dsaSolved, sqlSolved, aptitudeSolved, coreSolved,
 *     categoryBreakdown: { dsa, sql, aptitude, core } }
 *
 * @returns {{ success: boolean, summary?: object, error?: string }}
 */
export const getProgressSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/summary`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch progress summary',
        summary: null
      };
    }

    return {
      success: true,
      summary: data.summary
    };
  } catch (error) {
    console.error('Error fetching progress summary:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      summary: null
    };
  }
};

/**
 * Fetch streak information for the authenticated user.
 *
 * Returns:
 *   { current: number, longest: number, todayActive: boolean }
 *
 * @returns {{ success: boolean, streak?: object, error?: string }}
 */
export const getStreak = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/streak`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch streak data',
        streak: null
      };
    }

    return {
      success: true,
      streak: data.streak
    };
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      streak: null
    };
  }
};

/**
 * Fetch recent daily activity for the authenticated user.
 *
 * @param {number} [days=30]  - Number of recent days to retrieve (1–365)
 * @returns {{ success: boolean, activity?: Array<{ date: string, questionsSolved: number }>, error?: string }}
 */
export const getActivity = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/activity?days=${days}`, {
      method: 'GET',
      headers: authHeaders()
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch activity data',
        activity: []
      };
    }

    return {
      success: true,
      activity: data.activity || []
    };
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      activity: []
    };
  }
};
