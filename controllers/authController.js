const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const Retailer = require('../models/retailer');
const User = require('../models/user');
const constants = require('../common/constants')

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

exports.createDashboardUser = async (req, res, next) => {
    const reqBody = req.body;
    const pass = reqBody.password;
    const salt = await bcrypt.genSalt(10);
    const reqUser = req.user;
    if (reqUser.userType != constants.dashboardUserType.SUPER_ADMIN) {
        res.status(403).
            json({
                success: false,
                message: "User creation forbidden."
            })
    }
    reqBody.password = await bcrypt.hash(pass, salt);
    const user = new User({
        email: reqBody.email,
        name: reqBody.name,
        password: reqBody.password,
        userType: constants.dashboardUserType.NORMAL_USER
    })
    user.save()
        .then(userData => {
            res.status(200)
                .json({
                    success: true,
                    message: "User created"
                })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                success: false,
                message: error.message
            })
        })
}

exports.dashboardUserlogin = (req, res, next) => {
    const reqBody = req.body;
    const loggedInEmail = reqBody.email.trim();
    const loggedInPass = reqBody.password.trim();
    User.findOne({ email: loggedInEmail })
        .then(userData => {
            if (!userData) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        message: 'Authentication Failure!.Email or password does not match.'
                    })
            }
            const valid = bcrypt.compareSync(loggedInPass, userData.password);
            if (!valid) {
                return res
                    .status(401)
                    .json({
                        message: 'Authentication Failure!.Email or password does not match.'
                    })
            }
            const token = jwt
                .sign(
                    {
                        id: userData.userId, type: account.userType, name: account.userName, branch: account.branch
                    }, config.get('jwtPrivateKey'));
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                success: false,
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