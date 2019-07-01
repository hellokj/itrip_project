const express = require('express');

const router = express.Router();

const poiController = require('../controllers/poiController');

router.get('/get', poiController.getSpots);
router.get('/getNearby', poiController.getNearbySpots);

module.exports = router;