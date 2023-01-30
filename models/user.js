const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../common/constants')

const userSchema = new Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    userType: {
        type: String
    },
    isActive: {
        type: Boolean, default: true
    },
    createDate: {
        type: Date, required: true, default: Date.now
    },
    lastUpdate: {
        type: Date, default: null
    }
})

module.exports = mongoose.model('User', userSchema);