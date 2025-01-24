const express = require("express");
const DietInfo = require("../models/Dietinfo");
const HealthInfo = require("../models/Healthinfo");
const User = require("../models/User");
const router = express.Router();

router.get("/calculateCalories/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const dietInfo = await DietInfo.findOne({ userId });
    const healthInfo = await HealthInfo.findOne({ userId });

    if (!dietInfo) {
      return res.status(404).json({
        status: false,
        message: "Diet info not found for the user",
      });
    }

    if (!healthInfo) {
      return res.status(404).json({
        status: false,
        message: "Health info not found for the user",
      });
    }

    // Extract data from dietInfo
    const { macronutrientGoals, activityLevel, dietaryGoals } = dietInfo;
    const { weight, height, age, genders } = User;

    if (!weight || !height || !age || !gender) {
      return res.status(400).json({
        status: false,
        message: "Weight, height, age, and gender are required",
      });
    }

    const activityMultipliers = {
      Sedentary: 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725,
    };

    const activityMultiplier = activityMultipliers[activityLevel];

    if (!activityMultiplier) {
      return res.status(400).json({
        status: false,
        message: "Invalid activity level",
      });
    }

    let BMR;
    if (genders === "male") {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calculate daily calorie intake based on activity level
    const caloriesIntake = BMR * activityMultiplier;

    // Adjust calories for dietary goals if necessary
    let adjustedCalories = caloriesIntake;
    if (dietaryGoals === "Weight Loss") {
      adjustedCalories -= 500; // Subtract 500 calories for weight loss
    } else if (dietaryGoals === "Weight Gain") {
      adjustedCalories += 500; // Add 500 calories for weight gain
    }

    res.status(200).json({
      status: true,
      message: "Calories intake and metabolism calculated successfully",
      data: {
        BMR: Math.round(BMR),
        caloriesIntake: Math.round(adjustedCalories),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
