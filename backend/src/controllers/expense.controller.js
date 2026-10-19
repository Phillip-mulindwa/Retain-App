const Expense = require('../models/Expense');
const Category = require('../models/Category');

const SORT_FIELDS = { date: 'date', amount: 'amount' };

// Builds the mongoose filter object shared by list + any future export
// endpoint, straight from the query string the Redux filter slice sends.
function buildFilter(userId, query) {
  const filter = { user: userId };

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { notes: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.category) filter.category = query.category;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  if (query.dateFrom || query.dateTo) {
    filter.date = {};
    if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.date.$lte = new Date(query.dateTo);
  }

  if (query.amountMin || query.amountMax) {
    filter.amount = {};
    if (query.amountMin) filter.amount.$gte = Number(query.amountMin);
    if (query.amountMax) filter.amount.$lte = Number(query.amountMax);
  }

  return filter;
}

async function listExpenses(req, res, next) {
  try {
    const filter = buildFilter(req.user._id, req.query);

    const sortField = SORT_FIELDS[req.query.sortBy] || 'date';
    const sortDir = req.query.sortDir === 'asc' ? 1 : -1;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate('category', 'name color')
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments(filter),
    ]);

    res.json({
      expenses,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
}

async function getExpense(req, res, next) {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'category',
      'name color'
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    res.json({ expense });
  } catch (err) {
    next(err);
  }
}

async function createExpense(req, res, next) {
  try {
    const { title, amount, category, date, paymentMethod, notes } = req.body;
    if (!title || amount == null || !category || !date || !paymentMethod) {
      return res.status(400).json({ message: 'Title, amount, category, date and payment method are required.' });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return res.status(400).json({ message: 'That category does not exist.' });

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      paymentMethod,
      notes,
    });
    await expense.populate('category', 'name color');

    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
}

async function updateExpense(req, res, next) {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });

    const { title, amount, category, date, paymentMethod, notes } = req.body;
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = date;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (notes !== undefined) expense.notes = notes;

    await expense.save();
    await expense.populate('category', 'name color');

    res.json({ expense });
  } catch (err) {
    next(err);
  }
}

async function deleteExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });
    res.json({ message: 'Expense deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listExpenses, getExpense, createExpense, updateExpense, deleteExpense, buildFilter };
