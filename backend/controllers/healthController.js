/**
 * @desc    Get API health status
 * @route   GET /api/health
 * @access  Public
 */
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PrepForge API is running'
  });
};
