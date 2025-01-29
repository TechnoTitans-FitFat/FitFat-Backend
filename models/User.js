const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    userType: {
      type: String,
      default: "Client",
      enum: ["Admin", "Driver", "Client", "Vendor"],
    },
    dietType: {
      type: String,
      default: "High-Carb",
      enum: ["High-Carb", "Low-Carb", "Vegan", "Ceto"],
      required: true,
    },
    genders: {
      type: String,
      default: "male",
      required: true,
      enum: ["female", "male"],
    },
    dateOfBirth: { type: Date },
    weight: { type: Number },
    height: { type: Number },
    healthInfo: { type: mongoose.Schema.Types.ObjectId, ref: "Healthinfo" },

    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipe" }],
    phone: { type: String, required: false },
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
