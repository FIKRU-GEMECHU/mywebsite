const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ── Auth Routes ─────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ── User Profile ────────────────────────────
router.get("/me", protect, getMe);

// ── Password Reset ──────────────────────────
router.post("/forgot-password", forgotPassword);

// optional verification (before reset)
router.get("/reset-password/:token", verifyResetToken);

// reset password submit
router.post("/reset-password/:token", resetPassword);

module.exports = router;