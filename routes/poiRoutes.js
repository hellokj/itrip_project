const express = require('express');

const router = express.Router();

const poiController = require('../controllers/poiController');
const authController = require('../controllers/authController');

router.get('/get', poiController.getSpots);
router.get('/getNearby', poiController.getNearbySpots);
//router.get('/getToken', authController.getToken);

module.exports = router;