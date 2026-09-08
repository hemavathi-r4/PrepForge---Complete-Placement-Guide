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

import api from './api';

/**
 * Mark a question as solved or unsolved for the authenticated user.
 *
 * @param {string} questionId  - MongoDB _id or customId of the question
 * @param {boolean} solved     - true = solved, false = unsolved
 * @returns {{ success: boolean, progress?: object, error?: string }}
 */
export const markQuestionSolved = async (questionId, solved) => {
  const data = await api.put(`/progress/${questionId}`, { solved });

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to update progress'
    };
  }

  return {
    success: true,
    progress: data.progress,
    message: data.message
  };
};

/**
 * Fetch the full list of progress records for the authenticated user.
 *
 * @returns {{ success: boolean, progress?: Array, error?: string }}
 */
export const getUserProgress = async () => {
  const data = await api.get('/progress');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch progress',
      progress: []
    };
  }

  return {
    success: true,
    progress: data.progress || []
  };
};

/**
 * Fetch the progress status for a single question for the authenticated user.
 *
 * @param {string} questionId  - MongoDB _id or customId
 * @returns {{ success: boolean, progress?: object, error?: string }}
 */
export const getQuestionProgress = async (questionId) => {
  const data = await api.get(`/progress/${questionId}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch question progress',
      progress: null
    };
  }

  return {
    success: true,
    progress: data.progress
  };
};

/**
 * Fetch overall + category-wise progress summary for the authenticated user.
 *
 * @returns {{ success: boolean, summary?: object, error?: string }}
 */
export const getProgressSummary = async () => {
  const data = await api.get('/progress/summary');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch progress summary',
      summary: null
    };
  }

  return {
    success: true,
    summary: data.summary
  };
};

/**
 * Fetch streak information for the authenticated user.
 *
 * @returns {{ success: boolean, streak?: object, error?: string }}
 */
export const getStreak = async () => {
  const data = await api.get('/progress/streak');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch streak data',
      streak: null
    };
  }

  return {
    success: true,
    streak: data.streak
  };
};

/**
 * Fetch recent daily activity for the authenticated user.
 *
 * @param {number} [days=30]  - Number of recent days to retrieve (1–365)
 * @returns {{ success: boolean, activity?: Array<{ date: string, questionsSolved: number }>, error?: string }}
 */
export const getActivity = async (days = 30) => {
  const data = await api.get(`/progress/activity?days=${days}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch activity data',
      activity: []
    };
  }

  return {
    success: true,
    activity: data.activity || []
  };
};

export const progressService = {
  markQuestionSolved,
  getUserProgress,
  getQuestionProgress,
  getProgressSummary,
  getStreak,
  getActivity
};

export default progressService;
