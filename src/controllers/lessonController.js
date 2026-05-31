const lessonService = require("../services/lessonService");

/**
 * @desc    Create a new lesson
 * @route   POST /api/lessons
 * @access  Private
 */
const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(req.body);

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a lesson by ID
 * @route   PUT /api/lessons/:id
 * @access  Private (author only)
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorEmail = req.firebaseUser.email;

    const lesson = await lessonService.updateLesson(id, authorEmail, req.body);

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lesson by ID
 * @route   DELETE /api/lessons/:id
 * @access  Private (author only)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorEmail = req.firebaseUser.email;

    await lessonService.deleteLesson(id, authorEmail);

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all lessons by a specific author
 * @route   GET /api/lessons/author/:email
 * @access  Private
 */
const getLessonsByAuthor = async (req, res, next) => {
  try {
    const { email } = req.params;
    const lessons = await lessonService.getLessonsByAuthor(email);

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
 * @desc    Get a single lesson by ID
 * @route   GET /api/lessons/:id
 * @access  Public
 */
const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await lessonService.getLessonById(id);

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public lessons with search, filter, sort, pagination
 * @route   GET /api/lessons
 * @access  Public
 */
const getPublicLessons = async (req, res, next) => {
  try {
    const { search, category, tone, sortBy, page, limit } = req.query;

    const result = await lessonService.getPublicLessons({
      search,
      category,
      tone,
      sortBy,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      count: result.lessons.length,
      pagination: result.pagination,
      data: result.lessons,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByAuthor,
  getLessonById,
  getPublicLessons,
};
