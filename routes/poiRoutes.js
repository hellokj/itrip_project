const express = require('express');

const router = express.Router();

const poiController = require('../controllers/poiController');

router.get('/get', poiController.getPlaces);

module.exports = router;