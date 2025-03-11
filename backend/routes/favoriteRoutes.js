const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const favoriteController = require('../controllers/favorite');

router.get('/api/favorites', authenticateToken, favoriteController.getFavorites);
router.post('/api/favorites/add', authenticateToken, favoriteController.addToFavorites);
router.delete('/api/favorites/remove/:productId', authenticateToken, favoriteController.removeFromFavorites);
router.get('/api/favorites/check/:productId', authenticateToken, favoriteController.checkFavoriteStatus);

module.exports = router;