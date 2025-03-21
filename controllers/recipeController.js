const Recipe = require("../models/recipe");
const { searchHistory } = require("../middleware/searchHistory");
const DietInfo = require("../models/Dietinfo");
const HealthInfo = require("../models/Healthinfo");

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
        rating,
      } = req.query;
      const skip = (page - 1) * limit;

      let conditions = [];

      if (type) {
        conditions.push({
          type: {
            $all: type
              .split(",")
              .map((val) => new RegExp(`^${val.trim()}$`, "i")),
          },
        });
      }
      if (category) {
        conditions.push({
          category: {
            $all: category
              .split(",")
              .map((val) => new RegExp(`^${val.trim()}$`, "i")),
          },
        });
      }
      if (diet) {
        conditions.push({
          diet: {
            $all: diet
              .split(",")
              .map((val) => new RegExp(`^${val.trim()}$`, "i")),
          },
        });
      }
      if (allergy) {
        conditions.push({
          allergy: {
            $all: allergy
              .split(",")
              .map((val) => new RegExp(`^${val.trim()}$`, "i")),
          },
        });
      }
      if (recipeClass) {
        conditions.push({
          class: {
            $all: recipeClass
              .split(",")
              .map((val) => new RegExp(`^${val.trim()}$`, "i")),
          },
        });
      }
      if (diabetes !== undefined) {
        conditions.push({ diabetes: diabetes === "true" });
      }
      if (rating) {
        conditions.push({ rating: Number(rating) });
      }

      const filter = conditions.length ? { $and: conditions } : {};

      const recipes = await Recipe.find(filter)
        .select("_id name image calories price rating cookingTime diet allergy")
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

      const recipesWithDefaults = recipes.map((recipe) => {
        const recipeObj = recipe.toObject();
        recipeObj.rating =
          recipeObj.rating || Math.floor(Math.random() * 5) + 1;
        recipeObj.cookingTime =
          recipeObj.cookingTime || `${Math.floor(Math.random() * 46) + 15} min`;
        return recipeObj;
      });

      res.status(200).json({
        totalRecipes,
        totalPages: Math.ceil(totalRecipes / limit),
        currentPage: parseInt(page),
        recipes: recipesWithDefaults,
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

    let conditions = [];

    if (name) {
      conditions.push({ name: { $regex: name, $options: "i" } });
    }
    if (type) {
      conditions.push({
        type: {
          $all: type
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        },
      });
    }
    if (category) {
      conditions.push({
        category: {
          $all: category
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        },
      });
    }
    if (diet) {
      conditions.push({
        diet: {
          $all: diet
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        },
      });
    }
    if (allergy) {
      conditions.push({
        allergy: {
          $all: allergy
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        },
      });
    }
    if (recipeClass) {
      conditions.push({
        class: {
          $all: recipeClass
            .split(",")
            .map((val) => new RegExp(`^${val.trim()}$`, "i")),
        },
      });
    }
    if (diabetes !== undefined) {
      conditions.push({ diabetes: diabetes === "true" });
    }

    const filter = conditions.length ? { $and: conditions } : {};

    if (!name && !type && !category && !diet && !allergy && !recipeClass) {
      return res.status(200).json({ searchHistory });
    }
    try {
      const recipes = await Recipe.find(filter)
        .select("_id name image calories price rating cookingTime diet allergy")
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found" });
      }

      res.status(200).json({
        totalRecipes,
        totalPages: Math.ceil(totalRecipes / limit),
        currentPage: parseInt(page),
        recipes: recipes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getRecipesByUserPreferences: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const dietInfo = await DietInfo.findOne({ userId });
      const healthInfo = await HealthInfo.findOne({ userId });

      if (!dietInfo || !healthInfo) {
        return res.status(404).json({
          message: "Diet or health information not found for the user",
        });
      }

      const dietTypeMapping = {
        "High-Carb": "high-carb",
        "Low-Carb": "low-carb",
        Vegan: "vegan",
        Keto: "keto",
      };
      const mappedDietType = dietTypeMapping[dietInfo.dietType] || "none";

      const recommendedCalories = dietInfo.macronutrientGoals?.calories;
      const isDiabetic = healthInfo.diabetes;

      let normalizedMealPreferences = [];
      if (dietInfo.mealPreferences && dietInfo.mealPreferences.length > 0) {
        normalizedMealPreferences = dietInfo.mealPreferences.map(
          (pref) => pref.charAt(0).toUpperCase() + pref.slice(1).toLowerCase()
        );
      }

      let conditions = [];
      conditions.push({
        diet: { $all: [new RegExp(`^${mappedDietType}$`, "i")] },
      });
      if (recommendedCalories) {
        conditions.push({
          calories: { $lte: recommendedCalories },
        });
      }
      if (isDiabetic) {
        conditions.push({ diabetes: true });
      }
      if (normalizedMealPreferences.length > 0) {
        conditions.push({
          class: {
            $in: normalizedMealPreferences.map(
              (pref) => new RegExp(`^${pref}$`, "i")
            ),
          },
        });
      }

      const filter = conditions.length ? { $and: conditions } : {};

      const recipes = await Recipe.find(filter)
        .select("_id name image calories price rating cookingTime")
        .skip(skip)
        .limit(parseInt(limit));

      const totalRecipes = await Recipe.countDocuments(filter);

      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found" });
      }

      res.status(200).json({
        totalRecipes,
        totalPages: Math.ceil(totalRecipes / limit),
        currentPage: parseInt(page),
        recipes: recipes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getRecipeById: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json(recipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
