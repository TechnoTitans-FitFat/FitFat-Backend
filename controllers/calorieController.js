const DietInfo = require("../models/Dietinfo");
const HealthInfo = require("../models/Healthinfo");
const User = require("../models/User");

exports.calculateCalories = async (req, res) => {
  const userId = req.params.userId;

  try {
    const dietInfo = await DietInfo.findOne({ userId });
    const healthInfo = await HealthInfo.findOne({ userId });

    if (!dietInfo) {
      return res
        .status(404)
        .json({ status: false, message: "Diet info not found for the user" });
    }

    if (!healthInfo) {
      return res
        .status(404)
        .json({ status: false, message: "Health info not found for the user" });
    }

    // Calculate age from date of birth
    const birthDate = new Date(healthInfo.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (!healthInfo.weight || !healthInfo.height || !healthInfo.gender) {
      return res.status(400).json({
        status: false,
        message: "Weight, height, and gender are required",
      });
    }

    // Activity Level Multipliers
    const activityMultipliers = {
      Sedentary: 1.2,
      "Lightly Active": 1.375,
      "Moderately Active": 1.55,
      "Very Active": 1.725,
    };

    const activityMultiplier = activityMultipliers[dietInfo.activityLevel];
    if (!activityMultiplier) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid activity level" });
    }

    // Calculate BMR (Basal Metabolic Rate)
    let BMR;
    if (healthInfo.gender === "male") {
      BMR = 10 * healthInfo.weight + 6.25 * healthInfo.height - 5 * age + 5;
    } else {
      BMR = 10 * healthInfo.weight + 6.25 * healthInfo.height - 5 * age - 161;
    }

    let adjustedCalories = BMR * activityMultiplier;

    if (dietInfo.dietaryGoals === "Weight Loss") {
      adjustedCalories -= 500; // Subtract 500 calories for weight loss
    } else if (dietInfo.dietaryGoals === "Weight Gain") {
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
    res.status(500).json({ status: false, message: error.message });
  }
};
