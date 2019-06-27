const express = require('express');

const router = express.Router();

const poiController = require('../controllers/poiController');

router.get('/get', poiController.getAllPlaces);

module.exports = router;