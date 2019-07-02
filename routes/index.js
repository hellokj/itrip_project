const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const poiRoutes = require('./poiRoutes');

router.use('/poi', poiRoutes);

// 上面 => 不用驗證 
//router.use(authController.checkToken);
// 下面 => 要驗證

module.exports = router;