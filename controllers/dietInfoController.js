const DietInfo = require("../models/dietInfo");

const User = require("../models/User");

exports.createDietInfo = async (req, res) => {
  const allowedDietTypes = ["High-Carb", "Low-Carb", "Vegan", "Keto"];
  if (!allowedDietTypes.includes(req.body.dietType)) {
    return res.status(400).json({
      message: `Invalid diet type. Choose one of: ${allowedDietTypes.join(
        ", "
      )}`,
    });
  }

  try {
    const existingDietInfo = await DietInfo.findOne({ userId: req.user.id });
    if (existingDietInfo) {
      return res.status(400).json({
        status: false,
        message: "Diet info already exists for this user",
      });
    }

    req.body.userId = req.user.id;
    const dietInfo = new DietInfo(req.body);
    await dietInfo.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { dietInfo: dietInfo._id },
    });

    res.status(201).json({
      status: true,
      message: "Diet info created successfully",
      dietInfo,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getDietInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const dietInfo = await DietInfo.findOne({ userId });
    if (!dietInfo) {
      return res.status(404).json({
        status: false,
        message: "Diet info not found",
      });
    }
    res.status(200).json({ status: true, dietInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateDietInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const dietInfo = await DietInfo.findOne({ userId });
    if (!dietInfo) {
      return res.status(404).json({
        status: false,
        message: "Diet info not found for this user",
      });
    }

    const updatedDietInfo = await DietInfo.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Diet info updated successfully",
      dietInfo: updatedDietInfo,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
