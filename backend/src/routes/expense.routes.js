const express = require('express');
const requireAuth = require('../middleware/auth');
const {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

const router = express.Router();

// Every expense route is user-scoped - requireAuth plus a user: req.user._id
// filter in the controller means nobody can ever read or touch someone
// else's expenses, even by guessing an id.
router.use(requireAuth);

router.get('/', listExpenses);
router.post('/', createExpense);
router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
