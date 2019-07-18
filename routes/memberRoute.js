const express = require('express');

const router = express.Router();

const memberController = require('../controllers/memberController');

router.post('/modifyItinerary', memberController.modifyItinerary);
router.post('/setProfile', memberController.setProfile);
router.post('/reviewItineraries', memberController.reviewItineraries);

module.exports = router;