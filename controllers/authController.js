const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const sendOtpEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP for Email Verification",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px; text-align: center;">
      <h2 style="color: #333;">Email Verification</h2>
      <p style="font-size: 16px;">
        Your OTP is <span style="color: red; font-weight: bold;">${otp}</span>
      </p>
      <p style="font-size: 14px; color: #777;">
        It will expire in 10 minutes.
      </p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP email:", error);
    } else {
      console.log("OTP email sent:", info.response);
    }
  });
};

const sendWelcomeEmail = (email, username) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Welcome to FitFat Family!",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
      <h1 style="color: red;">Welcome to FitFat Family!</h1>
      <p style="font-size: 16px; color: #333;">Hi ${username},</p>
      <p style="font-size: 16px; color: #333;">
        Thank you for verifying your email and joining us!
      </p>
      <p style="font-size: 14px; color: #555;">Place for Everyone</p>
    </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending welcome email:", error);
    } else {
      console.log("Welcome email sent:", info.response);
    }
  });
};

module.exports = {
  createUser: async (req, res) => {
    const { username, email, password, confirmPassword, userType } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message:
          "Please provide name, email, password, confirmPassword, and userType.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    //user Types -> will use in future
    // const allowedUserTypes = ["Admin", "Driver", "Client", "Vendor"];
    // if (!allowedUserTypes.includes(userType)) {
    //   return res.status(400).json({
    //     message: `Invalid user type. Choose one of: ${allowedUserTypes.join(
    //       ", "
    //     )}.`,
    //   });
    // }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email is already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // 10 minutes
      const otpExpires = Date.now() + 10 * 60 * 1000;

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        userType,
        verificationCode: otp,
        verificationCodeExpires: otpExpires,
      }); //<-userType,

      await newUser.save();
      sendOtpEmail(email, otp);

      return res.status(201).json({
        status: true,
        message:
          "User created successfully. Please verify your email with the OTP sent.",
        userId: newUser._id,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error saving user to database",
        error: error.message,
      });
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      if (!user.isVerified) {
        return res.status(401).json({ message: "Email not verified." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user._id, userType: user.userType },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { password: _, ...userData } = user._doc;

      return res.status(200).json({ ...userData, token });
    } catch (error) {
      return res.status(500).json({
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  //otp verify
  verifyEmail: async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Please provide both email and OTP.",
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (
        user.verificationCode !== otp ||
        user.verificationCodeExpires < Date.now()
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      sendWelcomeEmail(user.email, user.username);

      return res.status(200).json({
        status: true,
        message: "Email verified successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error verifying email",
        error: error.message,
      });
    }
  },

  resendOtp: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please provide your email address.",
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000;
      user.verificationCode = otp;
      user.verificationCodeExpires = otpExpires;
      await user.save();

      sendOtpEmail(email, otp);

      return res.status(200).json({
        status: true,
        message: "OTP resent successfully. Please check your email.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error resending OTP",
        error: error.message,
      });
    }
  },

  //forget password

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide your email address." });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

      user.resetPasswordCode = otp;
      user.resetPasswordExpires = otpExpires;
      await user.save();

      sendOtpEmail(
        email,
        otp,
        "Your OTP for Password Reset",
        "Password Reset",
        "Your OTP for password reset is"
      );

      return res.status(200).json({
        status: true,
        message: "OTP for password reset sent to your email.",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error processing request",
        error: error.message,
      });
    }
  },

  verifyResetOtp: async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP." });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // console.log("DEBUG: Stored OTP:", user.resetPasswordCode);
      // console.log(
      //   "DEBUG: OTP Expires at:",
      //   new Date(user.resetPasswordExpires)
      // );
      // console.log("DEBUG: Provided OTP:", otp);
      // console.log("DEBUG: Current Time:", new Date());

      if (
        !user.resetPasswordCode ||
        user.resetPasswordCode !== otp ||
        user.resetPasswordExpires < Date.now()
      ) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, {
        expiresIn: "15m",
      });
      return res.status(200).json({ resetToken });
    } catch (error) {
      return res.status(500).json({
        message: "Error verifying OTP",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please provide newPassword and confirmPassword." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No reset token provided." });
    }
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SEC);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      user.resetPasswordCode = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res
        .status(200)
        .json({ status: true, message: "Password reset successfully." });
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired reset token.",
        error: error.message,
      });
    }
  },
};
