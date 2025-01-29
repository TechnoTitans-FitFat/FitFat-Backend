const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  additives: { type: Array, default: [] },
  instructions: { type: String, default: "" },
  totalPrice: { type: Number },
  totalCalories: { type: Number },
  quantity: { type: Number, required: true },
});

module.exports = mongoose.model("Cart", cartSchema);
