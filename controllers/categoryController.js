const Category = require("../models/Categories");

module.exports = {
  createCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();
      res
        .status(201)
        .json({ status: true, message: "Category saved successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    const id = req.params.id;
    const { title, value, imageUrl } = req.body;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { title, value, imageUrl },
        { new: true }
      );

      if (!updatedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    const id = req.params.id;

    try {
      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!deletedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({}, { __v: 0 });
      res.status(200).json({ status: true, categories });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  patchCategoryImage: async (req, res) => {
    const id = req.params.id;
    const { imageUrl } = req.body;

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { imageUrl },
        { new: true }
      );

      if (!updatedCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Category image updated successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRandomCategories: async (req, res) => {
    try {
      let categories = await Category.aggregate([
        { $match: { value: { $ne: "more" } } },
        { $sample: { size: 7 } },
      ]);

      const moreCategory = await Category.findOne({ value: "more" });
      if (moreCategory) {
        categories.push(moreCategory);
      }

      res.status(200).json({ status: true, categories });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
