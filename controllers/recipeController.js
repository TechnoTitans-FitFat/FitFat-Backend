const Recipe = require("../models/recipe");
const { searchHistory } = require("../middleware/searchHistory");

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      //note: we need to determine how many documents to skip before fetching the next set of results.
      // This is where the skip calculation comes in.!!

      const recipes = await Recipe.find({}).skip(skip).limit(parseInt(limit));
      const totalRecipes = await Recipe.countDocuments();

      const updatedRecipes = await res.locals.addFields(recipes);

      res.status(200).json({
        totalRecipes,
        totalPages: Math.ceil(totalRecipes / limit),
        currentPage: parseInt(page),
        recipes: updatedRecipes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchRecipes: async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!name) {
      return res.status(200).json({ searchHistory });
    }

    try {
      const recipes = await Recipe.find({
        name: { $regex: name, $options: "i" },
      })
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments({
        name: { $regex: name, $options: "i" },
      });

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found" });
      }

      const updatedRecipes = await res.locals.addFields(recipes);

      res.status(200).json({
        totalRecipes,
        totalPages: Math.ceil(totalRecipes / limit),
        currentPage: parseInt(page),
        recipes: updatedRecipes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
