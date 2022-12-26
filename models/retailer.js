const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../common/constants')

const retailerSchema = new Schema({
    retailerId: {
        type: String, required: true
    },
    status: {
        type: String, required: true, default: constants.RETAILER_STATUS.DETAILS
    },
    createDate: {
        type: Date, required: true, default: Date.now
    },
    lastUpdate: {
        type: Date, default: null
    }
})

module.exports = mongoose.model('Retailer', retailerSchema);