const Recipe = require("../models/recipe");
const { searchHistory } = require("../middleware/searchHistory");

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const { page = 1, limit = 10, type, category, diabetes } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};
      if (type) filter.type = { $in: type.split(",") };
      if (category) filter.category = { $in: category.split(",") };

      if (diabetes !== undefined) {
        filter.diabetes = diabetes === "true";
      }

      //note: we need to determine how many documents to skip before fetching the next set of results.
      // This is where the skip calculation comes in.!!

      const recipes = await Recipe.find(filter)
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

      const updatedRecipes = res.locals.addFields
        ? await res.locals.addFields(recipes)
        : recipes;

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
    const { name, type, category, page = 1, limit = 10, diabetes } = req.query;
    const skip = (page - 1) * limit;

    let filter = { name: { $regex: name, $options: "i" } };

    if (type) filter.type = { $in: type.split(",") };
    if (category) filter.category = { $in: category.split(",") };

    if (diabetes !== undefined) {
      filter.diabetes = diabetes === "true";
    }

    if (!name && !type && !category) {
      return res.status(200).json({ searchHistory });
    }

    try {
      const recipes = await Recipe.find(filter)
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

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
