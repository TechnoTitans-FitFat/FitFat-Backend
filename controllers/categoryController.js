const Category = require("../models/Categories");

module.exports = {
  createCategory: async (req, res) => {
    const newCategory = new Category(req.body);

    try {
      await newCategory.save();

      res
        .status(201)
        .json({ status: true, message: "Category saved successfully" });
    } catch (err) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    const id = req.params.id;
    const { title, value, imageUrl } = req.body;

    try {
      const updateCategory = await Category.findByIdAndDelete(
        req.params.id,
        {
          title: title,
          value: value,
          imageUrl: imageUrl,
        },
        { new: true }
      );

      if (!updateCategory) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found" });
      }

      res
        .status(200)
        .json({ status: true, message: "Category updates successfully" });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    const id = req.param.id;

    try {
      const deletedCategory = await Category.findByIdAndDelete(id);

      if (!Category) {
        return res
          .status(404)
          .json({ status: false, message: "Category not found" });
      }
      await Category.findByIdAndDelete(id);

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
    const imageUrl = req.body;
    try {
      const existingCategory = Category.findById(id);

      const updateCategory = new Category({
        title: existingCategory.title,
        value: existingCategory.value,
        imageUrl: imageUrl,
      });

      await updateCategory.save();

      res
        .status(200)
        .json({ status: true, message: "Category image updated successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ status: false, message: "Category not found" });
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

      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
