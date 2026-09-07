import {
  getAllCompaniesService,
  getCompanyByIdService,
  getCompanyQuestionsService
} from '../services/companyService.js';

/**
 * @desc    Get all companies
 * @route   GET /api/companies
 * @access  Public
 */
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await getAllCompaniesService();
    res.status(200).json({
      success: true,
      companies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single company by ID or slug
 * @route   GET /api/companies/:companyId
 * @access  Public
 */
export const getCompanyById = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const company = await getCompanyByIdService(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company '${companyId}' not found`
      });
    }

    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get questions for a specific company
 * @route   GET /api/companies/:companyId/questions
 * @access  Public
 */
export const getCompanyQuestions = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const result = await getCompanyQuestionsService(companyId, req.query);

    if (!result.company) {
      return res.status(404).json({
        success: false,
        message: `Company '${companyId}' not found`
      });
    }

    res.status(200).json({
      success: true,
      company: result.company,
      questions: result.questions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};
