const express = require("express");
const router = express.Router();
const healthInfoController = require("../controllers/healthInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", healthInfoController.createHealthInfo);
router.put("/:id", healthInfoController.updateHealthInfo);
router.get("/:id", healthInfoController.getHealthInfo);

module.exports = router;
