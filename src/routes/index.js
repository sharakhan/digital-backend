const express = require("express");
const router = express.Router();

const healthRoutes = require("./healthRoutes");
const userRoutes = require("./userRoutes");
const lessonRoutes = require("./lessonRoutes");
const reportRoutes = require("./reportRoutes");
const adminRoutes = require("./adminRoutes");
const paymentRoutes = require("./paymentRoutes");

// Mount route modules
router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/lessons", lessonRoutes);
router.use("/reports", reportRoutes);
router.use("/admin", adminRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
