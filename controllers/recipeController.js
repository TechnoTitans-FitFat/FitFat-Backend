const Recipe = require("../models/recipe");
const { searchHistory } = require("../middleware/searchHistory");

module.exports = {
  getAllRecipes: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        category,
        diabetes,
        diet,
        allergy,
        recipeClass,
      } = req.query;
      const skip = (page - 1) * limit;

      let filter = {};

      if (type)
        filter.type = {
          $all: type
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };
      if (category)
        filter.category = {
          $all: category
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };
      if (diet)
        filter.diet = {
          $all: diet
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };
      if (allergy)
        filter.allergy = {
          $all: allergy
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };
      if (recipeClass)
        filter.class = {
          $all: recipeClass
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        };

      if (diabetes !== undefined) {
        filter.diabetes = diabetes === "true";
      }

      //console.log("getAllRecipes filter:", filter);

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
    const {
      name,
      type,
      category,
      page = 1,
      limit = 10,
      diabetes,
      diet,
      allergy,
      recipeClass,
    } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (type)
      filter.type = {
        $all: type.split(",").map((val) => new RegExp(`^${val.trim()}$`, "i")),
      };
    if (category)
      filter.category = {
        $all: category
          .split(",")
          .map((val) => new RegExp(`^${val.trim()}$`, "i")),
      };
    if (diet)
      filter.diet = {
        $all: diet.split(",").map((val) => new RegExp(`^${val.trim()}$`, "i")),
      };
    if (allergy)
      filter.allergy = {
        $all: allergy
          .split(",")
          .map((val) => new RegExp(`^${val.trim()}$`, "i")),
      };
    if (recipeClass)
      filter.class = {
        $all: recipeClass
          .split(",")
          .map((val) => new RegExp(`^${val.trim()}$`, "i")),
      };

    if (diabetes !== undefined) {
      filter.diabetes = diabetes === "true";
    }

    if (!name && !type && !category && !diet && !allergy && !recipeClass) {
      return res.status(200).json({ searchHistory });
    }

    //console.log("searchRecipes filter:", filter);

    //note: we need to determine how many documents to skip before fetching the next set of results.
    // This is where the skip calculation comes in.!!
    try {
      const recipes = await Recipe.find(filter)
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found" });
      }

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
};
