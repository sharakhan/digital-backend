const paymentService = require("../services/paymentService");
const User = require("../models/User");

/**
 * @desc    Create a Stripe checkout session for Premium upgrade
 * @route   POST /api/payment/create-checkout-session
 * @access  Private
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const email = req.firebaseUser.email;

    // Find the MongoDB user to get their _id
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sync your account first.",
      });
    }

    if (user.isPremium) {
      return res.status(400).json({
        success: false,
        message: "You are already a Premium member.",
      });
    }

    const checkoutUrl = await paymentService.createCheckoutSession(
      email,
      user._id.toString()
    );

    res.status(200).json({
      success: true,
      url: checkoutUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stripe webhook handler for checkout events
 * @route   POST /api/payment/webhook
 * @access  Public (Stripe signature verified)
 */
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const Stripe = require("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("❌ Stripe webhook signature verification failed:", error.message);
    return res.status(400).json({ message: "Webhook signature verification failed" });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await paymentService.handleCheckoutCompleted(session);
  }

  // Return 200 to acknowledge receipt
  res.status(200).json({ received: true });
};

module.exports = { createCheckoutSession, stripeWebhook };
