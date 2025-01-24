const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [String],
  image: String,
  price: Number,
  calories: Number,
  protein: String,
  minerals: {
    iron: String,
    calcium: String,
    potassium: String,
  },
  time: { type: String },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  cookingTime: { type: String, required: true },
  ratingCount: { type: String },
});

//It became middleware to use it on diffrent files -> ( addFields )

// recipeSchema.virtual("cookingTime").get(function () {
//   return ${Math.floor(Math.random() * 46) + 15} min; // Random time between 15 and 60 minutes
// });

// recipeSchema.virtual("Rating").get(function () {
//   return Math.floor(Math.random() * 5) + 1; // Random rating between 1 and 5
// });

// recipeSchema.set("toJSON", { virtuals: true });
// recipeSchema.set("toObject", { virtuals: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
