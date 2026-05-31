const userService = require("../services/userService");

/**
 * @desc    Sync Firebase user with MongoDB (create or return existing)
 * @route   POST /api/users/sync
 * @access  Private (requires Firebase token)
 */
const syncUser = async (req, res, next) => {
  try {
    const firebaseUser = req.firebaseUser;

    const { user, isNewUser } = await userService.syncUser(firebaseUser);

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser
        ? "User created successfully"
        : "User already exists",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { syncUser };
