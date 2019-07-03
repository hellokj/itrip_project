const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const poiRoutes = require('./poiRoutes');

const itiRoutes = require('./itineraryRoute')

router.use('/poi', poiRoutes);
router.use('/itinerary', itiRoutes);

// 上面 => 不用驗證 
//router.use(authController.checkToken);
// 下面 => 要驗證

module.exports = router;