const express = require("express");
const router = express.Router();
const healthInfoController = require("../controllers/healthInfoController");

router.post("/:userId", healthInfoController.createHealthInfo);
router.get("/:userId", healthInfoController.getHealthInfo);
router.put("/:userId", healthInfoController.updateHealthInfo);

module.exports = router;
