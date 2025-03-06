const express = require("express");
const router = express.Router();
const healthInfoController = require("../controllers/healthInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", verifyToken, healthInfoController.createHealthInfo);
router.get("/", verifyToken, healthInfoController.getHealthInfo);
router.put("/", verifyToken, healthInfoController.updateHealthInfo);

module.exports = router;
