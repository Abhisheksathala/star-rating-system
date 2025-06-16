const express = require('express');
const storeOwnerRoutes = express.Router();
const { getDashboard } = require('../controllers/storOwnerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

storeOwnerRoutes.use(verifyToken, requireRole('STORE_OWNER'));

storeOwnerRoutes.get('/dashboard', getDashboard);

module.exports = router;
