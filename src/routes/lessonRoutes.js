const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// ─── Public Routes ──────────────────────────────────────────────
// GET /api/lessons/:id — Get a single lesson by ID
router.get("/:id", lessonController.getLessonById);

// GET /api/lessons — Browse public lessons (search, filter, sort, paginate)
router.get("/", lessonController.getPublicLessons);

// ─── Protected Routes (require Firebase auth) ──────────────────
// POST   /api/lessons          — Create a new lesson
router.post("/", verifyFirebaseToken, lessonController.createLesson);

// PUT    /api/lessons/:id      — Update a lesson (author only)
router.put("/:id", verifyFirebaseToken, lessonController.updateLesson);

// DELETE /api/lessons/:id      — Delete a lesson (author only)
router.delete("/:id", verifyFirebaseToken, lessonController.deleteLesson);

// GET    /api/lessons/author/:email — Get lessons by author
router.get("/author/:email", verifyFirebaseToken, lessonController.getLessonsByAuthor);

module.exports = router;
