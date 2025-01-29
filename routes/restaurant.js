const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const { verifyToken, verifyVendor } = require("../middleware/verifyToken");
const { trackSearchHistory } = require("../middleware/searchHistory");

router.post("/", verifyToken, restaurantController.addRestaurant);

router.get("/byId/:id", restaurantController.getRestaurant);

router.get("/:code", restaurantController.getRandomRestaurant);

router.get("/", trackSearchHistory, restaurantController.searchRestaurant);

router.delete("/:id", verifyToken, restaurantController.deleteRestaurant);

router.patch("/:id", restaurantController.serviceAvaibility);

module.exports = router;
