const express = require('express');
const router = express.Router();
const { createAbone, getAbones } = require('../controllers/abone');

router.post('/api/abone/add', createAbone);     
router.get('/api/abones', getAbones);

module.exports = router;