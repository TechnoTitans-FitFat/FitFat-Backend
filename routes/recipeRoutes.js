const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const addFields = require("../middleware/addFields");
const { trackSearchHistory } = require("../middleware/searchHistory");

router.use(addFields);

router.get("/", recipeController.getAllRecipes);
router.get("/search", trackSearchHistory, recipeController.searchRecipes);
router.get("/:id", recipeController.getRecipeById);

module.exports = router;
