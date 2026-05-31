const express = require("express");
const router = express.Router();
const healthController = require("../controllers/healthController");

// GET /api/health — Server health check
router.get("/", healthController.getHealthStatus);

module.exports = router;
