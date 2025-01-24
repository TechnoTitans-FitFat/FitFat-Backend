const express = require("express");
const router = express.Router();
const dietInfoController = require("../controllers/dietInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", dietInfoController.createDietInfo);
router.put("/:id", dietInfoController.updateDietInfo);
router.get("/:id", verifyToken, dietInfoController.getDietInfo);

module.exports = router;
