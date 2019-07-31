const express = require('express');

const router = express.Router();

const memberController = require('../controllers/memberController');

router.post('/getMember', memberController.getMember);
router.post('/modifyProfile', memberController.modifyProfile);
router.post('/findMemberByMail', memberController.findMemberByMail);

module.exports = router;