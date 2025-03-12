const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { logoutUser } = require("../middleware/verifyToken");

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/logout", logoutUser);

router.post("/verify-email", authController.verifyEmail);
router.post("/resend-otp", authController.resendOtp);

//forget password routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
