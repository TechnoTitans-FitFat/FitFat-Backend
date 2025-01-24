const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  foodAllergies: [{ type: String }],
  diabetes: { type: Boolean, default: false },
  diabetesType: { type: String, enum: ["Type 1", "Type 2"] },
  insulinToCarbRatio: { type: Number },
  targetBloodSugarRange: { min: Number, max: Number },
});

module.exports = mongoose.model("HealthInfo", healthInfoSchema);
