const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/storOwnerController.js');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.use(verifyToken, requireRole('STORE_OWNER'));

router.get('/dashboard', getDashboard);

module.exports = router;
