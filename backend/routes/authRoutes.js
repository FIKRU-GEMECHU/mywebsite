const express = require("express");
const router  = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register",                  registerUser);
router.post("/login",                     loginUser);
router.get("/me",          protect,       getMe);
router.post("/forgot-password",           forgotPassword);
router.get("/reset-password/:token",      verifyResetToken);
router.post("/reset-password/:token",     resetPassword);

module.exports = router;
