const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// POST /api/reports — Submit a report (authenticated users only)
router.post("/", verifyFirebaseToken, reportController.createReport);

module.exports = router;
