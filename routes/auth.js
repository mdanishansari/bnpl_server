const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController')

router.post('/autologin', AuthController.userlogin);

module.exports = router;