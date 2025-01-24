const Restaurant = require("../models/Restaurant");

module.exports = {
  // addRestaurant: async (req, res) => {
  //   const newRestaurant = new Restaurant(req.body);
  //   try {
  //     await newRestaurant.save();
  //     res
  //       .status(201)
  //       .json({ status: true, message: "Restaurant successfully created" });
  //   } catch (error) {
  //     res.status(500).json({
  //       status: false,
  //       message: "Error creating restaurant",
  //       error: error.message || error,
  //     });
  //   }
  // },

  addRestaurant: async (req, res) => {
    const newBody = addFields(req.body);
    console.log(newBody);
    const newRestaurant = new Restaurant(newBody);
    const restaurantId = req.params.id;
    const { tag } = req.body;

    try {
      console.log("Restaurant ID:", restaurantId);
      console.log("Tag to add:", tag);
      await newRestaurant.save();

      res
        .status(200)
        .json({ status: true, message: "Restaurant added successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  serviceAvaibility: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }
      restaurant.isAvailable = !restaurant.isAvailable;

      await restaurant.save();
      res.status(200).json({
        status: true,
        message: "Availability successfully toggled",
        isAvailable: restaurant.isAvailable,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error toggling restaurant availability",
        error,
      });
    }
  },

  deleteRestaurant: async (req, res) => {
    const restaurantId = req.params;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res
          .status(403)
          .json({ status: false, message: "Restaurant not found" });
      }

      await Restaurant.findByIdAndDelete(restaurantId);
      res
        .status(200)
        .json({ status: true, message: "Restaurant successfully deleted" });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error deleting restaurant ",
        error,
      });
    }
  },

  getRestaurant: async (req, res) => {
    const restaurantId = req.params.id;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }

      res.status(200).json({ restaurant });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error retrieving restaurant",
        error,
      });
    }
  },

  searchRestaurant: async (req, res) => {
    const title = req.query.title;

    try {
      const restaurants = await Restaurant.find({
        title: { $regex: title, $options: "i" },
      });

      if (restaurants.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No restaurants found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Restaurants found",
        restaurants,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error retrieving restaurant",
        error: error.message,
      });
    }
  },

  getRandomRestaurant: async (req, res) => {
    try {
      let randomRestaurant = [];

      if (req.params.code) {
        randomRestaurant = await Restaurant.aggregate([
          { $match: { code: req.params.code } },
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (!randomRestaurant.length) {
        randomRestaurant = await Restaurant.aggregate([
          { $sample: { size: 5 } },
          { $project: { __v: 0 } },
        ]);
      }

      if (randomRestaurant.length) {
        res.status(200).json(randomRestaurant);
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error finding restaurant" });
    }
  },
};

function addFields(body) {
  return {
    ...body,
    time: `${Math.floor(Math.random() * 46) + 15} min`,
    rating: Math.floor(Math.random() * 5) + 1,
  };
}
