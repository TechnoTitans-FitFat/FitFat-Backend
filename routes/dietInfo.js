const express = require("express");
const router = express.Router();
const dietInfoController = require("../controllers/dietInfoController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/", verifyToken, dietInfoController.createDietInfo);
router.get("/", verifyToken, dietInfoController.getDietInfo);
router.put("/", verifyToken, dietInfoController.updateDietInfo);

// router.post("/:userId", dietInfoController.createDietInfo);
// router.get("/:userId", dietInfoController.getDietInfo);
// router.put("/:userId", dietInfoController.updateDietInfo);

module.exports = router;
