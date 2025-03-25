const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gender: { type: String }, //, enum: ["female", "male"]
  dateOfBirth: { type: Date },
  weight: { type: Number },
  height: { type: Number },
  foodAllergies: { type: String },
  diabetes: { type: Boolean, default: false },
  diabetesType: { type: String }, //, enum: ["Type 1", "Type 2"]
  insulinToCarbRatio: { type: Number },
  targetBloodSugarRange: { min: Number, max: Number },
  correctionFactor: {type: Number}
});

const HealthInfo =
  mongoose.models.HealthInfo || mongoose.model("HealthInfo", healthInfoSchema);
module.exports = HealthInfo;
