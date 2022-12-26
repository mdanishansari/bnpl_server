const express = require('express');
const router = express.Router();

const RetailerController = require('../controllers/retailerController')
const authorization = require('../middleware/auth')

router.post('/add-details', authorization, RetailerController.addRetailerDetails);

router.post('/confirm-details', RetailerController.updateRetailerDetails);

module.exports = router;