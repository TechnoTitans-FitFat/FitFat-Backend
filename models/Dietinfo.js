const mongoose = require("mongoose");

const dietInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dietType: { type: String }, //, enum: ["High-Carb", "Low-Carb", "Vegan", "Keto"]
  macronutrientGoals: {
    proteins: Number,
    carbs: Number,
    fats: Number,
    calories: Number,
  },
  dietaryGoals: {
    type: String,
  }, //,enum: ["Weight Loss", "Weight Gain", "Weight Maintenance", "Muscle Gain"],
  activityLevel: {
    type: String,
  }, //,enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
  mealPreferences: { type: String },
});

const DietInfo =
  mongoose.models.DietInfo || mongoose.model("DietInfo", dietInfoSchema);
module.exports = DietInfo;
