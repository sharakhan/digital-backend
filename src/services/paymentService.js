const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PREMIUM_PRICE_BDT = 1500;

/**
 * Create a Stripe Checkout Session for Premium upgrade.
 *
 * @param {string} email - The user's email
 * @param {string} userId - The MongoDB user ID
 * @returns {string} Checkout session URL
 */
const createCheckoutSession = async (email, userId) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    metadata: {
      userId,
    },
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Digital Life Lessons AI — Premium Upgrade",
            description: "One-time payment for lifetime Premium access",
          },
          unit_amount: PREMIUM_PRICE_BDT * 100, // Stripe expects amount in paisa
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
  });

  return session.url;
};

/**
 * Handle successful checkout by upgrading the user to Premium.
 *
 * @param {Object} session - Stripe checkout session object
 */
const handleCheckoutCompleted = async (session) => {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error("❌ Stripe webhook: No userId in session metadata");
    return;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isPremium: true },
    { new: true }
  );

  if (user) {
    console.log(`✅ Premium upgrade successful for: ${user.email}`);
  } else {
    console.error(`❌ Stripe webhook: User not found with ID: ${userId}`);
  }
};

module.exports = { createCheckoutSession, handleCheckoutCompleted };
