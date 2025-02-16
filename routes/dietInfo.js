const express = require("express");
const router = express.Router();
const dietInfoController = require("../controllers/dietInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", verifyToken, dietInfoController.createDietInfo);
router.get("/", verifyToken, dietInfoController.getDietInfo);
router.put("/", verifyToken, dietInfoController.updateDietInfo);

module.exports = router;
