const HealthInfo = require("../models/Healthinfo");

exports.createHealthInfo = async (req, res) => {
  try {
    const healthInfo = new HealthInfo(req.body);
    await healthInfo.save();
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
  const userId = req.params.id;

  try {
    const healthInfo = await HealthInfo.findOne({ userId });

    if (!healthInfo) {
      return res
        .status(404)
        .json({ status: false, message: "Health info not found" });
    }
    res.status(200).json({ status: true, healthInfo });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateHealthInfo = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updatedHealthInfo = await HealthInfo.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    if (!updatedHealthInfo) {
      return res
        .status(404)
        .json({ status: false, message: "Health info not found" });
    }

    res.status(200).json({
      status: true,
      message: "Health info updated successfully",
      healthInfo: updatedHealthInfo,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};
