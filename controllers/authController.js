const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  createUser: async (req, res) => {
    const {
      username,
      email,
      password,
      dietType,
      userType,
      dateOfBirth,
      genders,
      weight,
      height,
      phone,
    } = req.body;

    // const allowedDietTypes = ["High-Carb", "Low-Carb", "Vegan", "Ceto"];
    // if (!allowedDietTypes.includes(dietType)) {
    //   return res.status(400).json({
    //     message: `Invalid diet type. Choose one of: ${allowedDietTypes.join(
    //       ", "
    //     )}`,
    //   });
    // }

    const allowedUserTypes = ["Admin", "Driver", "Client", "Vendor"];
    if (!allowedUserTypes.includes(userType)) {
      return res.status(400).json({
        message: `Invalid user type. Choose one of: ${allowedUserTypes.join(
          ", "
        )}`,
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        userType: "Client",
        dietType,
        dateOfBirth,
        genders,
        weight,
        height,
        phone,
      });

      await newUser.save();

      return res.status(201).json({
        status: true,
        message: "User created successfully",
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

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, userType: user.userType },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { password: _, ...userData } = user._doc;
      res.status(200).json({ ...userData, token });
    } catch (error) {
      res.status(500).json({
        message: "Error logging in",
        error: error.message,
      });
    }
  },
};
