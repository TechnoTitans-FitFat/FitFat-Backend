const express = require("express");
const router = express.Router();

const driverController = require("../controllers/driverController");
const {
  verifyAndAuthorization,
  verifyDriver,
} = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, driverController.registerDriver);
router.patch("/", verifyDriver, driverController.setDriverAvailability);
router.get("/:id", driverController.getDriverInfo);

module.exports = router;
