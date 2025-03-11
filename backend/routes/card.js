const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart, mergeCarts} = require('../controllers/cart.js');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/api/cart', getCart);
router.post('/api/cart/add', addToCart);
router.delete('/api/cart/remove/:productId', authenticateToken, removeFromCart);
router.delete('/api/cart/clear', clearCart);
router.post('/api/merge', authenticateToken, mergeCarts);

module.exports = router;


