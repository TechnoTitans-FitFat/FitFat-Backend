const Cart = require("../models/Cart");
const Recipe = require("../models/recipe");
const User = require("../models/User");
const DietInfo = require("../models/Dietinfo");

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

      const productPrice =
        recipe.offerPrice && Number(recipe.offerPrice) > 0
          ? Number(recipe.offerPrice)
          : Number(recipe.price);
      const productCalories = Number(recipe.calories);

      if (isNaN(productPrice) || isNaN(productCalories)) {
        return res.status(400).json({
          status: false,
          message: "Invalid price or calories for recipe",
        });
      }

      let cartItem = await Cart.findOne({ UserId: userId, productId });

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.totalPrice = Number(
          (cartItem.quantity * productPrice).toFixed(2)
        );
        cartItem.totalCalories = cartItem.quantity * productCalories;
        await cartItem.save();
      } else {
        cartItem = new Cart({
          UserId: userId,
          productId,
          additives: additives || [],
          instructions: instructions || "",
          totalPrice: Number((productPrice * quantity).toFixed(2)),
          totalCalories: productCalories * quantity,
          quantity,
        });
        await cartItem.save();
      }

      const cartItems = await Cart.find({ UserId: userId });

      const totalCartPrice = Number(
        cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
      );
      const totalCartCalories = cartItems.reduce(
        (sum, item) => sum + item.totalCalories,
        0
      );

      res.status(200).json({
        status: true,
        message: "Product added successfully",
        totalCartPrice,
        totalCartCalories,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeProductFromCart: async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "Product ID is required" });
    }

    try {
      const cartItem = await Cart.findOne({
        UserId: userId,
        productId: productId.trim(),
      });
      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found in cart" });
      }

      await Cart.findByIdAndDelete(cartItem._id);

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
        select: "name price offerPrice calories",
      });

      const updatedCart = userCart.map((item) => {
        const product = item.productId;
        const appliedPrice =
          product.offerPrice && Number(product.offerPrice) > 0
            ? Number(product.offerPrice)
            : product.price;

        const formattedTotalPrice = Number(
          (appliedPrice * item.quantity).toFixed(2)
        );
        const formattedTotalCalories = Number(
          (product.calories * item.quantity).toFixed(2)
        );

        return {
          _id: item._id,
          productId: product._id,
          name: product.name,
          price: appliedPrice,
          calories: product.calories,
          quantity: item.quantity,
          totalPrice: formattedTotalPrice,
          totalCalories: formattedTotalCalories,
        };
      });

      const totalCartPrice = Number(
        updatedCart.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)
      );
      const totalCartCalories = updatedCart.reduce(
        (sum, item) => sum + item.totalCalories,
        0
      );

      res.status(200).json({
        status: true,
        cart: updatedCart,
        totalCartPrice,
        totalCartCalories,
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
        return res
          .status(400)
          .json({ status: false, message: "Product ID is required" });
      }

      const cartItem = await Cart.findOne({
        UserId: userId,
        productId: productId.trim(),
      });

      if (!cartItem) {
        return res
          .status(404)
          .json({ status: false, message: "Product not found in cart" });
      }

      if (cartItem.quantity === 1) {
        return res.status(200).json({
          status: false,
          message: "Cannot decrement. Only one item left in cart.",
          cartItem: { _id: cartItem._id, quantity: cartItem.quantity },
        });
      }

      const productPrice = cartItem.totalPrice / cartItem.quantity;
      const productCalories = cartItem.totalCalories / cartItem.quantity;
      cartItem.quantity -= 1;
      cartItem.totalPrice -= productPrice;
      cartItem.totalCalories -= productCalories;
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

  calculateAndFetchCalorieDifference: async (req, res) => {
    const userId = req.user.id;

    try {
      const dietInfo = await DietInfo.findOne({ userId });
      if (!dietInfo) {
        return res.status(404).json({
          status: false,
          message: "Diet information not found for this user",
        });
      }

      const cartItems = await Cart.find({ UserId: userId });
      const totalCaloriesInCart = cartItems.reduce(
        (sum, item) => sum + item.totalCalories,
        0
      );

      const dietGoalCalories = dietInfo.macronutrientGoals.calories;
      const calorieDifference = dietGoalCalories - totalCaloriesInCart;

      await User.findByIdAndUpdate(userId, {
        $set: { calorieDifference },
      });

      res.status(200).json({
        status: true,
        message: "Calorie difference calculated and fetched successfully",
        calorieDifference,
        dietGoalCalories,
        totalCaloriesInCart,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
