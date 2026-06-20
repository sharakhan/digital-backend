const adminService = require("../services/adminService");

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lessons (including private)
 * @route   GET /api/admin/lessons
 * @access  Admin only
 */
const getAllLessons = async (req, res, next) => {
  try {
    const lessons = await adminService.getAllLessons();

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete any lesson by ID (admin override)
 * @route   DELETE /api/admin/lessons/:id
 * @access  Admin only
 */
const deleteLesson = async (req, res, next) => {
  try {
    await adminService.deleteLesson(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lesson deleted by admin",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/admin/reports
 * @access  Admin only
 */
const getAllReports = async (req, res, next) => {
  try {
    const reports = await adminService.getAllReports();

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getAllUsers, getAllLessons, deleteLesson, getAllReports };
