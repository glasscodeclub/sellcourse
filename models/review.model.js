const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
	   type: Date,
	   default: Date.now
    }

});

module.exports = mongoose.model('Review', ReviewSchema);