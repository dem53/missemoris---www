const express = require('express');
const router = express.Router();
const { createHavale, getHavales, updateHavale, getUserHavales, deleteHavale } = require('../controllers/havale');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');


router.post('/api/odeme/havale', createHavale);

router.get('/api/odeme/havaleler', authenticateToken, isAdmin, getHavales);

router.patch('/api/odeme/havale/:id', authenticateToken,  updateHavale);

router.delete('/api/odeme/havale/:id', authenticateToken, isAdmin, deleteHavale);

router.get('/api/odeme/havale/kullanici', authenticateToken, getUserHavales);

module.exports = router;