const express = require('express');
const storeOwnerRoutes = express.Router();
const { getDashboard, createOrUpdateStore } = require('../controllers/storOwnerController');

const { verifyToken, requireRole } = require('../middleware/authMiddleware');

storeOwnerRoutes.use(verifyToken, requireRole('STORE_OWNER'));

storeOwnerRoutes.get('/dashboard', getDashboard);
storeOwnerRoutes.post('/store', createOrUpdateStore);
storeOwnerRoutes.put('/store', createOrUpdateStore);

module.exports = storeOwnerRoutes;
