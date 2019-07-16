const express = require('express');

const router = express.Router();

const memberController = require('../controllers/memberController');

router.post('/modify', memberController.modify);

module.exports = router;