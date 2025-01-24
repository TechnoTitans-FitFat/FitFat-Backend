const { messaging } = require("firebase-admin");
const Order = require("../models/Order");

module.exports = {
  placeOrder: async (req, res) => {
    const order = new Order(req.body);

    try {
      await order.save();
      res
        .status(201)
        .json({ status: true, message: "Order placed successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getOrderDetails: async (req, res) => {
    const orderId = req.params.id;

    try {
      const order = await Order.findById(orderId)
        .populate({
          path: "userId",
          select: "name email phone",
        })
        .populate({
          path: "deliveryAddress",
          select: "addressLine1 city state postalCode",
        })
        .populate({
          path: "restaurantId",
          select: "name location",
        })
        .populate({
          path: "driverId",
          select: "name phone",
        });

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ status: false, message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: messaging.error });
    }
  },

  getUserOrders: async (req, res) => {
    const userId = req.user.Id;

    try {
      const orders = await Order.find({ userId })
        .populate({
          path: "restaurantId",
          select: "name location imageUrl",
        })
        .populate({
          path: "driverId",
          select: "name phone",
        });

      if (orders) {
        res.status(200).json(orders);
      } else {
        res.status(404).json({ status: false, message: "No orders found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: messaging.error });
    }
  },

  rateOrder: async (req, res) => {
    const orderId = req.params.id;
    const { rating, feedback } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          rating,
          feedback,
        },
        { new: true }
      );

      if (updatedOrder) {
        res
          .status(200)
          .json({ status: true, message: "Order rated successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to update order" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: messaging.error });
    }
  },

  updateOrderStatus: async (req, res) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );

      if (updatedOrder) {
        res
          .status(200)
          .json({ status: true, message: "Order status updated successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to update order" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: messaging.error });
    }
  },

  updatePaymentStatus: async (req, res) => {
    const orderId = req.params.id;
    const { paymentStatus } = req.body;

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );

      if (updatedOrder) {
        res.status(200).json({
          status: true,
          message: "Payment status updated successfully",
        });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Failed to update [payment]" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: messaging.error });
    }
  },
};
