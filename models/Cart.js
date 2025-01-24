const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe", // Now referencing Recipe instead of Food
    required: true,
  },
  additives: { type: Array, default: [] },
  instructions: { type: String, default: "" },
  totalPrice: { type: Number },
  quantity: { type: Number, required: true },
});

// Populate productId with Recipe details when querying the Cart
cartSchema.pre(/^find/, function (next) {
  this.populate("productId");
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
