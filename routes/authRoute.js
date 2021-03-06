const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signUp', authController.signUp);
router.post('/logIn', authController.logIn);
router.post('/fbLogIn', authController.fbLogIn);

module.exports = router;