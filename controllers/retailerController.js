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
        consent: body.consent
    })
    retailerDetails.save()
        .then(detailResult => {
            if (detailResult._id) {
                FlexiAPI.addLead(detailResult)

                res
                    .status(200)
                    .json({
                        success: true,
                        message: "Retailer details added"
                    })
            }
        })
        .catch(error => {
            console.log(error.message);
            res.status().json({
                message: error.message
            })
        })
}

exports.updateRetailerDetails = (req, res, next) => {
    const body = req.body;
    const retailerId = req.params.id;
    const currentDate = Date.now;

    retailerDetails.updateOne(
        { _id: retailerId },
        {
            $set: {
                fullName: body.fullName,
                dob: body.dob,
                gender: body.gender,
                address: body.address,
                pan: body.pan,
                lastUpdate: currentDate
            }
        })
        .then(detailResult => {

        })
        .catch(error => {

        })
}