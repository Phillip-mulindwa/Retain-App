const Category = require('../models/Category');
const Expense = require('../models/Expense');

async function listCategories(_req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required.' });

    const category = await Category.create({ name, color, createdBy: req.user._id });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    const { name, color } = req.body;
    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;
    await category.save();

    res.json({ category });
  } catch (err) {
    next(err);
  }
}

// Deleting a category must never orphan expenses. Every expense pointing
// at it gets reassigned to the "Uncategorized" default category first,
// and the default category itself can never be deleted.
async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });

    if (category.isDefault) {
      return res.status(400).json({ message: 'The default Uncategorized category cannot be deleted.' });
    }

    const fallback = await Category.findOne({ isDefault: true });
    if (!fallback) {
      return res.status(500).json({ message: 'No default category exists to reassign expenses to.' });
    }

    const { modifiedCount } = await Expense.updateMany(
      { category: category._id },
      { category: fallback._id }
    );
    await category.deleteOne();

    res.json({ message: 'Category deleted.', reassignedExpenses: modifiedCount });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
