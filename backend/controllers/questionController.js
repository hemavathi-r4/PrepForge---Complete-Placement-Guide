import {
  getQuestionsService,
  getQuestionByIdService
} from '../services/questionService.js';

/**
 * @desc    Get all questions with optional filters, search & pagination
 * @route   GET /api/questions
 * @access  Public
 */
export const getQuestions = async (req, res, next) => {
  try {
    const result = await getQuestionsService(req.query);
    res.status(200).json({
      success: true,
      questions: result.questions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single question by ID or customId
 * @route   GET /api/questions/:id
 * @access  Public
 */
export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await getQuestionByIdService(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: `Question with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    next(error);
  }
};
