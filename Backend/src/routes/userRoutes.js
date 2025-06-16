const express = require('express');
const userRoutes = express.Router();
const { getStores, submitRating, modifyRating } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

userRoutes.use(verifyToken, requireRole('USER'));

userRoutes.get('/stores', getStores);
userRoutes.post('/rate', submitRating);
userRoutes.put('/rate', modifyRating);

module.exports = userRoutes;
