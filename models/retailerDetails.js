const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../common/constants')

const retailerDetailsSchema = new Schema({
    retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'Retailer', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: Number, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    pan: { type: String, required: true },
    creditOffer: { type: Number }, // Offer provided by Flexiloan
    offerAccepted: { type: Boolean }, // Flexiloan accepted by user
    aadhaar: { type: Number, required: true },
    city: { type: String },
    state: { type: String },
    pincode: { type: String, required: true },
    amount: { type: Number },
    status: { type: String },
    consent: { type: Boolean, required: true },
    docPath: { type: String },
    gstPath: { type: String },
    docType: { type: String, default: 'none' },
    docValue: { type: String, default: constants.ImageValue.PENDING },
    gstValue: { type: String, default: constants.ImageValue.PENDING },
    loanCode: { type: String },
    leadCode: { type: String },
    createDate: { type: Date, required: true, default: Date.now },
    lastUpdate: { type: Date, default: null }
})

module.exports = mongoose.model('RetailerDetails', retailerDetailsSchema);