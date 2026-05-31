const healthService = require("../services/healthService");

/**
 * @desc    Get server health status
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res, next) => {
  try {
    const status = healthService.checkHealth();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealthStatus };
