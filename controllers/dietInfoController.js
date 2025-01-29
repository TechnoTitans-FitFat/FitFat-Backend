const DietInfo = require("../models/Dietinfo");
const User = require("../models/User");
exports.createDietInfo = async (req, res) => {
  try {
    const dietInfo = new DietInfo(req.body);
    await dietInfo.save();
    res.status(201).json({
      status: true,
      message: "Diet info created successfully",
      dietInfo,
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { dietInfo: dietInfo._id },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getDietInfo = async (req, res) => {
  const userId = req.params.id;

  try {
    const dietInfo = await DietInfo.findOne({ userId });

    if (!dietInfo) {
      return res
        .status(404)
        .json({ status: false, message: "Diet info not found" });
    }

    res.status(200).json({ status: true, dietInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateDietInfo = async (req, res) => {
  try {
    const dietInfo = await DietInfo.findOne({ userId: req.params.id });

    if (!dietInfo) {
      return res.status(404).json({
        status: false,
        message: "Diet info not found for this user",
      });
    }

    const updatedDietInfo = await DietInfo.findOneAndUpdate(
      { userId: req.params.id },
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
