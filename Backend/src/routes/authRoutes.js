const express = require('express');
const authRoutes = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.put('/update-password', verifyToken, updatePassword);

module.exports = authRoutes;
