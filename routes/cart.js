const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, cartController.addProductToCart);
router.post(
  "/decrement",
  verifyAndAuthorization,
  cartController.decrementProductQty
);
router.delete(
  "/delete",
  verifyAndAuthorization,
  cartController.removeProductFromCart
);
router.get("/", verifyAndAuthorization, cartController.fetchUserCart);
router.get("/count", verifyAndAuthorization, cartController.getCartCount);
router.delete("/clear", verifyAndAuthorization, cartController.clearUserCart);

router.post(
  "/calories/difference",
  verifyAndAuthorization,
  cartController.calculateAndFetchCalorieDifference
);
module.exports = router;
