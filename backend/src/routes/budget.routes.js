const express = require('express');
const requireAuth = require('../middleware/auth');
const { getBudget, setBudget } = require('../controllers/budget.controller');

const router = express.Router();

router.use(requireAuth);

// :month is "YYYY-MM" - matches what the frontend's month picker produces.
router.get('/:month', getBudget);
router.put('/:month', setBudget);

module.exports = router;
