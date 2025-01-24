const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const { verifyAdmin } = require("../middleware/verifyToken");

router.put("/:id", categoryController.updateCategory);
router.post("/", categoryController.createCategory);
router.delete("/:id", verifyAdmin, categoryController.deleteCategory);
router.post("/image/:id", categoryController.patchCategoryImage);

router.get("/", categoryController.getAllCategories);
router.get("/random", categoryController.getRandomCategories);

module.exports = router;
