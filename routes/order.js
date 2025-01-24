const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyAndAuthorization } = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, orderController.placeOrder);

router.get("/:id", verifyAndAuthorization, orderController.getOrderDetails);

router.get(
  "/user-orders",
  verifyAndAuthorization,
  orderController.getUserOrders
);

router.put("/rate/:id", verifyAndAuthorization, orderController.rateOrder);

router.put(
  "/status/:id",
  verifyAndAuthorization,
  orderController.updateOrderStatus
);

router.put(
  "/payment-status/:id",
  verifyAndAuthorization,
  orderController.updatePaymentStatus
);

module.exports = router;
