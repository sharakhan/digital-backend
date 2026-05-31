const { admin } = require("../config/firebase");

/**
 * Firebase Authentication Middleware
 *
 * Verifies the Firebase ID token from the Authorization header.
 * On success, attaches the decoded token to req.firebaseUser.
 *
 * Expected header format: Authorization: Bearer <idToken>
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided. Expected 'Bearer <token>' in Authorization header.",
    });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error("❌ Firebase token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token.",
    });
  }
};

module.exports = verifyFirebaseToken;
