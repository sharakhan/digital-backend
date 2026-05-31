const Report = require("../models/Report");

/**
 * Submit a new report for a lesson.
 */
const createReport = async (reportData) => {
  const report = await Report.create(reportData);
  return report;
};

/**
 * Get all reports (admin use).
 */
const getAllReports = async () => {
  const reports = await Report.find()
    .populate("lessonId", "title authorEmail")
    .sort({ createdAt: -1 });
  return reports;
};

module.exports = { createReport, getAllReports };
