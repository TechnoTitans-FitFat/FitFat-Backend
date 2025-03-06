const express = require("express");
const router = express.Router();
const healthInfoController = require("../controllers/healthInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", verifyToken, healthInfoController.createHealthInfo);
router.get("/", verifyToken, healthInfoController.getHealthInfo);
router.put("/", verifyToken, healthInfoController.updateHealthInfo);

// router.post("/:userId", healthInfoController.createHealthInfo);
// router.get("/:userId", healthInfoController.getHealthInfo);
// router.put("/:userId", healthInfoController.updateHealthInfo);

module.exports = router;
