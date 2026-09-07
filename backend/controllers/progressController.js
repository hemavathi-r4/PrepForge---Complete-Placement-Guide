import {
  markQuestionSolvedService,
  getUserProgressService,
  getQuestionProgressService,
  getProgressSummaryService,
  getStreakService,
  getActivityService
} from '../services/progressService.js';

/**
 * @desc    Mark a question as solved or unsolved for authenticated user
 * @route   PUT /api/progress/:questionId
 * @access  Private (JWT required)
 */
export const updateQuestionProgress = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { solved } = req.body;
    const userId = req.user._id;

    if (typeof solved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Field "solved" must be a boolean (true or false)'
      });
    }

    const result = await markQuestionSolvedService(userId, questionId, solved);

    if (!result.found) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: solved ? 'Question marked as solved' : 'Question marked as unsolved',
      progress: result.progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get authenticated user's full progress list
 * @route   GET /api/progress
 * @access  Private (JWT required)
 */
export const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const progressRecords = await getUserProgressService(userId);

    return res.status(200).json({
      success: true,
      progress: progressRecords
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get progress status for a specific question for authenticated user
 * @route   GET /api/progress/:questionId
 * @access  Private (JWT required)
 */
export const getQuestionProgress = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user._id;

    const result = await getQuestionProgressService(userId, questionId);

    if (!result.found) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    return res.status(200).json({
      success: true,
      progress: result.progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get overall and category-wise progress summary for authenticated user
 * @route   GET /api/progress/summary
 * @access  Private (JWT required)
 */
export const getProgressSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const summary = await getProgressSummaryService(userId);

    return res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current streak, longest streak, and today activity status
 * @route   GET /api/progress/streak
 * @access  Private (JWT required)
 */
export const getStreak = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const streak = await getStreakService(userId);

    return res.status(200).json({
      success: true,
      streak
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent daily activity log for authenticated user
 * @route   GET /api/progress/activity
 * @access  Private (JWT required)
 */
export const getActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { days } = req.query;
    const activity = await getActivityService(userId, days);

    return res.status(200).json({
      success: true,
      activity
    });
  } catch (error) {
    next(error);
  }
};
