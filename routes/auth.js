const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { logoutUser } = require("../middleware/verifyToken");

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/logout", logoutUser);

module.exports = router;
