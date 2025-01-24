const Cart = require("../models/Cart");
const Recipe = require("../models/recipe");

module.exports = {
  addProductToCart: async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity, additives, instructions } = req.body;

    try {
      const recipe = await Recipe.findById(productId);
      if (!recipe) {
        return res
          .status(404)
          .json({ status: false, message: "Recipe not found" });
      }

      const productPrice = Number(recipe.price);
      if (isNaN(productPrice)) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid price for recipe" });
      }

      let cartItem = await Cart.findOne({ UserId: userId, productId });

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.totalPrice = cartItem.quantity * productPrice;
        await cartItem.save();
      } else {
        cartItem = new Cart({
          UserId: userId,
          productId,
          additives: additives || [],
          instructions: instructions || "",
          totalPrice: productPrice * quantity,
          quantity,
        });
        await cartItem.save();
      }

      const cartItems = await Cart.find({ UserId: userId });
      const totalCartPrice = cartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      res.status(200).json({
        status: true,
        message: "Product added successfully",
        totalCartPrice,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeProductToCart: async (req, res) => {
    const itemId = req.params.id;
    const userId = req.user.id;

    try {
      const cartItem = await Cart.findById(itemId);

      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found in cart" });
      }

      await Cart.findByIdAndDelete(itemId);

      const cartItems = await Cart.find({ UserId: userId });
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);

      res.status(200).json({ status: true, cartCount: count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  fetchUserCart: async (req, res) => {
    const userId = req.user.id;

    try {
      const userCart = await Cart.find({ UserId: userId }).populate({
        path: "productId",
        select: "name price",
      });

      const totalCartPrice = userCart.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      res.status(200).json({
        status: true,
        cart: userCart.map((item) => ({
          _id: item._id,
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
        totalCartPrice,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  clearUserCart: async (req, res) => {
    const userId = req.user.id;

    try {
      await Cart.deleteMany({ UserId: userId });

      res
        .status(200)
        .json({ status: true, count: 0, message: "Cart cleared successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getCartCount: async (req, res) => {
    const userId = req.user.id;

    try {
      const cartItems = await Cart.find({ UserId: userId });
      const count = cartItems.reduce((total, item) => total + item.quantity, 0);

      res.status(200).json({ status: true, cartCount: count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  decrementProductQty: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
      if (!productId) {
        return res.status(400).json({
          status: false,
          message: "Product ID is required",
        });
      }

      const cartItem = await Cart.findOne({
        UserId: userId,
        productId: productId.trim(),
      });

      if (!cartItem) {
        return res.status(404).json({
          status: false,
          message: "Product not found in cart",
        });
      }

      if (cartItem.quantity === 1) {
        return res.status(200).json({
          status: false,
          message: "Cannot decrement. Only one item left in cart.",
          cartItem: { _id: cartItem._id, quantity: cartItem.quantity },
        });
      }

      const productPrice = cartItem.totalPrice / cartItem.quantity;
      cartItem.quantity -= 1;
      cartItem.totalPrice -= productPrice;
      await cartItem.save();

      return res.status(200).json({
        status: true,
        cartItem: { _id: cartItem._id, quantity: cartItem.quantity },
        message: "Product quantity decremented successfully",
      });
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }
  },
};
