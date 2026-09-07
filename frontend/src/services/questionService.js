/**
 * Frontend Question Service
 * Communicates with backend REST API GET /api/questions endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch questions with query parameters (category, topic, difficulty, search, company, page, limit)
 */
export const fetchQuestions = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        query.append(key, value);
      }
    });

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/questions${queryString}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch questions',
        questions: [],
        pagination: null
      };
    }

    return {
      success: true,
      questions: data.questions || [],
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      success: false,
      error: 'Unable to connect to server. Please ensure the backend is running.',
      questions: [],
      pagination: null
    };
  }
};

/**
 * Fetch a single question by ID or customId
 */
export const fetchQuestionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${id}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Question not found',
        question: null
      };
    }

    return {
      success: true,
      question: data.question
    };
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      question: null
    };
  }
};
