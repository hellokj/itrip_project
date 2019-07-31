const express = require('express');

const router = express.Router();

const itineraryController = require('../controllers/itineraryController');

router.post('/save', itineraryController.save);
router.post('/getItineraries', itineraryController.getItineraries);
router.post('/removeMember', itineraryController.removeMember);

module.exports = router;