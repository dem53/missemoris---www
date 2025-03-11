const express = require('express');
const router = express.Router();
const { createPayment, getPayments, getUserPayments } = require('../controllers/payment');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/api/payment/process', createPayment);
router.get('/api/payments', authenticateToken, isAdmin, getPayments);
router.get('/api/payment/kullanici', authenticateToken, getUserPayments);

module.exports = router;

