const User = require("../models/User");

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(userId, {
        password: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        dietType: 0,
      }).populate("address");
      // .populate("healthInfo")
      // .populate("dietInfo");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user",
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        status: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting user",
        error: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.user.id;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        status: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating user",
        error: error.message,
      });
    }
  },
};
