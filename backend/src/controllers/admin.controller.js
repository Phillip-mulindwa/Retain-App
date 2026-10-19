const User = require('../models/User');
const Expense = require('../models/Expense');

// One endpoint, every number the admin dashboard needs - the frontend
// renders it straight into stat cards and two "top/bottom categories"
// lists without any extra requests.
async function getInsights(_req, res, next) {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [totalUsers, totalExpenses, valueAgg, expensesThisMonth, categoryUsage, recentExpenses, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Expense.countDocuments(),
        Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
        Expense.countDocuments({ date: { $gte: monthStart, $lt: monthEnd } }),
        Expense.aggregate([
          { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
          { $unwind: '$category' },
          {
            $project: { _id: 0, categoryId: '$category._id', name: '$category.name', color: '$category.color', total: 1, count: 1 },
          },
          { $sort: { count: -1 } },
        ]),
        Expense.find().sort({ createdAt: -1 }).limit(5).populate('category', 'name color').populate('user', 'name email'),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      ]);

    res.json({
      totalUsers,
      totalExpenses,
      totalValue: valueAgg[0]?.total || 0,
      expensesThisMonth,
      spendingPerCategory: [...categoryUsage].sort((a, b) => b.total - a.total),
      topCategories: categoryUsage.slice(0, 5),
      bottomCategories: [...categoryUsage].sort((a, b) => a.count - b.count).slice(0, 5),
      recentExpenses,
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getInsights };
