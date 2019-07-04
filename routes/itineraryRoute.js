const express = require('express');

const router = express.Router();

const itineraryController = require('../controllers/itineraryController');

router.post('/save', itineraryController.save);

module.exports = router;