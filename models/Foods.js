const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    foodTags: { type: Array, required: true },
    category: { type: String, required: true },
    code: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    foodType: { type: Array, required: true },
    cookingTime: { type: String, required: true },
    rating: { type: Number, required: true },
    ratingCount: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    additives: { type: Array, required: true },
    imageUrl: { type: Array, required: true },
  },

  { timestamps: false }
);

module.exports = mongoose.model("Food", foodSchema);
