const User = require("../models/User");

/**
 * Syncs a Firebase-authenticated user with MongoDB.
 * If the user already exists (matched by firebaseUID), returns them.
 * Otherwise, creates a new user document.
 *
 * @param {Object} firebaseUser - Decoded Firebase token data
 * @returns {Object} { user, isNewUser }
 */
const syncUser = async (firebaseUser) => {
  const { uid, name, email, picture } = firebaseUser;

  // Check if user already exists by Firebase UID
  let user = await User.findOne({ firebaseUID: uid });

  if (user) {
    return { user, isNewUser: false };
  }

  // Create new user
  user = await User.create({
    name: name || email?.split("@")[0] || "User",
    email,
    photoURL: picture || "",
    firebaseUID: uid,
  });

  return { user, isNewUser: true };
};

module.exports = { syncUser };
