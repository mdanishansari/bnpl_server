const mongoose = require('mongoose');
const constant = require('../common/constants');
const RetailerDetails = require('../models/retailerDetails');
const Retailer = require('../models/retailer');
const FlexiAPI = require('../middleware/flexiapi');

exports.addRetailerDetails = (req, res, next) => {
    const body = req.body;
    var retailer = req.retailer;
    var retailerDetails = new RetailerDetails({
        retailer: retailer.id,
        firstName: body.firstName,
        lastName: body.lastName,
        mobile: body.mobile,
        dob: body.dob,
        email: body.email,
        gender: body.gender,
        address: body.address,
        pan: body.pan,
        aadhaar: body.aadhaar,
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        amount: body.amount,
        consent: body.consent,
        status: constant.RETAILER_STATUS.CONFIRMED
    })
    const flexiAddPromise = FlexiAPI.addRetailerLead(retailerDetails);
    flexiAddPromise
        .then(result => {
            if (result.success) {
                retailerDetails.leadCode = result.data.leadCode;
                retailerDetails.loanCode = result.data.loanCode;
                retailerDetails.save()
                    .then(detailResult => {
                        FlexiAPI.addRetailerLead(detailResult);
                        if (detailResult._id) {
                            res
                                .status(200)
                                .json({
                                    success: true,
                                    status: detailResult.status,
                                    message: "Retailer details added"
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error.message);
                        res.status().json({
                            success: false,
                            message: error.message
                        })
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })
}

exports.getRetailerDetails = (req, res, next) => {
    const retailerId = req.retailer.id;
    RetailerDetails.findOne({ retailer: retailerId })
        .then(retailer => {
            if (retailer) {
                return res.status(200)
                    .json({
                        success: true,
                        retailer: retailer,
                        message: 'Retailer found'
                    })
            }
            else {
                return res.status(200)
                    .json({
                        success: false,
                        message: 'Some thing went wrong on server.'
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })
}

exports.fetchAgreement = (req, res, next) => {
    const reqBody = req.body;
    const fetchAgreementPromise = FlexiAPI.fetchAgreement(reqBody.loanCode);
    fetchAgreementPromise
        .then(res => {
            if (res.success) {
                var fetchdata = res.data.form_data.mitc;
                res.status(200)
                    .json({
                        success: true,
                        label: fetchdata.label,
                        description: fetchdata.description,
                        content: fetchdata.content
                    })
            }
            else {
                res.status(200)
                    .json({
                        success: false,
                        message: res.data.message
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })
}

exports.initiateAgreement = (req, res, next) => {
    const reqBody = req.body;
    const initiateAgreementPromise = FlexiAPI.initiateAgreement(reqBody.mobile, reqBody.loanCode);
    initiateAgreementPromise
        .then(res => {
            if (res.success) {
                var fetchdata = res.data.form_data.mitc;
                res.status(200)
                    .json({
                        success: true,
                        label: fetchdata.label,
                        description: fetchdata.description,
                        content: fetchdata.content
                    })
            }
            else {
                res.status(200)
                    .json({
                        success: false,
                        message: res.data.message
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })
}

exports.signAgreementWithOTP = (req, res, next) => {

}

exports.downloadAgreement = (req, res, next) => {

}

exports.updateRetailerDetails = (req, res, next) => {
    const reqbody = req.body;
    const retailerId = req.retailer.id;
    const currentDate = Date.now();
    const flexiUpdatePromise = FlexiAPI.updateRetailerLead(reqbody);
    flexiUpdatePromise
        .then(result => {
            if (result) {
                RetailerDetails.updateOne(
                    { retailer: retailerId },
                    {
                        $set: {
                            firstName: reqbody.firstName,
                            lastName: reqbody.lastName,
                            dob: reqbody.dob,
                            gender: reqbody.gender,
                            address: reqbody.address,
                            pan: reqbody.pan,
                            status: constant.RETAILER_STATUS.OFFER_CALCULATING,
                            lastUpdate: currentDate
                        }
                    })
                    .then(detailResult => {
                        return res.status(200)
                            .json({
                                success: true,
                                status: constant.RETAILER_STATUS.OFFER_CALCULATING,
                                message: 'Retailer updated succesfully'
                            })
                    })
                    .catch(error => {
                        console.log(error.message);
                        res.status().json({
                            success: false,
                            message: error.message
                        })
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })
}


exports.updateDocumentDetails = (req, res, next) => {
    const file = req.file;
    const type = req.body.type;
    const path = req.body.path;
    const retailerId = req.retailer.id;
    if (!file) {
        res
            .status(400)
            .json({
                message: "No image found."
            })
    }
    const imageUrl = '/images/' + path + "/" + file.filename;
    const currentDate = Date.now();
    var findQuery = { retailer: retailerId };
    var updateDocument = {};
    if (path == 'residential') {
        updateDocument = {
            $set: {
                docPath: imageUrl,
                docType: type,
                docValue: constant.ImageValue.UPDATED,
                lastUpdate: currentDate
            }
        }
    }
    else {
        updateDocument = {
            $set: {
                gstPath: imageUrl,
                gstValue: constant.ImageValue.UPDATED,
                lastUpdate: currentDate
            }
        }
    }
    RetailerDetails.updateOne(findQuery, updateDocument)
        .then(result => {
            console.log('imag saved');
            const flexiUploadDocPromise = FlexiAPI.uploadRetailerDoc(file)
            flexiUploadDocPromise
                .then(uploadRes => {
                    res.status(200).json({
                        success: true,
                        message: "Documents updated successfully"
                    })
                })
                .catch(error => {
                    console.log(error.message);
                    res.status().json({
                        success: false,
                        message: error.message
                    })
                })
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                success: false,
                message: error.message
            })
        })

}