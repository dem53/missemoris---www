// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    updateOrder,
    getUserOrders
} = require('../controllers/order');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/api/orders', authenticateToken, createOrder);
router.get('/api/orders/list', authenticateToken, isAdmin, getOrders);
router.patch('/api/orders/:id', authenticateToken, updateOrder);
router.get('/api/orders/user/:userId', authenticateToken, getUserOrders);

module.exports = router;

