const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// Returns everything the user dashboard needs for one month in a single
// round trip, rather than making the frontend stitch together four
// separate calls.
async function getSummary(req, res, next) {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const [year, mon] = month.split('-').map(Number);
    const start = new Date(year, mon - 1, 1);
    const end = new Date(year, mon, 1);

    const userId = req.user._id;
    const monthFilter = { user: userId, date: { $gte: start, $lt: end } };

    const [budget, totals, byCategory, highest, recent] = await Promise.all([
      Budget.findOne({ user: userId, month }),
      Expense.aggregate([
        { $match: monthFilter },
        { $group: { _id: null, totalSpent: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: monthFilter },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        {
          $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' },
        },
        { $unwind: '$category' },
        {
          $project: {
            _id: 0,
            categoryId: '$category._id',
            name: '$category.name',
            color: '$category.color',
            total: 1,
            count: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),
      Expense.findOne(monthFilter).sort({ amount: -1 }).populate('category', 'name color'),
      Expense.find({ user: userId }).sort({ date: -1 }).limit(5).populate('category', 'name color'),
    ]);

    const totalSpent = totals[0]?.totalSpent || 0;
    const limit = budget?.limit ?? null;
    const remaining = limit != null ? limit - totalSpent : null;

    let status = null;
    if (limit != null) {
      const usedRatio = limit > 0 ? totalSpent / limit : totalSpent > 0 ? Infinity : 0;
      status = usedRatio > 1 ? 'over' : usedRatio >= 0.8 ? 'approaching' : 'within';
    }

    res.json({
      month,
      totalSpent,
      limit,
      remaining,
      status,
      highestExpense: highest || null,
      byCategory,
      recentExpenses: recent,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
