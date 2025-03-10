const express = require("express");
const router = express.Router();
const dietInfoController = require("../controllers/dietInfoController");

router.post("/:userId", dietInfoController.createDietInfo);
router.get("/:userId", dietInfoController.getDietInfo);
router.put("/:userId", dietInfoController.updateDietInfo);

module.exports = router;
