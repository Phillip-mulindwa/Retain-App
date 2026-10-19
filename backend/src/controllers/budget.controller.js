const Budget = require('../models/Budget');

async function getBudget(req, res, next) {
  try {
    const budget = await Budget.findOne({ user: req.user._id, month: req.params.month });
    // Not having set a budget yet isn't an error - just means "no limit set".
    res.json({ budget: budget || null });
  } catch (err) {
    next(err);
  }
}

async function setBudget(req, res, next) {
  try {
    const { limit } = req.body;
    if (limit == null || limit < 0) {
      return res.status(400).json({ message: 'A valid, non-negative limit is required.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month: req.params.month },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ budget });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBudget, setBudget };
