const express = require('express');
const adminRoutes = express.Router();
const {
  getDashboard,
  addUser,
  addStore,
  getStores,
  getUsers,
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

adminRoutes.use(verifyToken, requireRole('ADMIN'));
adminRoutes.get('/dashboard', getDashboard);
adminRoutes.post('/users', addUser);
adminRoutes.post('/stores', addStore);
adminRoutes.get('/stores', getStores);
adminRoutes.get('/users', getUsers);

module.exports = adminRoutes;

//
