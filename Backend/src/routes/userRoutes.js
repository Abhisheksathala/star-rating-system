const express = require('express');
const router = express.Router();
const { getStores, submitRating, modifyRating } = require('../controllers/userController');

const { verifyToken, requireRole } = require('../middleware/authMiddleware.js');

router.use(verifyToken, requireRole('USER'));

router.get('/stores', getStores);
router.post('/rate', submitRating);
router.put('/rate', modifyRating);

module.exports = router;
