const Lesson = require("../models/Lesson");

/**
 * Create a new lesson.
 */
const createLesson = async (lessonData) => {
  const lesson = await Lesson.create(lessonData);
  return lesson;
};

/**
 * Update a lesson by ID.
 * Only the original author (matched by email) can update.
 */
const updateLesson = async (lessonId, authorEmail, updateData) => {
  const lesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, "author.email": authorEmail },
    updateData,
    { new: true, runValidators: true }
  );

  if (!lesson) {
    const error = new Error(
      "Lesson not found or you are not authorized to update it"
    );
    error.statusCode = 404;
    throw error;
  }

  return lesson;
};

/**
 * Delete a lesson by ID.
 * Only the original author (matched by email) can delete.
 */
const deleteLesson = async (lessonId, authorEmail) => {
  const lesson = await Lesson.findOneAndDelete({
    _id: lessonId,
    "author.email": authorEmail,
  });

  if (!lesson) {
    const error = new Error(
      "Lesson not found or you are not authorized to delete it"
    );
    error.statusCode = 404;
    throw error;
  }

  return lesson;
};

/**
 * Get all lessons by a specific author email.
 */
const getLessonsByAuthor = async (authorEmail) => {
  const lessons = await Lesson.find({ "author.email": authorEmail }).sort({ createdAt: -1 });
  return lessons;
};

/**
 * Get a single lesson by ID
 */
const getLessonById = async (lessonId) => {
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
  }
  return lesson;
};

/**
 * Get public lessons with search, filter, sort, and pagination.
 *
 * @param {Object} options
 * @param {string} [options.search]        - Search by title (case-insensitive partial match)
 * @param {string} [options.category]      - Filter by category
 * @param {string} [options.tone]          - Filter by emotional tone
 * @param {string} [options.sortBy]        - "newest" (default) or "mostSaved"
 * @param {number} [options.page]          - Page number (default 1)
 * @param {number} [options.limit]         - Items per page (default 10, max 50)
 */
const getPublicLessons = async (options = {}) => {
  const {
    search,
    category,
    tone,
    sortBy = "newest",
    page = 1,
    limit = 10,
  } = options;

  // Base filter: only public lessons
  const filter = { visibility: "Public" };

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Tone filter
  if (tone) {
    filter.tone = tone;
  }

  // Title search (case-insensitive partial match)
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // Sort options
  const sortOptions = {};
  if (sortBy === "mostSaved") {
    sortOptions.favoritesCount = -1;
    sortOptions.createdAt = -1; // secondary sort for ties
  } else {
    // Default: newest first
    sortOptions.createdAt = -1;
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Execute query + count in parallel
  const [lessons, totalCount] = await Promise.all([
    Lesson.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
    Lesson.countDocuments(filter),
  ]);

  return {
    lessons,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalItems: totalCount,
      itemsPerPage: limitNum,
    },
  };
};

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByAuthor,
  getLessonById,
  getPublicLessons,
};
