const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // time: { type: String }, // Time will be set dynamically
    foods: { type: Array },
    imgUrl: { type: String },
    userType: {
      type: String,
      default: "Client",
      enum: ["Admin", "Driver", "Client", "Vendor"],
    },
    pickup: { type: Boolean, required: true, default: true },
    delivery: { type: Boolean, required: true, default: true },
    owner: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    code: { type: String, required: true },
    logoUrl: {
      type: String,
      required: true,
      default:
        "https://drive.google.com/file/d/1OXKBtXmOGFhR-tTqWFm-aNAlDIq_UmUS/view?usp=sharing",
    },
    // rating: { type: Number, required: true }, // rating will be set dynamically
    ratingCount: { type: String },
    time: { type: String, required: true },
    coords: {
      id: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      latitudeDelta: { type: Number, required: true, default: 0.0212 },
      longitudeDelta: { type: Number, required: true, default: 0.0221 },
      address: { type: String, required: true },
      title: { type: String, required: true },
    },
  },
  { timestamps: true }
);

restaurantSchema.pre("save", function (next) {
  if (!this.time) {
    const randomTime = `${Math.floor(Math.random() * 46) + 15} min`;
    this.time = randomTime;
  }

  if (!this.rating) {
    const randomRating = Math.floor(Math.random() * 5) + 1;
    this.rating = randomRating;
  }

  next();
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
