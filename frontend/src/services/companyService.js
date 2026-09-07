/**
 * Frontend Company Service
 * Communicates with backend REST API GET /api/companies endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all companies list
 */
export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/companies`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch companies',
        companies: []
      };
    }

    return {
      success: true,
      companies: data.companies || []
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return {
      success: false,
      error: 'Unable to connect to server. Please ensure the backend is running.',
      companies: []
    };
  }
};

/**
 * Fetch single company by ID or slug
 */
export const fetchCompanyById = async (companyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Company not found',
        company: null
      };
    }

    return {
      success: true,
      company: data.company
    };
  } catch (error) {
    console.error(`Error fetching company ${companyId}:`, error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      company: null
    };
  }
};

/**
 * Fetch questions for a specific company with optional search/difficulty/topic filters
 */
export const fetchCompanyQuestions = async (companyId, params = {}) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'All') {
        query.append(key, value);
      }
    });

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/questions${queryString}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.message || 'Failed to fetch company questions',
        company: null,
        questions: [],
        pagination: null
      };
    }

    return {
      success: true,
      company: data.company,
      questions: data.questions || [],
      pagination: data.pagination || null
    };
  } catch (error) {
    console.error(`Error fetching questions for company ${companyId}:`, error);
    return {
      success: false,
      error: 'Unable to connect to server.',
      company: null,
      questions: [],
      pagination: null
    };
  }
};
