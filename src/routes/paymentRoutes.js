const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// POST /api/payment/create-checkout-session — Generate Stripe checkout URL
router.post(
  "/create-checkout-session",
  verifyFirebaseToken,
  paymentController.createCheckoutSession
);

// POST /api/payment/webhook — Stripe webhook (uses raw body, no auth)
// NOTE: This route needs express.raw() middleware, applied in index.js
router.post("/webhook", paymentController.stripeWebhook);

module.exports = router;
