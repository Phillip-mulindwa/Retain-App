const express = require('express');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const { getInsights } = require('../controllers/admin.controller');

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get('/insights', getInsights);

module.exports = router;
