const { text } = require('body-parser');
const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
    code:{
        type: String
    },
    disPercent: {
        type: Number,
        required: true
    },
    maxValue: {
        type: Number,
        required: true
    },
    expiresOn: {
        type: Date,
        default: () => Date.now() + 10*24*60*60*1000 
    }
});

module.exports = mongoose.model('Discount', DiscountSchema);