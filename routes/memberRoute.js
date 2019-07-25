const express = require('express');

const router = express.Router();

const memberController = require('../controllers/memberController');

router.post('/getMember', memberController.getMember);
router.post('/modifyProfile', memberController.modifyProfile);

module.exports = router;