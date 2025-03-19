const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const watercanController = require('../controller/watercanController');
router.post('/create', watercanController.createWatercan);
router.get('/getAllWatercans', watercanController.getAllWatercan);

module.exports = router;