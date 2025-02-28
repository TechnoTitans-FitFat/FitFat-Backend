const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      default: "Client",
      enum: ["Admin", "Driver", "Client", "Vendor"],
    },
    healthInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "HealthInfo" }],
    dietInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "DietInfo" }],
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    phone: { type: String },
    profile: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/djqyhkpq8/image/upload/v1740751386/user-removebg-preview_isr57q.png",
    },
    // isVerified: { type: Boolean, default: false },
    // verificationCode: { type: String },
    // verificationCodeExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
