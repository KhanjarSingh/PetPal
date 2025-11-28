const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyGoogleToken,
  getProfile,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-token", verifyGoogleToken);
router.get("/profile", authenticateToken, getProfile);

module.exports = router;
