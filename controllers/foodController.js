const Food = require("../models/Foods");

module.exports = {
  addFood: async (req, res) => {
    const newBody = addFields(req.body);
    console.log(newBody);
    const newFood = new Food(newBody);
    const foodId = req.params.id;
    const { tag } = req.body;

    try {
      console.log("Food ID:", foodId);
      console.log("Tag to add:", tag);
      await newFood.save();

      res
        .status(200)
        .json({ status: true, message: "Food added successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }

      res.status(200).json(food);
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "failed to get a food items" });
    }
  },

  getAllFoods: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const foods = await Food.find({ restaurant: restaurantId });

      if (!foods || foods.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No food items found" });
      }
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findOneAndDelete(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }

      await Food.findByIdAndDelete(foodId);

      res
        .status(200)
        .json({ status: true, message: "Food deleted successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  foodAvailability: async (req, res) => {
    const foodId = req.params.id;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }
      food.isAvailable = !food.isAvailable;

      await food.save();
      res.status(200).json({
        status: true,
        message: "Food availability updated successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateFoodById: async (req, res) => {
    const foodId = req.params.id;

    try {
      const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedFood) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }
      res.status(200).json({
        status: true,
        message: "Food updated successfully",
        food: updatedFood,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  addFoodTag: async (req, res) => {
    const foodId = req.params.id;
    const { tag } = req.body;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res
          .status(404)
          .json({ status: false, message: "Food not found" });
      }

      if (food.foodTags.includes(tag)) {
        return res
          .status(400)
          .json({ status: false, message: "Tag already exists" });
      }

      food.foodTags.push(tag);
      await food.save();

      res.status(200).json({
        status: true,
        message: "Tag added successfully",
        food: food,
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomFoodByCode: async (req, res) => {
    try {
      const randomFoodItem = await Food.aggregate([
        { $match: { code: req.params.code } },
        { $sample: { size: 5 } },
        { $project: { _id: 0 } },
      ]);
      res.status(200).json(randomFoodItem);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  addFoodType: async (req, res) => {
    const foodId = req.params.id;
    const foodType = req.body.foodType;

    try {
      const food = await Food.findById(foodId);

      if (!food) {
        return res.status(404).json({ status: false, message: error.message });
      }

      if (food.foodType.includes(foodType)) {
        return res
          .status(40)
          .json({ status: false, message: "Food Type already exists" });
      }

      food.foodType.push(foodType);
      await food.save();
      res.status(200).json({
        status: true,
        message: "Food Type added successfully",
        food: food,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomByCategoryAndCode: async (req, res) => {
    const { category, code } = req.params;

    try {
      let foods = await Food.aggregate([
        { $match: { category: category, code: code } },
        { $sample: { size: 10 } },
      ]);

      if (!foods || foods.length === 0) {
        foods = await Food.aggregate([
          { $match: { code: code } },
          { $sample: { size: 10 } },
        ]);
      }
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getFoodByRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const foods = await Food.find({ restaurant: restaurantId });

      if (!foods || foods.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No food items found for this restaurant",
        });
      }
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
  searchFood: async (req, res) => {
    const title = req.query.title;

    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Title query parameter is required",
      });
    }

    try {
      const food = await Food.find({
        title: { $regex: title, $options: "i" },
      });

      if (food.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No food found matching the title",
        });
      }

      res.status(200).json({
        status: true,
        message: "Food found successfully",
        food,
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  // getAllFoods: async (req, res) => {
  //   try {
  //     const food = await Food.find(); // No filtering, get all foods

  //     if (!food || Food.length === 0) {
  //       return res
  //         .status(404)
  //         .json({ status: false, message: "No food items found" });
  //     }
  //     res.status(200).json({
  //       status: true,
  //       message: "All foods retrieved successfully",
  //       food,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: error.message });
  //   }
  // },
};
function addFields(body) {
  return {
    ...body,
    cookingTime: `${Math.floor(Math.random() * 46) + 15} min`,
    rating: Math.floor(Math.random() * 5) + 1,
  };
}
