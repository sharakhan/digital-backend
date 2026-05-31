const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// All admin routes require Firebase auth + admin role
router.use(verifyFirebaseToken, verifyAdmin);

// GET    /api/admin/users          — Get all users
router.get("/users", adminController.getAllUsers);

// GET    /api/admin/lessons        — Get all lessons (including private)
router.get("/lessons", adminController.getAllLessons);

// DELETE /api/admin/lessons/:id    — Delete any lesson
router.delete("/lessons/:id", adminController.deleteLesson);

// GET    /api/admin/reports        — View all reports
router.get("/reports", adminController.getAllReports);

module.exports = router;
