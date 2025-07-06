const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const googleAuthDal = require("../dal/google-auth.dal");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

router.post("/token", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Missing ID token" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: payload.name,
        picture: payload.picture,
        userType: "Client",
      });
      console.log("Registered new Google user.");
    } else {
      console.log("Google user already exists.");
    }

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SEC,
      { expiresIn: "21d" }
    );

    res.json({
      message: "Authentication successful",
      token,
      id: user._id,
    });
  } catch (err) {
    console.error("Token verification failed", err);
    res.status(401).json({ message: "Invalid ID token" });
  }
});

module.exports = router;
