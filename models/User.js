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
        "https://drive.google.com/file/d/1OXKBtXmOGFhR-tTqWFm-aNAlDIq_UmUS/view?usp=sharing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
