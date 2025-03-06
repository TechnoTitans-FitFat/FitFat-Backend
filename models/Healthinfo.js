const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gender: {
    type: String,
    required: true,
    enum: ["female", "male"],
  },
  dateOfBirth: { type: Date, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  foodAllergies: [{ type: String }],
  diabetes: { type: Boolean, default: false },
  diabetesType: { type: String, enum: ["Type 1", "Type 2"] },
  insulinToCarbRatio: { type: Number },
  targetBloodSugarRange: { min: Number, max: Number },
});

module.exports =
  mongoose.models.HealthInfo || mongoose.model("HealthInfo", healthInfoSchema);
