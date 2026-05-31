const reportService = require("../services/reportService");

/**
 * @desc    Submit a report for a lesson
 * @route   POST /api/reports
 * @access  Private
 */
const createReport = async (req, res, next) => {
  try {
    const { lessonId, reason } = req.body;
    const reporterEmail = req.firebaseUser.email;

    const report = await reportService.createReport({
      lessonId,
      reporterEmail,
      reason,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    // Handle duplicate report (unique index violation)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this lesson.",
      });
    }
    next(error);
  }
};

module.exports = { createReport };
