const User = require("../models/User");

module.exports = {
  getFavorites: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate("wishlist");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ favorites: user.wishlist });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving favorites",
        error: error.message,
      });
    }
  },

  addFavorite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { recipeId } = req.body;

      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.wishlist.includes(recipeId)) {
        return res.status(400).json({ message: "Recipe already in favorites" });
      }

      user.wishlist.push(recipeId);
      await user.save();

      res.status(200).json({
        message: "Recipe added to favorites",
        favorites: user.wishlist,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding favorite",
        error: error.message,
      });
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const userId = req.user.id;
      const { recipeId } = req.body;

      if (!recipeId) {
        return res.status(400).json({ message: "Recipe ID is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== recipeId.toString()
      );
      await user.save();

      res.status(200).json({
        message: "Recipe removed from favorites",
        favorites: user.wishlist,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error removing favorite",
        error: error.message,
      });
    }
  },
};
