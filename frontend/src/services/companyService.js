/**
 * ─────────────────────────────────────────────────────────────
 * PrepForge — Frontend Company Service
 * ─────────────────────────────────────────────────────────────
 * Communicates with backend REST API GET /api/companies endpoints.
 * ─────────────────────────────────────────────────────────────
 */

import api from './api';

/**
 * Fetch all companies list
 */
export const fetchCompanies = async () => {
  const data = await api.get('/companies');

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch companies',
      companies: []
    };
  }

  return {
    success: true,
    companies: data.companies || []
  };
};

/**
 * Fetch single company by ID or slug
 */
export const fetchCompanyById = async (companyId) => {
  const data = await api.get(`/companies/${companyId}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Company not found',
      company: null
    };
  }

  return {
    success: true,
    company: data.company
  };
};

/**
 * Fetch questions for a specific company with optional search/difficulty/topic filters
 */
export const fetchCompanyQuestions = async (companyId, params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      query.append(key, value);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const data = await api.get(`/companies/${companyId}/questions${queryString}`);

  if (!data.success) {
    return {
      success: false,
      error: data.message || data.error || 'Failed to fetch company questions',
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
};

export const companyService = {
  fetchCompanies,
  fetchCompanyById,
  fetchCompanyQuestions
};

export default companyService;
