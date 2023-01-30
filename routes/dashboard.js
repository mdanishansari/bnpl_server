const express = require('express');
const router = express.Router();

const RetailerController = require('../controllers/retailerController')
const AuthController = require('../controllers/authController')
const authorization = require('../middleware/auth')

router.post('/login', AuthController.dashboardUserlogin);

router.post('/create', AuthController.createDashboardUser);



module.exports = router;