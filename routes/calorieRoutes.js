const express = require("express");
const router = express.Router();
const calorieController = require("../controllers/calorieController");

router.get("/calculateCalories/:userId", calorieController.calculateCalories);

module.exports = router;
