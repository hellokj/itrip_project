const express = require('express');

const router = express.Router();

// Routes
const authRoutes = require('./authRoute');
const spotRoutes = require('./spotRoute');
const itiRoutes = require('./itineraryRoute');
const memberRoutes = require('./memberRoute');

// Auth controller
const authController = require('../controllers/authController');

router.use('/spot', spotRoutes);
router.use('/auth', authRoutes);

// 上面 => 不用驗證 
router.use(authController.checkToken);
// 下面 => 要驗證

router.use('/itinerary', itiRoutes);
router.use('/member', memberRoutes);

module.exports = router;