const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", verifyToken, userController.getUser);
router.put("/", verifyToken, userController.updateUser);
router.delete("/", verifyToken, userController.deleteUser);

module.exports = router;
