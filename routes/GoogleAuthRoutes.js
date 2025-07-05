const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const googleAuthDal = require("../dal/google-auth.dal");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  async (req, res) => {
    try {
      const email = req.user?.emails?.[0]?.value;
      if (!email) return res.redirect("/auth/google/error");

      const { failure, success } = await googleAuthDal.registerWithGoogle(
        req.user
      );
      if (failure) {
        console.warn("Google user already exists.");
      } else {
        console.log("Registering new Google user.");
      }

      const userRecord = await User.findOne({ email });
      if (!userRecord) return res.redirect("/auth/google/error");

      const token = jwt.sign(
        { id: userRecord._id, userType: userRecord.userType },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      res.json({
        message: "Authentication successful",
        token,
        id: userRecord._id,
      });

      // cookie version
      // res.cookie("token", token, { httpOnly: true, secure: true }).redirect("/dashboard");
    } catch (err) {
      console.error("Error during Google callback:", err);
      res.redirect("/auth/google/error");
    }
  }
);

router.get("/error", (req, res) =>
  res.status(401).json({ message: "Error logging in via Google" })
);

router.get("/signout", (req, res) => {
  try {
    req.session?.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      else console.log("Session destroyed.");
    });
    res.clearCookie("token"); // if using cookie-based JWT
    res.json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to sign out user" });
  }
});

module.exports = router;
