const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", verifyToken, favoriteController.getFavorites);
router.post("/", verifyToken, favoriteController.addFavorite);
router.delete("/", verifyToken, favoriteController.removeFavorite);

module.exports = router;
