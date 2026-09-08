/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Question Service
 * ─────────────────────────────────────────────────────────────
 * Communicates with backend REST API GET /api/questions endpoints.
 * ─────────────────────────────────────────────────────────────
 */

import api from './api';

/**
 * Fetch questions with query parameters (category, topic, difficulty, search, company, page, limit)
 */
export const fetchQuestions = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      query.append(key, value);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const data = await api.get(`/questions${queryString}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch questions',
      questions: [],
      pagination: null
    };
  }

  return {
    success: true,
    questions: data.questions || [],
    pagination: data.pagination || null
  };
};

/**
 * Fetch a single question by ID or customId
 */
export const fetchQuestionById = async (id) => {
  const data = await api.get(`/questions/${id}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Question not found',
      question: null
    };
  }

  return {
    success: true,
    question: data.question
  };
};

export const questionService = {
  fetchQuestions,
  fetchQuestionById
};

export default questionService;
