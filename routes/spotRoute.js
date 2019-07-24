const express = require('express');

const router = express.Router();

const spotController = require('../controllers/spotController');

router.get('/get', spotController.getSpots);
router.get('/getNearby', spotController.getNearbySpots);
router.post('/update', spotController.updateSpot);

module.exports = router;