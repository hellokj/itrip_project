const express = require('express');

const router = express.Router();

const shareController = require('../controllers/shareController');

router.post('/shareItineraries', shareController.shareItineraries);
router.get('/getSharedItineraries', shareController.getSharedItineraries);
router.post('/update', shareController.update);

module.exports = router;