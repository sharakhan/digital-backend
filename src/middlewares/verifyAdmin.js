const User = require("../models/User");

/**
 * Admin Authorization Middleware
 *
 * Must be used AFTER verifyFirebaseToken.
 * Checks if the authenticated user has role "admin" in MongoDB.
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.firebaseUser?.email;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No email found in token.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required.",
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error("❌ Admin verification failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error during admin verification.",
    });
  }
};

module.exports = verifyAdmin;
