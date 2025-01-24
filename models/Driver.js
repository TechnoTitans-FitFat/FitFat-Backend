const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicleType: {
      type: String,
      require: true,
      enum: ["Bike", "Scooter", "car"],
    },
    vehicleNumber: { type: String, require: true },
    currentLocation: {
      Latitude: { type: Number, require: true },
      Longitude: { type: Number, require: true },
      LatitudeDelta: { type: Number, require: true, default: 0.0122 },
      LongitudeDelta: { type: Number, require: true, default: 0.0221 },
    },
    isAvailable: { type: Boolean, require: true },
    rating: { type: Number, require: true },
    totalDeliveries: { type: Number, default: 0 },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/djqyhkpq8/image/upload/v1733158083/FITFAT%20images/home%20suggestion%20recipes%20images/nosmwnybowcilrrzfvhp.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
