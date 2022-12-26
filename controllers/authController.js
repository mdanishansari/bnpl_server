const jwt = require('jsonwebtoken');
const config = require('config');

const Retailer = require('../models/retailer');

exports.userlogin = (req, res, next) => {
    const tokenType = "BEARER";
    const loginId = req.body.retailerId;
    const retailerPromise = getRetailer(loginId);
    retailerPromise
        .then(retailer => {
            const token = jwt.sign(
                {
                    id: retailer._id
                },
                config.get('jwtPrivateKey'),
                {
                    expiresIn: '24h'
                }
            );
            res.status(200).
                json({
                    succes: true,
                    token: token,
                    tokenType: tokenType,
                    status: retailer.status
                })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: error.message
            })
        })
}

function getRetailer(loginId) {
    return new Promise((resolve, reject) => {
        checkRetailer(loginId)
            .then(retailerPresent => {
                // Retailer already exists
                if (retailerPresent._id) {
                    resolve(retailerPresent);
                }
            })
            .catch(err => {
                // Retailer newly created exists
                if (err === "false") { //checkRetailer return false if retailer is not present
                    createRetailer(loginId)
                        .then(createdRetailer => {
                            if (createdRetailer._id) {
                                resolve(createdRetailer);
                            }
                        })
                        .catch(err => {
                            reject(err)
                        })
                }
            })
    })
}

function createRetailer(loginId) {
    return new Promise((resolve, reject) => {
        let retailer = new Retailer({
            retailerId: loginId
        });
        retailer.save()
            .then(result => {
                if (result) {
                    resolve(result)
                }
            })
            .catch(err => {
                reject(err.message)
            })
    });
}

function checkRetailer(loginId) {
    return new Promise((resolve, reject) => {
        Retailer.findOne({ retailerId: loginId })
            .then(result => {
                if (result) {
                    resolve(result)
                }
                else {
                    reject("false")
                }
            })
            .catch(err => {
                reject(err.message)
            })
    });
}