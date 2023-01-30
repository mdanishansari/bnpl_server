const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');

const constants = require('../common/constants');

module.exports.addRetailerLead = (retailerData) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                const promiseDetails = addDetailsToFlexiAPI(retailerData, token, tokenType);
                promiseDetails
                    .then(result => {
                        resolve(result)
                    })
                    .catch(error => {
                        reject(error)
                    });

            })
            .catch(error => {
                reject(error)
            });
    });
}

module.exports.updateRetailerLead = (retailerData) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                const promiseDetails = updateDetailsToFlexiAPI(retailerData, token, tokenType);
                promiseDetails
                    .then(result => {
                        resolve(result)
                    })
                    .catch(error => {
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    });
}

module.exports.uploadRetailerDoc = () => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                const promiseUpload = uploadDocuments(token, tokenType);
                promiseUpload
                    .then(result => {
                        resolve(result)
                    })
                    .catch(error => {
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    });
}

module.exports.fetchAgreement = (loanCode) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                var config = {
                    method: constants.FLEXI_API.HTTP_VERB_POST,
                    url: constants.FLEXI_API.FETCH_AGREEMENT + loanCode,
                    headers: {
                        'Authorization': tokenType + " " + token
                    }
                };
                axios(config)
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        console.log('error in fetchAgreement ', error);
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    });
}

module.exports.initiateAgreement = (mobile, loanCode) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                var data = JSON.stringify({
                    "mobile_no": mobile,
                    "loan_code": loanCode
                });
                var config = {
                    method: constants.FLEXI_API.HTTP_VERB_POST,
                    url: constants.FLEXI_API.INITIATE_AGREEMENT,
                    headers: {
                        'Authorization': tokenType + ' ' + token
                    },
                    data: data
                };
                axios(config)
                    .then(function (response) {
                        console.log('res', JSON.stringify(response.data));
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        console.log('error in initiateAgreement ', error);
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    })
}

module.exports.signAgreement = (otp, ip, loanCode) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                var data = JSON.stringify({
                    "otp": otp,
                    "ip_address": ip,
                    "loan_code": loanCode
                });
                var config = {
                    method: constants.FLEXI_API.HTTP_VERB_POST,
                    url: constants.FLEXI_API.SIGN_AGREEMENT,
                    headers: {
                        'Authorization': tokenType + ' ' + token
                    },
                    data: data
                };
                axios(config)
                    .then(function (response) {
                        console.log('res', JSON.stringify(response.data));
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        console.log('error in signAgreement ', error);
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    })
}


module.exports.downloadAgreement = (otp, ip, loanCode) => {
    return new Promise((resolve, reject) => {
        const promiseToken = getUpdatedAuthToken();
        promiseToken
            .then(tokenData => {
                var token = tokenData.access_token;
                var tokenType = tokenData.token_type;
                var config = {
                    method: constants.FLEXI_API.HTTP_VERB_GET,
                    url: constants.FLEXI_API.DOWNLOAD_AGREEMENT,
                    headers: {
                        'Authorization': tokenType + ' ' + token
                    }
                };
                axios(config)
                    .then(function (response) {
                        console.log('res', JSON.stringify(response.data));
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        console.log('error in downloadAgreement ', error);
                        reject(error)
                    });
            })
            .catch(error => {
                reject(error)
            });
    })
}

// Private functions

function addDetailsToFlexiAPI(retailerData, token, tokenType) {
    return new Promise((resolve, reject) => {
        var data = JSON.stringify({
            "first_name": retailerData.firstName,
            "last_name": retailerData.lastName,
            "mobile_no": retailerData.mobile.toString(),
            "email": retailerData.email,
            "loanApplication": {
                "terms_condition_acceptance": retailerData.consent,
                "loanApplicant": {
                    "dob": "1976-02-16",
                    "gender": retailerData.gender,
                    "pan_no": retailerData.pan.toString().toUpperCase(),
                    "aadhaar_no": retailerData.aadhaar,
                    "address_line_1": retailerData.address,
                    "city": retailerData.city,
                    "state": retailerData.state,
                    "pincode": retailerData.pincode
                },
                "loanBusiness": {},
                "loanFinance": {},
                "loanMerchant": {},
                "loanBusinessPartners": [],
                "loanPersonalReferences": []
            }
        });
        var config = {
            method: constants.FLEXI_API.HTTP_VERB_POST,
            url: constants.FLEXI_API.ADD_RETAILER_URL,
            headers: {
                'Authorization': tokenType + ' ' + token,
                'Content-Type': constants.FLEXI_API.CONTENT_TYPE
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                console.log('res', JSON.stringify(response.data));
                resolve(response.data)
            })
            .catch(function (error) {
                console.log('error in addDetailsToFlexiAPI', error);
                reject(error)
            });

    });
}

function updateDetailsToFlexiAPI(retailerData, token, tokenType) {
    return new Promise((resolve, reject) => {
        var data = JSON.stringify({
            "lead_code": retailerData.leadCode,
            "first_name": retailerData.firstName,
            "last_name": retailerData.lastName,
            "loanApplication": {
                "loan_code": retailerData.loanCode,
                "terms_condition_acceptance": retailerData.consent,
                "loanApplicant": {
                    "loan_code": retailerData.loanCode,
                    "dob": "1976-02-16",
                    "pan_no": retailerData.pan.toString().toUpperCase(),
                    "address_line_1": retailerData.address,
                },
                "loanBusiness": {},
                "loanFinance": {},
                "loanMerchant": {},
                "loanBusinessPartners": [],
                "loanPersonalReferences": []
            }
        });
        var config = {
            method: constants.FLEXI_API.HTTP_VERB_PUT,
            url: constants.FLEXI_API.UPDATE_RETAILER_URL + retailerData.leadCode,
            headers: {
                'Authorization': tokenType + ' ' + token,
                'Content-Type': constants.FLEXI_API.CONTENT_TYPE
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                console.log('res', JSON.stringify(response.data));
                resolve(response.data)
            })
            .catch(function (error) {
                console.log('error in addDetailsToFlexiAPI', error);
                reject(error)
            });
    });
}

function uploadDocuments(token, tokenType) {
    return new Promise((resolve, reject) => {
        var data = new FormData();
        data.append('loan_code', '63c2ae3bv6wwh');
        data.append('document_category', 'res_address_proof');
        data.append('document_type', 'aadhar');
        // data.append('file', fs.createReadStream('C:/Users/mohdd/OneDrive/Desktop/01.PNG'));
        data.append('file', fs.createReadStream('C:/Users/mohdd/OneDrive/Desktop/01.PNG'));
        var config = {
            method: 'post',
            url: 'https://console-staging.flexiloans.com/documentservice',
            headers: {
                'Authorization': 'Bearer eyJraWQiOiJySVwvRTAwZmJVKzVCbFBPTTJjRXZRd0U1cHdVK29nbFl4Y2o3YStvVzA4TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMTN0bDFhOG5wa2dzZWEwN2VycXVkdGZmbyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZG9jdW1lbnRcL2NyZWF0ZSBsZWFkXC91cGRhdGUgbG9hbmFwcGxpY2F0aW9uXC9wYXlvdXQuY3JlYXRlIHBhcnRuZXJcL3JlZGlyZWN0bGluay5yZWFkIGxlYWRcL3JlYWQgbG9hbmFwcGxpY2F0aW9uXC9zdGF0dXMucmVhZCBsZWFkXC9jcmVhdGUgbG9hbmFwcGxpY2F0aW9uXC9hcHByb3ZlLnJlYWQgbG9hbmFwcGxpY2F0aW9uXC92aXJ0dWFsQWNjb3VudC5yZWFkIGMyd1wvZG9jdW1lbnQucmVhZCBsb2FuYXBwbGljYXRpb25cL2RlZHVwZS5yZWFkIHBhcnRuZXJcL3JlZGlyZWN0bGluay53cml0ZSBjMndcL2luaXQucmVhZCBjMndcL3dyaXRlIGMyd1wvc2lnbi5yZWFkIGRvY3VtZW50XC9yZWFkIGVtYW5kYXRlXC91cGRhdGUgbG9hbmFwcGxpY2F0aW9uXC9kaXNidXJzZS5yZWFkIGRvY3VtZW50XC9sb29rdXAucmVhZCBiYW5rXC9yZWFkIGxvYW5hcHBsaWNhdGlvblwvYmFua0FjY291bnQud3JpdGUgbG9hbmFwcGxpY2F0aW9uXC9sb2FuT2ZmZXIud3JpdGUgbGVhZFwvbG9hbmFwcGxpY2F0aW9uLnJlYWQgYzJ3XC9pbml0LndyaXRlIGRvY3VtZW50XC9kZWxldGUgZW1hbmRhdGVcL2NyZWF0ZSBwZW5ueWRyb3BcL2NyZWF0ZSBjMndcL3NpZ24ud3JpdGUgYzJ3XC9yZWFkIGRvY3VtZW50XC91cGRhdGUgbG9hbmFwcGxpY2F0aW9uXC9yZXBheW1lbnQucmVhZCIsImF1dGhfdGltZSI6MTY3NDY2NDU4NCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9DcTZUcEE1RnIiLCJleHAiOjE2NzQ2NjgxODQsImlhdCI6MTY3NDY2NDU4NCwidmVyc2lvbiI6MiwianRpIjoiZWYyOTcyNTQtNDI1ZS00MzY0LThiMzgtYTk0YzMxZjE4NWMzIiwiY2xpZW50X2lkIjoiMjEzdGwxYThucGtnc2VhMDdlcnF1ZHRmZm8ifQ.ADcX9A3C49v16BrcV_U0dnk5FNCiTeTnxeHi-FUzVyBY2CWmIYoU00TiO3S72oUnpvRgweE7bgIzxVu8IBBsYc2F-P-RjzXwqTDf4LMj-gzr7syXNGCM2jm031om4UfhELLwuazWhMoc9_AffKOKAaeOc5sGAoGD9qPuX9VtDXelBr3PaM5lFK8EUQouIW_3xtl8iCKCMqC9MsTC82MO6-NFk5eApGQ49ycQszocl7GhK39sfpxR0jJZYxMKDRvga1gF45j-zeh_BOuVCvqVIrATWcJNVcmPfG1DXJHeM83IABVf4yXLV_ATHq-MxIcqEz3qJcIzg96IAFWAMt61IA',
                ...data.getHeaders()
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                resolve(response.data)
            })
            .catch(function (error) {
                console.log(error);
                reject(error)
            });
    });
}

function getUpdatedAuthToken() {
    return new Promise((resolve, reject) => {
        var data = qs.stringify({
            'grant_type': constants.FLEXI_AUTH.Grant_Type,
            'scopes': '*'
        });
        var config = {
            method: 'post',
            url: constants.FLEXI_AUTH.URL,
            headers: {
                'Authorization': constants.FLEXI_AUTH.Authorization_Key + " " + constants.FLEXI_AUTH.Authorization_Token,
                'Content-Type': constants.FLEXI_AUTH.Content_Type,
                'client_id': constants.FLEXI_AUTH.Client_Id,
                'client_secret': constants.FLEXI_AUTH.Client_Secret
            },
            data: data
        };
        axios(config)
            .then(function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                console.log('error in updateDetailsToFlexiAPI', error);
                reject(error)
            });
    });
}