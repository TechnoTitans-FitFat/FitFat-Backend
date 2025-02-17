const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const googleAuthDal = require("../dal/google-auth.dal");
const jwt = require("jsonwebtoken");

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  async (req, res) => {
    const { failure, success } = await googleAuthDal.registerWithGoogle(
      req.user
    );
    if (failure) {
      console.log("Google user already exists in DB.");
    } else {
      console.log("Registering new Google user.");
    }

    const User = require("../models/User");
    const userRecord = await User.findOne({
      email: req.user.emails[0].value,
    });
    if (!userRecord) {
      return res.redirect("/auth/google/error");
    }

    const token = jwt.sign(
      { id: userRecord._id, userType: userRecord.userType },
      process.env.JWT_SEC,
      { expiresIn: "21d" }
    );

    res.json({ message: "Authentication successful", token });
  }
);

router.get("/error", (req, res) =>
  res.status(401).json({ message: "Error logging in via Google" })
);

router.get("/signout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) console.log(err);
      console.log("Session destroyed.");
    });
    res.json({ message: "Signed out successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to sign out user" });
  }
});

module.exports = router;
