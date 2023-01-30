const express = require('express');
const router = express.Router();

const extracFile = require('../middleware/multer-file');

const RetailerController = require('../controllers/retailerController')
const authorization = require('../middleware/auth')

// Lead routes

router.post('/add-details', authorization, RetailerController.addRetailerDetails);

router.get('/info', authorization, RetailerController.getRetailerDetails);

router.post('/confirm-details', authorization, RetailerController.updateRetailerDetails);

// Doc routes

router.post('/document', authorization, extracFile.updateDoc, RetailerController.updateDocumentDetails);

router.post('/document-status', authorization, RetailerController.updateDocumentDetails);

// Agreement routes

router.get('/fetch-agreement', authorization, RetailerController.fetchAgreement);

router.post('/initiate-agreement', authorization, RetailerController.initiateAgreement);

router.post('/sign-agreement-otp', authorization, RetailerController.signAgreementWithOTP);

router.get('/download-agreement', authorization, RetailerController.downloadAgreement);



module.exports = router;