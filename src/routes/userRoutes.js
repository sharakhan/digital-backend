const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyFirebaseToken = require("../middlewares/verifyFirebaseToken");

// All user routes require Firebase authentication
router.use(verifyFirebaseToken);

// POST /api/users/sync — Create or return existing user
router.post("/sync", userController.syncUser);

module.exports = router;
