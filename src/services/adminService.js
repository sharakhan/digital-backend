const User = require("../models/User");
const Lesson = require("../models/Lesson");
const Report = require("../models/Report");

/**
 * Get all users.
 */
const getAllUsers = async () => {
  const users = await User.find().select("-__v").sort({ createdAt: -1 });
  return users;
};

/**
 * Get all lessons (regardless of visibility).
 */
const getAllLessons = async () => {
  const lessons = await Lesson.find().sort({ createdAt: -1 });
  return lessons;
};

/**
 * Delete any lesson by ID (admin override, no author check).
 */
const deleteLesson = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);

  if (!lesson) {
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
  }

  return lesson;
};

/**
 * Get all reports with populated lesson info.
 */
const getAllReports = async () => {
  const reports = await Report.find()
    .populate("lessonId", "title authorEmail")
    .sort({ createdAt: -1 });
  return reports;
};

module.exports = { getAllUsers, getAllLessons, deleteLesson, getAllReports };
