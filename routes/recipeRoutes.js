const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const addFields = require("../middleware/addFields");
const { trackSearchHistory } = require("../middleware/searchHistory");
const { verifyAndAuthorization } = require("../middleware/verifyToken");

router.use(addFields);

router.get("/", recipeController.getAllRecipes);
router.get("/search", trackSearchHistory, recipeController.searchRecipes);

router.get(
  "/user-preferences",
  verifyAndAuthorization,
  recipeController.getRecipesByUserPreferences
);

router.get("/:id", recipeController.getRecipeById);

module.exports = router;
