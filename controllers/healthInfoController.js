const HealthInfo = require("../models/Healthinfo");
const User = require("../models/User");

exports.createHealthInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const existingHealthInfo = await HealthInfo.findOne({ userId });
    if (existingHealthInfo) {
      return res.status(400).json({
        status: false,
        message: "Health info already exists for this user",
      });
    }

    req.body.userId = userId;
    const healthInfo = new HealthInfo(req.body);
    await healthInfo.save();

    await User.findByIdAndUpdate(userId, {
      $push: { healthInfo: healthInfo._id },
    });

    res.status(201).json({
      status: true,
      message: "Health info created successfully",
      healthInfo,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getHealthInfo = async (req, res) => {
  const userId = req.params.userId;

  try {
    const healthInfo = await HealthInfo.findOne({ userId });
    if (!healthInfo) {
      return res.status(404).json({
        status: false,
        message: "Health info not found",
      });
    }
    res.status(200).json({ status: true, healthInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateHealthInfo = async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body;

  try {
    const updatedHealthInfo = await HealthInfo.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedHealthInfo) {
      return res.status(404).json({
        status: false,
        message: "Health info not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Health info updated successfully",
      healthInfo: updatedHealthInfo,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
