const Recipe = require("../models/recipe");
const { searchHistory } = require("../middleware/searchHistory");

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.find({});
      const updatedRecipes = await res.locals.addFields(recipes);
      res.status(200).json(updatedRecipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchRecipes: async (req, res) => {
    const { name } = req.query;

    if (!name) {
      return res.status(200).json({ searchHistory });
    }

    try {
      const recipes = await Recipe.find({
        name: { $regex: name, $options: "i" },
      });

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found" });
      }

      const updatedRecipes = await res.locals.addFields(recipes);
      res.status(200).json(updatedRecipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
