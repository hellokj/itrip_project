const express = require('express');

const router = express.Router();

const poiRoutes = require('./poiRoutes');

router.use('/poi', poiRoutes);

module.exports = router;